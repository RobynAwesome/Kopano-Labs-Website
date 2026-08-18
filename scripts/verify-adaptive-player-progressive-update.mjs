import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const contract = read('src/progressiveUpdateContract.ts');
const queue = read('src/adaptivePlayerProgressiveQueue.ts');
const app = read('src/AdaptivePlayerApp.tsx');
const poc = read('governance/adaptive-player-progressive-update-poc.md');
const sw = read('public/adaptive-player-sw.js');

const failures = [];
const requireText = (source, text, label) => {
  if (!source.includes(text)) failures.push(label);
};

requireText(contract, "canonicalCommit: '6eeb285d0775a7e74ceadc06e32b4068fcfbc595'", 'canonical Introduction-to-MCP pin missing');
requireText(contract, "schema: 'kpgs.progressive-update.v1'", 'progressive update schema missing');
requireText(contract, "receiptSchema: 'kpgs.swfus.receipt.v1'", 'SWFUS receipt schema missing');
requireText(contract, "boundaryMarker: '#NB'", '#NB missing');
for (const stage of ['TELEMETRY', 'CLASSIFICATION', 'ROUTING', 'PROTOCOL_SELECTION', 'INVARIANT_AUDIT', 'POC_FOC_CHECK', 'STATE_UPDATE', 'DISTRIBUTION']) {
  requireText(contract, `'${stage}'`, `canonical stage missing: ${stage}`);
}

requireText(queue, "selected_by: 'human'", 'profile update is not explicitly human-authored');
requireText(queue, "apu_status: 'UNSPECIFIED'", 'profile queue must not fabricate APU GREEN');
requireText(queue, 'poc_validated: true', 'bounded POC gate missing');
requireText(queue, 'foc_detected: false', 'FOC mutation gate missing');
requireText(queue, "authority_effect: 'none'", 'profile preference may widen authority');
requireText(queue, "state_class: 'non_authoritative'", 'profile preference must stay non-authoritative');
requireText(queue, 'idempotency_key: updateId', 'retry idempotency key missing');
requireText(queue, 'VITE_KPGS_PROGRESSIVE_UPDATE_ENDPOINT', 'optional canonical endpoint configuration missing');
requireText(queue, "receipt.disposition === 'APPLIED' && receipt.synchronized", 'queue may clear without applied synchronized evidence');
if (queue.includes("schema: 'kpgs.swfus.receipt.v1'")) failures.push('browser queue must not manufacture canonical SWFUS receipts');

requireText(app, 'saveAndQueuePlayerProfile(profile, maximumProfile)', 'explicit profile choice is not queued');
requireText(app, 'if (rank > maxRank)', 'capability gate must execute before profile queue mutation');
requireText(app, "receipt('profile_blocked'", 'blocked choices need local telemetry receipt');
requireText(app, "receipt('player_booted'", 'automatic capability inference must remain local telemetry');
requireText(app, 'data-testid="player-progressive-status"', 'user-visible progressive status missing');

requireText(poc, 'profile preference != capability authority', 'POC authority boundary missing');
if (!sw.includes("if (request.method !== 'GET') return;")) failures.push('Adaptive Player service worker may intercept mutation POSTs');

if (failures.length) {
  console.error('Adaptive Player Progressive Update verification FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Adaptive Player Progressive Update verification PASS');
console.log('Explicit human profile choice -> queued non-authoritative Progressive Update -> canonical SWFUS receipt only.');
console.log('Pinned Introduction-to-MCP@6eeb285d0775a7e74ceadc06e32b4068fcfbc595');
