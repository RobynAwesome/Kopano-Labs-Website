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

const expectedSitemapDirective = `Sitemap: ${origin}/sitemap.xml`;
const sitemapDirectives = robots
  .split(/\r?\n/)
  .filter((line) => line.trim().toLowerCase().startsWith('sitemap:'));
if (sitemapDirectives.length !== 1 || sitemapDirectives[0].trim() !== expectedSitemapDirective) {
  throw new Error(`Crawl gate: robots.txt must advertise exactly ${expectedSitemapDirective}`);
}
if (!robots.includes('Allow: /sitemap.xml')) {
  throw new Error('Crawl gate: robots.txt must explicitly allow /sitemap.xml');
}

console.log(`Crawl gate passed: ${actualUrls.length} canonical XML sitemap URLs; robots advertises ${origin}/sitemap.xml.`);
