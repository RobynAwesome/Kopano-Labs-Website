import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const config = JSON.parse(fs.readFileSync(path.resolve('governance/public-evidence-projection.json'), 'utf8'));
const sourceText = fs.readFileSync(path.resolve('src/data/publicEvidence.json'), 'utf8');
const publicText = fs.readFileSync(path.resolve('public/evidence.json'), 'utf8');
const evidence = JSON.parse(sourceText);
const receipt = JSON.parse(fs.readFileSync(path.resolve('public/evidence.receipt.json'), 'utf8'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const failures = [];
const fail = (message) => failures.push(message);

if (evidence.schema !== config.source.expectedSchema) fail('public evidence schema drift');
if (sourceText !== publicText) fail('UI and public evidence artifacts diverged');
if (!Array.isArray(evidence.items) || evidence.items.length !== 3) fail('expected exactly three current primary evidence cards');

const byId = Object.fromEntries(evidence.items.map((item) => [item.id, item]));
if (byId['bookit-fivesarena']?.name !== "Five's Arena × Hellenic FC") fail('Five\'s public name drift');
if (byId['bookit-fivesarena']?.state !== 'Live') fail('Five\'s state drift');
if (byId['freddy-nw-alfalfa']?.name !== 'North West lucerne farm') fail('farm public name drift');
if (byId['freddy-nw-alfalfa']?.state !== 'In the field') fail('farm state drift');
if (byId['flow-inc-ink']?.state !== 'Delivered') fail('Flow Inc Ink state drift');

const bannedPublicTerms = ['MMAO', 'GSMB', 'KPSMB', 'CCP', 'renter', 'telemetry class', 'FOC risk'];
const visibleCopy = JSON.stringify({ headline: evidence.headline, intro: evidence.intro, items: evidence.items });
for (const term of bannedPublicTerms) {
  if (visibleCopy.toLowerCase().includes(term.toLowerCase())) fail(`internal governance term leaked into default public copy: ${term}`);
}

if (receipt.schema !== 'kopano-labs.public-evidence-receipt.v1') fail('evidence receipt schema drift');
if (receipt.source?.commit !== config.source.commit) fail('evidence receipt source commit mismatch');
if (receipt.projection?.sha256 !== sha256(sourceText)) fail('evidence projection hash mismatch');
if (receipt.projection?.itemCount !== evidence.items.length) fail('evidence item count mismatch');
if (receipt.gate !== 'ALLOW') fail('evidence receipt gate is not ALLOW');

if (failures.length) {
  console.error('Public evidence projection: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public evidence projection: PASS · ${evidence.items.length} human cards · internal governance hidden by default`);
