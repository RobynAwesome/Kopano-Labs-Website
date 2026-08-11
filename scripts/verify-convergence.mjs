import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = new URL('../dist/', import.meta.url);
const mustExist = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'release.json',
  'governance.json',
];

for (const file of mustExist) {
  await access(new URL(file, root));
}

const index = await readFile(new URL('index.html', root), 'utf8');
if (!/assets\/.*\.js/.test(index)) throw new Error('Convergence gate: Vite JS bundle missing from dist/index.html');

const assetsDir = new URL('assets/', root);
const assets = await readdir(assetsDir);
if (!assets.some((name) => name.endsWith('.js'))) throw new Error('Convergence gate: no JS runtime bundle in dist/assets');

const robots = await readFile(new URL('robots.txt', root), 'utf8');
if (!robots.includes('Disallow: /reports/')) throw new Error('Convergence gate: /reports/ must remain retired in robots.txt');

const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
if (sitemap.includes('/reports/')) throw new Error('Convergence gate: retired reports route leaked into sitemap.xml');

const release = JSON.parse(await readFile(new URL('release.json', root), 'utf8'));
if (release.canonical_source_repository !== null) throw new Error('Convergence gate: canonical source must remain null until owner establishes it');
if (release.cars4mars?.design_submission?.website_dependency !== false) throw new Error('Convergence gate: Cars4Mars PDF must not become a website dependency');

try {
  const reports = new URL('reports/', root);
  const info = await stat(reports);
  if (info.isDirectory() && (await readdir(reports)).length > 0) throw new Error('Convergence gate: dist/reports must remain empty/absent');
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

console.log('Convergence gate passed: rich runtime + machine artifacts coexist; reports remain retired.');
