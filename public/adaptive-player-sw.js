const CACHE = 'kpgs-adaptive-player-v0.1.0';
const SHELL = [
  '/adaptive-player/',
  '/adaptive-player.webmanifest',
  '/assets/brand/kopano-mark.svg',
];

async function cacheShell() {
  const cache = await caches.open(CACHE);
  const response = await fetch('/adaptive-player/', { cache: 'no-store' });
  if (response.ok) {
    await cache.put('/adaptive-player/', response.clone());
    const html = await response.text();
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+(?:\?[^"#]*)?)"/g)].map((match) => match[1]);
    await Promise.allSettled([...new Set([...SHELL.slice(1), ...assets])].map((url) => cache.add(url)));
  } else {
    await cache.addAll(SHELL.slice(1));
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('kpgs-adaptive-player-') && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' && url.pathname.startsWith('/adaptive-player/')) {
    event.respondWith((async () => {
      try {
        const network = await fetch(request);
        if (network.ok) {
          const cache = await caches.open(CACHE);
          await cache.put('/adaptive-player/', network.clone());
        }
        return network;
      } catch {
        return (await caches.match('/adaptive-player/')) || Response.error();
      }
    })());
    return;
  }

  const isPlayerAsset = url.pathname === '/adaptive-player.webmanifest'
    || url.pathname === '/assets/brand/kopano-mark.svg'
    || url.pathname.startsWith('/assets/');

  if (!isPlayerAsset) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const network = await fetch(request);
    if (network.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(request, network.clone());
    }
    return network;
  })());
});
