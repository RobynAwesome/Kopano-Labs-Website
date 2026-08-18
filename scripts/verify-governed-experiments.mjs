import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve('governance/experiment-projection.json');
const sourcePath = path.resolve('src/data/governedExperiments.json');
const publicPath = path.resolve('public/experiments.json');
const receiptPath = path.resolve('public/experiments.receipt.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const registryText = fs.readFileSync(sourcePath, 'utf8');
const registry = JSON.parse(registryText);
const publicRegistryText = fs.readFileSync(publicPath, 'utf8');
const publicRegistry = JSON.parse(publicRegistryText);
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
const failures = [];
const fail = (message) => failures.push(message);
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const allowedRelations = new Set(['experiment', 'validation-input', 'evidence-surface']);

if (registry.schema !== 'kopano-labs.governed-experiments.v2') fail('unexpected experiment projection schema');
if (registry.source?.repository !== 'RobynAwesome/kopano-sovereign-hub') fail('Sovereign Hub source repository drift');
if (registry.source?.path !== 'governance/experiments.json') fail('Sovereign Hub source path drift');
if (registry.source?.commit !== config.source.commit) fail('projection is not pinned to configured source commit');
if (registry.source?.sourceSchema !== config.source.expectedSchema) fail('source schema drift');
if (!registry.authority?.constitutional?.includes('Introduction-to-MCP')) fail('constitutional authority drift');
if (registry.authority?.runtime !== 'https://github.com/RobynAwesome/kopano-sovereign-hub') fail('runtime authority drift');
if (registry.authority?.repoNamespace !== 'https://github.com/RobynAwesome') fail('RobynAwesome namespace authority drift');
if (registry.authority?.renterAssertion !== 'I_AM_STATELESS_RENTER_NOT_LANDLORD') fail('stateless renter assertion missing');
if (registry.authority?.realityIndex !== 'REALITY_STATE > INDEX_STATE') fail('Reality > Index law missing');
if (registry.authority?.projectionPolicy !== 'PUBLIC_EVIDENCE_ONLY') fail('public evidence projection policy drift');

const ids = new Set();
for (const node of registry.nodes ?? []) {
  if (ids.has(node.id)) fail(`duplicate node id: ${node.id}`);
  ids.add(node.id);
  if (!allowedRelations.has(node.relation)) fail(`${node.id}: invalid source-owned relation ${node.relation}`);
  if (node.repo && !node.repo.startsWith('https://github.com/RobynAwesome/')) fail(`${node.id}: repo escaped canonical namespace`);
  if (['VALIDATED_LIVE', 'VALIDATED_FIELD', 'DELIVERED_EXTERNAL'].includes(node.state) && !node.surface) fail(`${node.id}: promoted validation requires public/evidence surface`);
  if (/R\s?\d+[\d,.]*\s*\/?\s*(month|mo|year|yr)/i.test(node.backing ?? '')) fail(`${node.id}: commercial amount leaked into public projection`);
}

const byId = Object.fromEntries(registry.nodes.map((node) => [node.id, node]));
const lifecycleLocks = {
  'kopano-context': 'PLANT',
  'crisis-connect': 'PLANT',
  kasilink: 'WATER',
  'fivesarena-blog': 'WATER',
  portfolio: 'PRUNE',
  'starfall-salvage': 'PRUNE',
  'harvest-4-all': 'HARVEST',
  'bookit-fivesarena': 'HARVEST',
};
for (const [id, lifecycle] of Object.entries(lifecycleLocks)) {
  if (byId[id]?.lifecycle !== lifecycle) fail(`${id}: lifecycle must remain ${lifecycle}`);
}

if (byId.portfolio?.relation !== 'evidence-surface') fail('Founder Portfolio must remain evidence-surface');
for (const id of ['fivesarena-blog', 'bookit-fivesarena', 'freddy-nw-alfalfa', 'flow-inc-ink']) {
  if (byId[id]?.relation !== 'validation-input') fail(`${id}: must remain validation-input`);
}
if (byId['cape-campass']?.state !== 'TARGET' || byId['cape-campass']?.repo !== null) fail('Cape Campass must remain TARGET with repo binding MAYBE');
if (byId['starfall-salvage']?.state !== 'REWORK') fail('Starfall Salvage must remain REWORK');
if (byId.cars4mars?.state !== 'BUILD') fail('Cars4Mars must remain BUILD until physical receipt');
if (!String(byId.kasilink?.backing ?? '').includes('government backing is a target')) fail('KasiLink government backing must remain target');

if (registryText !== publicRegistryText || JSON.stringify(registry) !== JSON.stringify(publicRegistry)) {
  fail('public experiments artifact diverged from UI projection');
}
if (receipt.schema !== 'kopano-labs.experiment-projection-receipt.v1') fail('projection receipt schema drift');
if (receipt.source?.commit !== registry.source?.commit) fail('receipt source commit mismatch');
if (receipt.source?.sourceSha256 !== registry.source?.sourceSha256) fail('receipt source hash mismatch');
if (receipt.projection?.sha256 !== sha256(registryText)) fail('projection receipt hash mismatch');
if (receipt.projection?.nodeCount !== registry.nodes.length) fail('projection receipt node count mismatch');
if (receipt.gate !== 'ALLOW') fail('projection receipt gate is not ALLOW');

if (failures.length) {
  console.error('Kopano governed experiment projection: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Kopano governed experiment projection: PASS · ${registry.nodes.length} nodes · source ${registry.source.commit.slice(0, 12)} · public/UI/hash converged`);
