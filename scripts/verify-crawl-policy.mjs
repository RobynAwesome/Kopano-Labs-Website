import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../src/route-manifest.json', import.meta.url), 'utf8'));
const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8');

const origin = manifest.site.origin.replace(/\/$/, '');
const routes = [...manifest.routes]
  .filter((route) => route.index && route.crawl)
  .sort((a, b) => a.sitemapOrder - b.sitemapOrder);
const expectedUrls = [
  ...routes.map((route) => `${origin}${route.path}`),
  ...(manifest.indexArtifacts ?? []).map((path) => `${origin}${path}`),
];

if (!origin.startsWith('https://')) {
  throw new Error(`Crawl gate: canonical origin must use HTTPS (${origin})`);
}

if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
  throw new Error('Crawl gate: sitemap.xml is missing the XML declaration');
}
if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
  throw new Error('Crawl gate: sitemap.xml is missing the sitemap urlset namespace');
}
if (/<(?:html|!doctype\s+html)\b/i.test(sitemap)) {
  throw new Error('Crawl gate: sitemap.xml contains HTML; Search Console requires a supported sitemap document');
}

const actualUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (actualUrls.length !== expectedUrls.length) {
  throw new Error(`Crawl gate: sitemap URL count drifted (${actualUrls.length} != ${expectedUrls.length})`);
}

for (let index = 0; index < expectedUrls.length; index += 1) {
  if (actualUrls[index] !== expectedUrls[index]) {
    throw new Error(`Crawl gate: sitemap URL drift at position ${index + 1}: expected ${expectedUrls[index]}, got ${actualUrls[index]}`);
  }
}

if (new Set(actualUrls).size !== actualUrls.length) {
  throw new Error('Crawl gate: sitemap.xml contains duplicate URLs');
}
for (const url of actualUrls) {
  if (!url.startsWith(`${origin}/`)) {
    throw new Error(`Crawl gate: non-canonical sitemap URL detected (${url})`);
  }
}

const robotLines = robots.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const allowLines = robotLines.filter((line) => line.toLowerCase().startsWith('allow:'));
const disallowLines = robotLines.filter((line) => line.toLowerCase().startsWith('disallow:'));
const sitemapDirectives = robotLines.filter((line) => line.toLowerCase().startsWith('sitemap:'));
const expectedSitemapDirective = `Sitemap: ${origin}/sitemap.xml`;

if (!robotLines.includes('User-agent: *')) {
  throw new Error('Crawl gate: robots.txt must include the public User-agent: * group');
}
if (allowLines.filter((line) => line === 'Allow: /').length !== 1) {
  throw new Error('Crawl gate: robots.txt must default public discovery open with exactly one Allow: /');
}
if (disallowLines.some((line) => line === 'Disallow: /')) {
  throw new Error('Crawl gate: robots.txt must never block the entire public site');
}
if (sitemapDirectives.length !== 1 || sitemapDirectives[0] !== expectedSitemapDirective) {
  throw new Error(`Crawl gate: robots.txt must advertise exactly ${expectedSitemapDirective}`);
}
if (!robotLines.includes('Allow: /sitemap.xml')) {
  throw new Error('Crawl gate: robots.txt must explicitly allow /sitemap.xml');
}

const disallowedPrefixes = disallowLines
  .map((line) => line.slice('Disallow:'.length).trim())
  .filter(Boolean);
const publicPaths = [
  ...routes.map((route) => route.path),
  ...manifest.publicArtifacts,
];
for (const path of publicPaths) {
  const blocker = disallowedPrefixes.find((prefix) => path.startsWith(prefix));
  if (blocker) {
    throw new Error(`Crawl gate: public path ${path} is blocked by robots rule Disallow: ${blocker}`);
  }
}

for (const protectedPath of manifest.protectedPaths) {
  if (!robotLines.includes(`Disallow: ${protectedPath}`)) {
    throw new Error(`Crawl gate: protected path ${protectedPath} must remain blocked`);
  }
}

console.log(`Crawl gate passed: ${actualUrls.length} canonical sitemap URLs; public crawl defaults open; ${manifest.protectedPaths.length} protected prefixes remain blocked.`);
