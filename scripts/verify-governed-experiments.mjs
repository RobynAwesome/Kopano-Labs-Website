import fs from 'node:fs';
import path from 'node:path';

const sourcePath = path.resolve('src/data/governedExperiments.json');
const publicPath = path.resolve('public/experiments.json');
const registry = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const failures = [];
const fail = (message) => failures.push(message);

if (registry.schema !== 'kopano-labs.governed-experiments.v1') fail('unexpected experiment schema');
if (registry.authority?.constitutional !== 'RobynAwesome/Introduction-to-MCP · MAIN-BRAIN') fail('constitutional authority drift');
if (registry.authority?.runtime !== 'RobynAwesome/kopano-sovereign-hub') fail('runtime authority drift');
if (registry.authority?.repoNamespace !== 'https://github.com/RobynAwesome') fail('RobynAwesome namespace authority drift');
if (registry.authority?.renterAssertion !== 'I_AM_STATELESS_RENTER_NOT_LANDLORD') fail('stateless renter assertion missing');
if (registry.authority?.realityIndex !== 'REALITY_STATE > INDEX_STATE') fail('Reality > Index law missing');

const ids = new Set();
for (const node of registry.nodes ?? []) {
  if (ids.has(node.id)) fail(`duplicate node id: ${node.id}`);
  ids.add(node.id);
  if (node.repo && !node.repo.startsWith('https://github.com/RobynAwesome/')) fail(`${node.id}: repo escaped canonical namespace`);
  if (['VALIDATED_LIVE', 'VALIDATED_FIELD', 'DELIVERED_EXTERNAL'].includes(node.state) && !node.surface) fail(`${node.id}: promoted validation requires public/evidence surface`);
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

if (byId['cape-campass']?.state !== 'TARGET' || byId['cape-campass']?.repo !== null) fail('Cape Campass must remain TARGET with repo binding MAYBE');
if (byId['starfall-salvage']?.state !== 'REWORK') fail('Starfall Salvage must remain REWORK');
if (byId.cars4mars?.state !== 'BUILD') fail('Cars4Mars must remain BUILD until physical receipt');
if (byId.kasilink?.backing !== 'Government backing remains a target') fail('KasiLink government backing must remain target');

fs.mkdirSync(path.dirname(publicPath), { recursive: true });
fs.copyFileSync(sourcePath, publicPath);

const publicRegistry = JSON.parse(fs.readFileSync(publicPath, 'utf8'));
if (JSON.stringify(publicRegistry) !== JSON.stringify(registry)) fail('public experiments artifact diverged from UI registry');

if (failures.length) {
  console.error('Kopano governed experiment estate: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Kopano governed experiment estate: PASS · ${registry.nodes.length} governed nodes · UI/public artifact converged`);
