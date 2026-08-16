import { access, readFile, readdir, stat } from 'node:fs/promises';

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

const appSource = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
const siteExperienceSource = await readFile(new URL('../src/SiteExperience.tsx', import.meta.url), 'utf8');
const routeSurfaceSource = await readFile(new URL('../src/components/RouteExperienceSurface.tsx', import.meta.url), 'utf8');
const kcWorkbenchSource = await readFile(new URL('../src/components/KopanoContextWorkbench.tsx', import.meta.url), 'utf8');
const focSource = await readFile(new URL('../src/components/FOCMatrix.tsx', import.meta.url), 'utf8');
const systemAtlasSource = await readFile(new URL('../src/components/SystemAtlas.tsx', import.meta.url), 'utf8');
for (const expected of ['RouteExperienceSurface view="labs"', 'RouteExperienceSurface view="foc"', 'RouteExperienceSurface view="proof"']) {
  if (!appSource.includes(expected)) throw new Error('Convergence gate: missing immersive route surface ' + expected);
}
if (!siteExperienceSource.includes('RouteExperienceSurface view="content"')) throw new Error('Convergence gate: content estate has no spatial surface');
if (!siteExperienceSource.includes("addEventListener('popstate'")) throw new Error('Convergence gate: content route does not sync after SPA navigation');
if (!routeSurfaceSource.includes('<KopanoContextWorkbench />')) throw new Error('Convergence gate: Labs has no visible KC workbench');
if (!kcWorkbenchSource.includes('LOCAL KC REHEARSAL ≠ OWNER-READY KC RUNTIME')) throw new Error('Convergence gate: KC truth boundary missing');
if (focSource.includes('FAKE OF CONCEPT') || focSource.includes('FREEDOM OF CONCEPT') || focSource.includes('foc-groups')) throw new Error('Convergence gate: retired FOC groups leaked into the public surface');
if (!systemAtlasSource.includes("useState<SystemSceneId>('context')")) throw new Error('Convergence gate: KC is not the default systems world');

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
const governance = JSON.parse(await readFile(new URL('governance.json', root), 'utf8'));
const observedDeploymentRepository = 'RobynAwesome/Kopano-Labs-Website';
if (release.canonical_source_repository !== null) throw new Error('Convergence gate: release canonical source requires explicit owner establishment');
if (governance.canonical_source_repository !== null) throw new Error('Convergence gate: governance canonical source requires explicit owner establishment');
if (release.deployment_source_observed !== observedDeploymentRepository) throw new Error('Convergence gate: release deployment-source observation drifted');
if (governance.deployment_source_observed !== observedDeploymentRepository) throw new Error('Convergence gate: governance deployment-source observation drifted');
if (release.cars4mars?.design_submission?.website_dependency !== false) throw new Error('Convergence gate: Cars4Mars PDF must not become a website dependency');

try {
  const reports = new URL('reports/', root);
  const info = await stat(reports);
  if (info.isDirectory() && (await readdir(reports)).length > 0) throw new Error('Convergence gate: dist/reports must remain empty/absent');
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

console.log('Convergence gate passed: rich runtime + machine artifacts coexist; deployment observation remains distinct from canonical owner authority; reports remain retired.');
