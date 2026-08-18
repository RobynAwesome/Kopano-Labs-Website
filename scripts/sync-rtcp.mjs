import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve('governance/rtcp-projection.json');
const outputPath = path.resolve('src/data/rtcp.json');
const publicPath = path.resolve('public/rtcp.json');
const receiptPath = path.resolve('public/rtcp.receipt.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { repository, path: sourcePath, commit, expectedSchema } = config.source;
const rawUrl = `https://raw.githubusercontent.com/${repository}/${commit}/${sourcePath}`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

const response = await fetch(rawUrl, {
  headers: { 'User-Agent': 'Kopano-Labs-Website/rtcp-projection', Accept: 'application/json' },
  signal: AbortSignal.timeout(12_000),
});
if (!response.ok) throw new Error(`RTCP source fetch failed: ${response.status} ${response.statusText}`);

const sourceText = await response.text();
const source = JSON.parse(sourceText);
if (source.schema !== expectedSchema) throw new Error(`Unexpected RTCP source schema: ${source.schema}`);
if (source.laws?.renterAssertion !== 'I_AM_STATELESS_RENTER_NOT_LANDLORD') throw new Error('RTCP renter law missing');
if (source.publicProjection?.consumer !== 'https://github.com/RobynAwesome/Kopano-Labs-Website') throw new Error('RTCP source does not authorize this public projection');
if (source.publicProjection?.claimsMayTransform !== false) throw new Error('RTCP source allows claim transformation');
if (source.publicProjection?.providerInternals !== config.projection.providerInternals) throw new Error('RTCP provider-internals policy drift');
if (!Array.isArray(source.council) || source.council.length !== 10) throw new Error('RTCP source must contain exactly 10 council seats');
if (new Set(source.council.map((member) => member.id)).size !== 10) throw new Error('RTCP council identities must be unique');
if (!Array.isArray(source.domains) || source.domains.length < 1) throw new Error('RTCP source has no domain lanes');
if (source.domains.some((domain) => domain.integration !== 'ADAPT_EXISTING')) throw new Error('RTCP public projection only accepts ADAPT_EXISTING domain lanes');
if (source.domains.some((domain) => /kopanocontext\.kopanolabs\.com/i.test(domain.host))) throw new Error('Dormant legacy Kopano Context hostname leaked into RTCP projection');

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
    renterAssertion: source.laws.renterAssertion,
    routing: source.laws.routing,
    identity: source.laws.identity,
    domainIsolation: source.laws.domainIsolation,
    projectionPolicy: source.publicProjection.policy,
    providerInternals: source.publicProjection.providerInternals,
  },
  council: source.council.map(({ seat, id, name, title, role, type, weight }) => ({ seat, id, name, title, role, type, weight })),
  domains: source.domains.map(({ id, label, host, state, integration, primaryCouncil, intentTerms }) => ({ id, label, host, state, integration, primaryCouncil, intentTerms })),
};

const projectionText = stableJson(projected);
const receipt = {
  schema: 'kopano-labs.rtcp-projection-receipt.v1',
  source: projected.source,
  projection: {
    schema: projected.schema,
    sha256: sha256(projectionText),
    councilSeats: projected.council.length,
    domainCount: projected.domains.length,
  },
  gate: 'ALLOW',
  truthBoundary: 'KopanoLabs.com may transform RTCP presentation, but council membership, authority, domain state and provider execution remain source-owned and receipt-gated.',
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.mkdirSync(path.dirname(publicPath), { recursive: true });
fs.writeFileSync(outputPath, projectionText);
fs.writeFileSync(publicPath, projectionText);
fs.writeFileSync(receiptPath, stableJson(receipt));
console.log(`RTCP projection: SYNCED · ${projected.council.length} seats · ${projected.domains.length} domains · source ${commit.slice(0, 12)}`);
