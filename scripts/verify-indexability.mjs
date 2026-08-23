import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../src/route-manifest.json', import.meta.url), 'utf8'));
const distRoot = new URL('../dist/', import.meta.url);
const publicRobots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const indexedRoutes = manifest.routes.filter((route) => route.index && route.crawl);

for (const route of indexedRoutes) {
  const relative = route.path === '/'
    ? 'index.html'
    : `${route.path.replace(/^\//, '')}index.html`;
  const html = await readFile(new URL(relative, distRoot), 'utf8');
  const canonical = `${manifest.site.origin}${route.path}`;

  if (/\bnoindex\b/i.test(html)) {
    throw new Error(`Indexability gate: public route ${route.path} contains noindex`);
  }
  if (!html.includes(`<meta name="robots" content="${publicRobots}" />`)) {
    throw new Error(`Indexability gate: public route ${route.path} is missing the canonical index/follow directive`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) {
    throw new Error(`Indexability gate: public route ${route.path} canonical drifted from ${canonical}`);
  }
  if (!html.includes(`<title>${escapeHtml(route.title)}</title>`)) {
    throw new Error(`Indexability gate: public route ${route.path} title drifted from the route manifest`);
  }
  if (!html.includes(`<meta name="description" content="${escapeHtml(route.description)}" />`)) {
    throw new Error(`Indexability gate: public route ${route.path} description drifted from the route manifest`);
  }
}

const adaptivePlayer = await readFile(new URL('adaptive-player/index.html', distRoot), 'utf8');
if (!adaptivePlayer.includes('<meta name="robots" content="noindex,nofollow" />')) {
  throw new Error('Indexability gate: Adaptive Player POC must remain explicitly noindex until governed promotion');
}

const about = await readFile(new URL('about/index.html', distRoot), 'utf8');
for (const marker of [
  'https://kopanolabs.com/#organization',
  'https://kopanolabs.com/#website',
  'https://kopanolabs.com/about/#webpage',
  'https://krrababalela.com/#person',
  'https://kopanolabs.com/about/#amaphu-entertainment',
]) {
  if (!about.includes(marker)) {
    throw new Error(`Indexability gate: /about/ entity graph is missing ${marker}`);
  }
}

const robots = await readFile(new URL('robots.txt', distRoot), 'utf8');
const disallowedPrefixes = robots
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.toLowerCase().startsWith('disallow:'))
  .map((line) => line.slice('Disallow:'.length).trim())
  .filter(Boolean);

for (const route of indexedRoutes) {
  const blocker = disallowedPrefixes.find((prefix) => route.path.startsWith(prefix));
  if (blocker) {
    throw new Error(`Indexability gate: ${route.path} is blocked by robots prefix ${blocker}`);
  }
}

console.log(`Indexability gate passed: ${indexedRoutes.length} public route shells are index/follow with canonical metadata; Adaptive Player remains governed noindex.`);
