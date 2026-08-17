import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const manifest = JSON.parse(await readFile(new URL('../src/route-manifest.json', import.meta.url), 'utf8'));
const template = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function replaceMeta(html, route) {
  const canonical = `${manifest.site.origin}${route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);

  return html
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
}

const indexedRoutes = manifest.routes.filter((entry) => entry.index && entry.path !== '/');
for (const route of indexedRoutes) {
  const target = join(new URL('../dist/', import.meta.url).pathname, route.path.replace(/^\//, ''), 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, replaceMeta(template, route), 'utf8');
}

// POC-only direct shell: deployable and shareable, intentionally absent from the crawl manifest until BlackMask promotion.
const adaptivePlayerRoute = {
  path: '/adaptive-player/',
  title: 'Adaptive PWA Player POC — Kopano Labs',
  description: 'A mobile-first Kopano Labs POC that adapts one governed experience across lite, mobile, enhanced and immersive rendering profiles.',
};
const adaptivePlayerTarget = join(new URL('../dist/', import.meta.url).pathname, 'adaptive-player', 'index.html');
await mkdir(dirname(adaptivePlayerTarget), { recursive: true });
await writeFile(adaptivePlayerTarget, replaceMeta(template, adaptivePlayerRoute), 'utf8');

console.log(`Generated ${indexedRoutes.length} public route HTML shells + 1 non-crawl Adaptive Player POC shell.`);
