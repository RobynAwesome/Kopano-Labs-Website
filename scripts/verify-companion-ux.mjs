import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFile(new URL(path, `file://${root}/`), 'utf8');

const [hub, graph, runtime, protocolCss] = await Promise.all([
  read('src/components/RTCPHub.tsx'),
  read('src/components/CompanionSecurityGraph.tsx'),
  read('src/companionRuntime.ts'),
  read('src/components/companion.css'),
]);

const requiredHub = [
  "KOPANO COMPANION",
  "Tell me what you're trying to do. I'll walk with you.",
  "Talk to Kopano",
  "Operator view · council and receipt details",
  "Safe local route · no external model execution claimed",
];
for (const phrase of requiredHub) {
  if (!hub.includes(phrase)) throw new Error(`Companion UX gate: missing hub invariant: ${phrase}`);
}

const requiredGraph = [
  'See where protected actions stop.',
  'Blocked here. The protected action did not run.',
  'not a penetration-test result',
  'omits credentials, private addresses and exploit instructions',
];
for (const phrase of requiredGraph) {
  if (!graph.includes(phrase)) throw new Error(`Companion UX gate: missing security invariant: ${phrase}`);
}

for (const claim of ['ROUTE_ONLY', 'PROVIDER_EXECUTED', 'TOOL_EXECUTED', 'BLOCKED']) {
  if (!runtime.includes(claim)) throw new Error(`Companion UX gate: execution claim missing: ${claim}`);
}
if (!runtime.includes('No external AI or protected tool action is being claimed.')) {
  throw new Error('Companion UX gate: route-only truth boundary missing');
}

for (const asset of [
  'public/assets/companion/companion-orb.svg',
  'public/assets/security/guard-shield.svg',
  'public/assets/security/receipt-sigil.svg',
]) {
  const info = await stat(new URL(asset, `file://${root}/`));
  if (!info.isFile() || info.size < 200) throw new Error(`Companion UX gate: invalid visual asset: ${asset}`);
}

if (!protocolCss.includes('@media(max-width:720px)')) {
  throw new Error('Companion UX gate: mobile companion breakpoint missing');
}
if (!hub.includes('profile.reducedMotion') || !hub.includes('profile.saveData')) {
  throw new Error('Companion UX gate: adaptive motion/data fallback missing');
}

console.log('Companion UX gate: PASS · plain language, guard boundary, execution claims, assets and mobile adaptation verified.');
