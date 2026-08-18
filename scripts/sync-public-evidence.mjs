import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const config = JSON.parse(fs.readFileSync(path.resolve('governance/public-evidence-projection.json'), 'utf8'));
const outputPath = path.resolve('src/data/publicEvidence.json');
const publicPath = path.resolve('public/evidence.json');
const receiptPath = path.resolve('public/evidence.receipt.json');
const { repository, path: sourcePath, commit, expectedSchema } = config.source;
const rawUrl = `https://raw.githubusercontent.com/${repository}/${commit}/${sourcePath}`;

const response = await fetch(rawUrl, {
  headers: { 'User-Agent': 'Kopano-Labs-Website/public-evidence-projection', Accept: 'application/json' },
  signal: AbortSignal.timeout(12_000),
});

if (!response.ok) throw new Error(`Public evidence source fetch failed: ${response.status} ${response.statusText}`);

const sourceText = await response.text();
const source = JSON.parse(sourceText);
if (source.schema !== expectedSchema) throw new Error(`Unexpected public evidence schema: ${source.schema}`);
if (!Array.isArray(source.items) || source.items.length < 1) throw new Error('Public evidence source has no visible items.');

const projectionText = `${JSON.stringify(source, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const receipt = {
  schema: 'kopano-labs.public-evidence-receipt.v1',
  source: { repository, path: sourcePath, commit, sha256: sha256(sourceText) },
  projection: { sha256: sha256(projectionText), itemCount: source.items.length },
  gate: 'ALLOW',
  truthBoundary: 'The website renders the parsed Sovereign Hub public evidence contract. It does not rebuild governance state in the UI.',
};

fs.writeFileSync(outputPath, projectionText);
fs.writeFileSync(publicPath, projectionText);
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`Public evidence projection: SYNCED · ${source.items.length} items · source ${commit.slice(0, 12)}`);
