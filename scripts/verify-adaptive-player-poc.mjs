import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [main, app, scene, webmanifest, sw, routeShells, crawlPolicy] = await Promise.all([
  read('src/main.tsx'),
  read('src/AdaptivePlayerApp.tsx'),
  read('src/components/AdaptivePlayerScene.tsx'),
  read('public/adaptive-player.webmanifest'),
  read('public/adaptive-player-sw.js'),
  read('scripts/generate-route-shells.mjs'),
  read('src/route-manifest.json'),
]);

const pwa = JSON.parse(webmanifest);
const publicManifest = JSON.parse(crawlPolicy);
const failures = [];

if (!routeShells.includes("path: '/adaptive-player/'") || !routeShells.includes("'adaptive-player', 'index.html'")) failures.push('adaptive-player direct route shell missing');
if (publicManifest.routes.some((route) => route.path === '/adaptive-player/')) failures.push('POC route leaked into public crawl manifest before promotion');
if (!main.includes("startsWith('/adaptive-player/')") || !main.includes("import('./AdaptivePlayerApp')")) failures.push('boot-time player split missing');
for (const profile of ['lite', 'mobile', 'enhanced', 'immersive']) {
  if (!app.includes(`'${profile}'`)) failures.push(`profile missing: ${profile}`);
}
if (!app.includes("lazy(() => import('./components/AdaptivePlayerScene')")) failures.push('Three.js scene is not lazy-loaded');
if (!app.includes("selectedProfile === 'lite'")) failures.push('lite zero-WebGL branch missing');
if (!scene.includes("frameloop={animate ? 'always' : 'demand'}")) failures.push('governed frame loop missing');
if (pwa.scope !== '/adaptive-player/' || pwa.start_url !== '/adaptive-player/') failures.push('PWA manifest scope/start_url mismatch');
if (!sw.includes("url.pathname.startsWith('/adaptive-player/')")) failures.push('service worker player navigation scope evidence missing');
if (!sw.includes("request.mode === 'navigate'") || !sw.includes("caches.match('/adaptive-player/')")) failures.push('offline navigation fallback missing');

if (failures.length) {
  console.error('Adaptive Player POC verification FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Adaptive Player POC verification PASS');
console.log('Profiles: lite -> mobile -> enhanced -> immersive');
console.log('Three.js: lazy; lite: zero-WebGL; PWA: scoped; crawl: blocked pending promotion');
