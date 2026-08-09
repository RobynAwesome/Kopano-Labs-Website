import { readFile, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../src/route-manifest.json', import.meta.url), 'utf8'));
const origin = manifest.site.origin.replace(/\/$/, '');
const routes = [...manifest.routes]
  .filter((route) => route.index && route.crawl)
  .sort((a, b) => a.sitemapOrder - b.sitemapOrder);
const indexArtifacts = manifest.indexArtifacts ?? [];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((route) => `  <url><loc>${origin}${route.path}</loc></url>`),
  ...indexArtifacts.map((path) => `  <url><loc>${origin}${path}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

const robots = [
  '# Kopano Labs crawl guide',
  '# Public discovery is welcome. Follow the public route map; operational surfaces stay out of crawl scope.',
  '',
  'User-agent: *',
  ...routes.map((route) => `Allow: ${route.path}`),
  ...manifest.publicArtifacts.map((path) => `Allow: ${path}`),
  ...manifest.protectedPaths.map((path) => `Disallow: ${path}`),
  '',
  `Sitemap: ${origin}/sitemap.xml`,
  '',
].join('\n');

await writeFile(new URL('../public/sitemap.xml', import.meta.url), sitemap, 'utf8');
await writeFile(new URL('../public/robots.txt', import.meta.url), robots, 'utf8');

console.log(`Generated crawl policy for ${routes.length} public routes and ${indexArtifacts.length} public artifacts.`);
