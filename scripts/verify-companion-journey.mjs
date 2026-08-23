import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFile(new URL(path, `file://${root}/`), 'utf8');

const [events, journey, quest, graph, runtime, rtcp, styles] = await Promise.all([
  read('src/companionEvents.ts'),
  read('src/companionJourney.ts'),
  read('src/components/CompanionQuestLog.tsx'),
  read('src/components/CompanionSecurityGraph.tsx'),
  read('src/companionRuntime.ts'),
  read('src/rtcpRuntime.ts'),
  read('src/components/companion-journey.css'),
]);

for (const invariant of [
  'kopano.companion.route-signal.v1',
  "Pick<RtcpRoute['execution'], 'mode'>",
  "Pick<RtcpRoute['receipt'], 'gate' | 'outcome' | 'adapterId'>",
]) {
  if (!events.includes(invariant)) throw new Error(`Companion journey gate: sanitized route signal missing: ${invariant}`);
}
if (events.includes('intent: route.intent') || events.includes('council: route.council') || events.includes('truthBoundary:')) {
  throw new Error('Companion journey gate: route signal leaks raw intent, council data or truth-boundary internals');
}

for (const invariant of [
  'kpgs.companion.quest-log.v1',
  'MAX_COMPANION_QUEST_RECEIPTS = 8',
  'kopano.companion.quest-receipt.v1',
  'JSON.stringify(next)',
]) {
  if (!journey.includes(invariant)) throw new Error(`Companion journey gate: quest receipt invariant missing: ${invariant}`);
}
if (journey.includes('route.intent') || journey.includes('signal.intent')) {
  throw new Error('Companion journey gate: raw request text must never be persisted');
}

for (const invariant of [
  'subscribeCompanionRoute',
  "document.querySelectorAll<HTMLButtonElement>('.atlas-selector button')",
  'target.click()',
  'createPortal',
  'atlas-companion-journey',
  'opening the external system still requires your tap.',
  'Raw request text is not saved.',
  'Clear this device',
  'useReducedMotion',
]) {
  if (!quest.includes(invariant)) throw new Error(`Companion journey gate: UX invariant missing: ${invariant}`);
}
if (quest.includes('window.open(') || quest.includes('location.assign(') || quest.includes('location.href =')) {
  throw new Error('Companion journey gate: route visualization must not auto-navigate externally');
}

for (const destination of ['FiveS Arena', 'KasiLink', 'CrisisConnect', 'Starfall Salvage', 'Cars4Mars', 'Kopano Context']) {
  if (!quest.includes(destination)) throw new Error(`Companion journey gate: atlas destination mapping missing: ${destination}`);
}

if (!graph.includes('<CompanionQuestLog />')) {
  throw new Error('Companion journey gate: quest log is not mounted in the companion surface');
}
if (!rtcp.includes('announceCompanionRoute(route);')) {
  throw new Error('Companion journey gate: RTCP route completion does not announce the sanitized journey signal');
}

for (const action of [
  'Browse KasiLink opportunities',
  'Open FiveS Arena fixtures',
  'Open CrisisConnect field lane',
  'Enter Starfall Salvage',
  'Inspect Cars4Mars evidence',
]) {
  if (!runtime.includes(action)) throw new Error(`Companion journey gate: destination-specific action missing: ${action}`);
}

for (const selector of ['.companion-quest-log', '.atlas-companion-journey', '@media(max-width:720px)', '@media(prefers-reduced-motion:reduce)']) {
  if (!styles.includes(selector)) throw new Error(`Companion journey gate: adaptive style invariant missing: ${selector}`);
}

console.log('Companion journey gate: PASS · sanitized route signal, world sync, local quest receipts, explicit navigation and adaptive motion verified.');
