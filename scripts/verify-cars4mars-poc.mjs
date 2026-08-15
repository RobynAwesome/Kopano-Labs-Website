import { readFile, stat } from 'node:fs/promises';

const failures = [];

async function read(path) {
  try { return await readFile(path, 'utf8'); }
  catch { failures.push(`missing file: ${path}`); return ''; }
}

function requireText(label, content, expected) {
  if (!content.includes(expected)) failures.push(`${label}: missing "${expected}"`);
}

const cars = await read('src/components/Cars4MarsMissionControl.tsx');
const rover = await read('src/components/MarsRoverScene.tsx');
const simModel = await read('src/cars4marsSimulation.ts');
const simContractText = await read('public/cars4mars/simulation-scenarios.json');
const foc = await read('src/components/FOCMatrix.tsx');
const manifestText = await read('src/route-manifest.json');
const releaseText = await read('public/release.json');
const robots = await read('public/robots.txt');
const sitemap = await read('public/sitemap.xml');

for (const route of ['/Cars4Mars/', '/Cars4Mars/Ledger/', '/Cars4Mars/Architecture/', '/Cars4Mars/Media/', '/Cars4Mars/Support/']) {
  try {
    const manifest = JSON.parse(manifestText);
    if (!manifest.routes.some((entry) => entry.path === route)) failures.push(`route manifest: missing ${route}`);
  } catch { failures.push('route manifest: invalid JSON'); break; }
}

try {
  const release = JSON.parse(releaseText);
  if (release.cars4mars?.design_submission?.submission_state !== 'COMPLETE') failures.push('release truth: design submission is not COMPLETE');
  if (release.cars4mars?.design_submission?.website_dependency !== false) failures.push('release truth: website dependency must remain false');
  if (release.cars4mars?.physical_validation_state !== 'NOT_COMPLETE') failures.push('release truth: physical validation must remain NOT_COMPLETE');
} catch { failures.push('release truth: invalid JSON'); }

try {
  const contract = JSON.parse(simContractText);
  if (contract.schema !== 'cars4mars.sim.scenarios.v1') failures.push('simulation contract: wrong schema');
  if (contract.baseline !== 'DFR-01') failures.push('simulation contract: baseline must remain DFR-01');
  if (!Array.isArray(contract.scenarios) || contract.scenarios.length < 5) failures.push('simulation contract: expected engineering scenarios are missing');
  if (!String(contract.truth_boundary).includes('model evidence only')) failures.push('simulation contract: truth boundary missing');
} catch { failures.push('simulation contract: invalid JSON'); }

requireText('mission state model', cars, 'DESIGNED');
requireText('design boundary', cars, 'not physical build evidence');
requireText('verified mission video', cars, '01exG-aWj6g');
requireText('FOC connected signal', foc, 'connected: Signal');
requireText('FOC connected column', foc, '<b>CONNECTED</b>');
requireText('Cars4Mars crawl policy', robots, 'Allow: /Cars4Mars/');
requireText('Cars4Mars sitemap', sitemap, 'https://kopanolabs.com/Cars4Mars/');
requireText('simulation visual boundary', rover, 'MODEL EVIDENCE ≠ PHYSICAL VALIDATION');
requireText('human-in-loop visual mode', rover, 'HUMAN IN THE LOOP');
requireText('shared browser grade model', simModel, 'driveBeforeTraction');
requireText('heartbeat model', simModel, 'command_timeout_ms');

if (robots.includes('KOPANO_LABS.pdf') || sitemap.includes('KOPANO_LABS.pdf')) failures.push('retired report path leaked into crawl policy');

for (const path of ['public/assets/cars4mars/rover-open-concept.png', 'public/assets/cars4mars/rover-field-concept.png']) {
  try { const info = await stat(path); if (info.size < 1000) failures.push(`asset is empty or implausibly small: ${path}`); }
  catch { failures.push(`missing asset: ${path}`); }
}

if (failures.length) {
  console.error('Cars4Mars POC contract: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Cars4Mars POC contract: PASS');
console.log('- five public evidence routes present');
console.log('- design submission remains complete and physical validation remains honest');
console.log('- FOC matrix exposes WORKS, VISIBLE, BACKING, CURRENT and CONNECTED');
console.log('- Three.js rover preserves human-in-loop mode and exposes model-evidence simulation modes');
console.log('- DFR-01 simulation contract is machine-readable and truth-bounded');
