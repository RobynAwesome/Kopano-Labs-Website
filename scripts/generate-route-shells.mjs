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
  const robots = route.index === false
    ? 'noindex,nofollow'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  const aboutEntitySchema = route.path === '/about/'
    ? `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://kopanolabs.com/about/#webpage',
          url: 'https://kopanolabs.com/about/',
          name: 'About Kopano Labs — Experimental Systems Lab',
          description: 'Kopano Labs is a South African experimental systems lab exploring artificial intelligence, web design, blockchain research, offline-first software and cyber-physical engineering.',
          isPartOf: { '@id': 'https://kopanolabs.com/#website' },
          mainEntity: [
            { '@id': 'https://kopanolabs.com/#organization' },
            { '@id': 'https://krrababalela.com/#person' },
            { '@id': 'https://kopanolabs.com/about/#amaphu-entertainment' },
          ],
        },
        {
          '@type': 'Person',
          '@id': 'https://krrababalela.com/#person',
          name: 'Kholofelo Robyn Rababalela',
          url: 'https://krrababalela.com/',
          sameAs: ['https://github.com/RobynAwesome'],
          jobTitle: 'Founder, Director, and Sovereign System Engineer',
          founderOf: [
            { '@id': 'https://kopanolabs.com/#organization' },
            { '@id': 'https://kopanolabs.com/about/#amaphu-entertainment' },
          ],
        },
        {
          '@type': 'Organization',
          '@id': 'https://kopanolabs.com/about/#amaphu-entertainment',
          name: 'Ama-Phu Entertainment',
          legalName: 'AMAPHU (PTY) LTD',
          description: 'A separate entertainment and media entity spanning music, stories, games, publishing, merchandise and creator opportunity.',
          url: 'https://linktr.ee/amaphu.ent',
          sameAs: [
            'https://linktr.ee/amaphu.ent',
            'https://www.youtube.com/@Ama-PhuEntertainment',
            'https://open.spotify.com/artist/3N5NlNqY8iY4rR6DzDOpCA',
            'https://music.apple.com/za/artist/ama-phu/1656490480',
          ],
          founder: { '@id': 'https://krrababalela.com/#person' },
          mainEntityOfPage: { '@id': 'https://kopanolabs.com/about/#webpage' },
        },
      ],
    })}</script>`
    : '';
  const seaServiceSchema = route.path === '/SEA/'
    ? `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://kopanolabs.com/SEA/#webpage',
          url: 'https://kopanolabs.com/SEA/',
          name: 'Search Entity Architecture (SEA) — Kopano Labs',
          description: 'Search Entity Architecture by Kopano Labs engineers and validates public digital identity so search engines and AI systems can discover, distinguish, understand, retrieve and verify people, businesses and institutions.',
          isPartOf: { '@id': 'https://kopanolabs.com/#website' },
          mainEntity: { '@id': 'https://kopanolabs.com/SEA/#service' },
        },
        {
          '@type': 'Service',
          '@id': 'https://kopanolabs.com/SEA/#service',
          name: 'Search Entity Architecture',
          alternateName: 'SEA',
          serviceType: 'Public digital identity and search entity architecture consulting',
          description: 'A Kopano Labs service for auditing, engineering and validating the public evidence environment through which search engines and generative AI systems discover and interpret an entity.',
          provider: { '@id': 'https://kopanolabs.com/#organization' },
          mainEntityOfPage: { '@id': 'https://kopanolabs.com/SEA/#webpage' },
        },
      ],
    })}</script>`
    : '';

  return html
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace('</head>', `${aboutEntitySchema}${seaServiceSchema}</head>`);
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
  index: false,
};
const adaptivePlayerTarget = join(new URL('../dist/', import.meta.url).pathname, 'adaptive-player', 'index.html');
await mkdir(dirname(adaptivePlayerTarget), { recursive: true });
await writeFile(adaptivePlayerTarget, replaceMeta(template, adaptivePlayerRoute), 'utf8');

console.log(`Generated ${indexedRoutes.length} public route HTML shells + 1 explicitly noindex Adaptive Player POC shell.`);
