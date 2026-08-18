import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve('governance/experiment-projection.json');
const outputPath = path.resolve('src/data/governedExperiments.json');
const publicPath = path.resolve('public/experiments.json');
const receiptPath = path.resolve('public/experiments.receipt.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { repository, path: sourcePath, commit, expectedSchema } = config.source;
const rawUrl = `https://raw.githubusercontent.com/${repository}/${commit}/${sourcePath}`;

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

const response = await fetch(rawUrl, {
  headers: {
    'User-Agent': 'Kopano-Labs-Website/experiment-projection',
    Accept: 'application/json',
  },
  signal: AbortSignal.timeout(12_000),
});

if (!response.ok) {
  throw new Error(`Sovereign Hub registry fetch failed: ${response.status} ${response.statusText}`);
}

const sourceText = await response.text();
const source = JSON.parse(sourceText);

if (source.schema !== expectedSchema) {
  throw new Error(`Unexpected Sovereign Hub schema: ${source.schema}`);
}
if (source.authority?.runtime !== 'https://github.com/RobynAwesome/kopano-sovereign-hub') {
  throw new Error('Sovereign Hub runtime authority drift');
}
if (!source.authority?.constitutional?.includes('Introduction-to-MCP')) {
  throw new Error('MAIN-BRAIN constitutional authority missing from source');
}
if (source.laws?.renterAssertion !== 'I_AM_STATELESS_RENTER_NOT_LANDLORD') {
  throw new Error('Stateless renter law missing from source');
}
if (source.publicProjection?.consumer !== 'https://github.com/RobynAwesome/Kopano-Labs-Website') {
  throw new Error('Source does not authorize KopanoLabs.com public projection');
}
if (source.publicProjection?.relationSourceOwned !== true) {
  throw new Error('Source relation classification is not source-owned');
}
if (source.publicProjection?.privateContext !== config.projection.privateContext) {
  throw new Error('Private-context projection policy drift');
}
if (source.publicProjection?.commercialTerms !== config.projection.commercialTerms) {
  throw new Error('Commercial-term projection policy drift');
}

const projected = {
  schema: config.projection.schema,
  snapshotDate: source.snapshotDate,
  source: {
    repository,
    path: sourcePath,
    commit,
    sourceSchema: source.schema,
    sourceSha256: sha256(sourceText),
  },
  authority: {
    constitutional: source.authority.constitutional,
    runtime: source.authority.runtime,
    publicEvidence: source.authority.publicEvidence,
    repoNamespace: source.authority.repoNamespace,
    renterAssertion: source.laws.renterAssertion,
    realityIndex: source.laws.realityIndex,
    promotion: source.laws.promotion,
    convergence: source.laws.convergence,
    projectionPolicy: source.publicProjection.policy,
  },
  nodes: source.nodes.map((node) => ({
    id: node.id,
    name: node.name,
    lane: node.lane,
    relation: node.relation,
    lifecycle: node.lifecycle,
    state: node.state,
    repo: node.repo,
    surface: node.publicSurface,
    ...(node.declaredDomain ? { declaredDomain: node.declaredDomain } : {}),
    backing: node.backing,
    description: node.description,
  })),
};

const projectionText = stableJson(projected);
const receipt = {
  schema: 'kopano-labs.experiment-projection-receipt.v1',
  source: projected.source,
  projection: {
    schema: projected.schema,
    sha256: sha256(projectionText),
    nodeCount: projected.nodes.length,
  },
  gate: 'ALLOW',
  truthBoundary: 'KopanoLabs.com is a public projection of the pinned Sovereign Hub experiment registry. Presentation may change; relation, lifecycle, state, backing and ownership claims may not.',
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.mkdirSync(path.dirname(publicPath), { recursive: true });
fs.writeFileSync(outputPath, projectionText);
fs.writeFileSync(publicPath, projectionText);
fs.writeFileSync(receiptPath, stableJson(receipt));

console.log(`Sovereign experiment projection: SYNCED · ${projected.nodes.length} nodes · source ${commit.slice(0, 12)} · sha256 ${receipt.projection.sha256.slice(0, 12)}`);
