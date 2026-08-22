import { access, readFile, readdir, stat } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const mustExist = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'release.json',
  'governance.json',
  'evidence.json',
  'evidence.receipt.json',
  'entities.json',
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

for (const expected of ['RouteExperienceSurface view="labs"', 'RouteExperienceSurface view="proof"']) {
  if (!appSource.includes(expected)) throw new Error('Convergence gate: missing immersive route surface ' + expected);
}

// Real-work is intentionally human-first. It must not regress into the retired KC/FOC explainer.
if (!appSource.includes("view === 'foc'") || !appSource.includes('<FOCMatrix/>')) {
  throw new Error('Convergence gate: Real work must mount the human evidence surface directly');
}
if (appSource.includes('RouteExperienceSurface view="foc"')) {
  throw new Error('Convergence gate: retired immersive FOC route surface returned to the public evidence path');
}
if (!routeSurfaceSource.includes("if (view === 'foc') return null;")) {
  throw new Error('Convergence gate: FOC spatial explainer must remain disabled on the human evidence route');
}
if (!focSource.includes("import evidence from '../data/publicEvidence.json'")) {
  throw new Error('Convergence gate: Real work must render the parsed public evidence contract');
}
for (const internalTerm of ['MMAO', 'GSMB', 'KPSMB', 'CCP', 'FOC RISK', 'renterFamilies', 'convergence-chain']) {
  if (focSource.includes(internalTerm)) throw new Error('Convergence gate: internal governance leaked into default Real work UI: ' + internalTerm);
}

if (!siteExperienceSource.includes('RouteExperienceSurface view="content"')) throw new Error('Convergence gate: content estate has no spatial surface');
if (!siteExperienceSource.includes("addEventListener('popstate'")) throw new Error('Convergence gate: content route does not sync after SPA navigation');
if (!routeSurfaceSource.includes('<KopanoContextWorkbench />')) throw new Error('Convergence gate: Labs has no visible KC workbench');
if (!kcWorkbenchSource.includes('LOCAL KC REHEARSAL ≠ OWNER-READY KC RUNTIME')) throw new Error('Convergence gate: KC truth boundary missing');
if (focSource.includes('FAKE OF CONCEPT') || focSource.includes('FREEDOM OF CONCEPT') || focSource.includes('foc-groups')) throw new Error('Convergence gate: retired FOC groups leaked into the public surface');
if (!systemAtlasSource.includes("useState<SystemSceneId>('context')")) throw new Error('Convergence gate: KC is not the default systems world');

// Adaptive-runtime contract: constrained clients must preserve proof without paying the WebGL cost.
if (!routeSurfaceSource.includes("lazy(() => import('./KopanoScene')")) throw new Error('Convergence gate: KopanoScene must remain a deferred WebGL import');
for (const capability of ["profile.tier === 'lite'", 'profile.saveData', 'profile.reducedMotion']) {
  if (!routeSurfaceSource.includes(capability)) throw new Error('Convergence gate: adaptive WebGL gate missing ' + capability);
}
if (!routeSurfaceSource.includes("renderer: 'css-lite', webgl: false")) throw new Error('Convergence gate: CSS-lite renderer receipt must declare webgl=false');
if (!routeSurfaceSource.includes('data-kpgs-renderer="css-lite"')) throw new Error('Convergence gate: CSS-lite renderer must remain inspectable in the DOM');
if (!routeSurfaceSource.includes('FAST PATH · SAME CONTENT')) throw new Error('Convergence gate: lightweight renderer must promise content parity');
if (!routeSurfaceSource.includes('same content while using a lighter renderer')) throw new Error('Convergence gate: lightweight renderer behavior explanation missing');

const index = await readFile(new URL('index.html', root), 'utf8');
if (!/assets\/.*\.js/.test(index)) throw new Error('Convergence gate: Vite JS bundle missing from dist/index.html');
if (index.includes('KopanoScene-') || index.includes('useKPGSVisibility-')) throw new Error('Convergence gate: WebGL runtime leaked into first-paint preload graph');

const assetsDir = new URL('assets/', root);
const assets = await readdir(assetsDir);
if (!assets.some((name) => name.endsWith('.js'))) throw new Error('Convergence gate: no JS runtime bundle in dist/assets');
if (!assets.some((name) => name.startsWith('KopanoScene-') && name.endsWith('.js'))) throw new Error('Convergence gate: deferred KopanoScene chunk missing');
if (!assets.some((name) => name.startsWith('useKPGSVisibility-') && name.endsWith('.js'))) throw new Error('Convergence gate: deferred Three/KPGS runtime chunk missing');

const entryMatch = index.match(/src="\/assets\/(index-[^"]+\.js)"/);
if (!entryMatch) throw new Error('Convergence gate: unable to identify first-paint entry chunk');
const entryInfo = await stat(new URL('assets/' + entryMatch[1], root));
if (entryInfo.size > 400 * 1024) throw new Error(`Convergence gate: first-paint JS budget exceeded (${entryInfo.size} bytes > 409600)`);

const robots = await readFile(new URL('robots.txt', root), 'utf8');
if (!robots.includes('Disallow: /reports/')) throw new Error('Convergence gate: /reports/ must remain retired in robots.txt');
if (!robots.includes('Allow: /evidence.json') || !robots.includes('Allow: /evidence.receipt.json')) {
  throw new Error('Convergence gate: parsed public evidence artifacts must remain discoverable');
}
if (!robots.includes('Allow: /entities.json')) throw new Error('Convergence gate: public entity graph must remain discoverable');

const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
if (sitemap.includes('/reports/')) throw new Error('Convergence gate: retired reports route leaked into sitemap.xml');

const evidence = JSON.parse(await readFile(new URL('evidence.json', root), 'utf8'));
const evidenceReceipt = JSON.parse(await readFile(new URL('evidence.receipt.json', root), 'utf8'));
if (evidence.schema !== 'kopano.public-evidence.v1' || evidence.items?.length !== 3) throw new Error('Convergence gate: parsed public evidence contract drifted');
if (evidenceReceipt.gate !== 'ALLOW' || evidenceReceipt.projection?.itemCount !== 3) throw new Error('Convergence gate: public evidence projection receipt is not valid');

const entities = JSON.parse(await readFile(new URL('entities.json', root), 'utf8'));
if (entities.schema !== 'kopano-public-entity-graph/v1' || entities.entities?.length !== 2) throw new Error('Convergence gate: public entity graph drifted');
if (!entities.entities.some((entity) => entity.public_name === 'Kopano Labs' && entity.legal_name === 'KOPANO LABS')) throw new Error('Convergence gate: Kopano Labs entity identity missing');
if (!entities.entities.some((entity) => entity.public_name === 'Ama-Phu Entertainment' && entity.legal_name === 'AMAPHU (PTY) LTD')) throw new Error('Convergence gate: Ama-Phu entity identity missing');

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

console.log(`Convergence gate passed: human-first Real work + parsed .NET evidence coexist with immersive Labs/Proof; constrained clients retain CSS-lite proof; entry JS ${entryInfo.size} bytes; reports remain retired.`);
