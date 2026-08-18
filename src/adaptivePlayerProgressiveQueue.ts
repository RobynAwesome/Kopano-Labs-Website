import {
  KPGS_PROGRESSIVE_UPDATE,
  isSwfusReceipt,
  type PlayerProfile,
  type ProgressiveUpdate,
  type SwfusReceipt,
} from './progressiveUpdateContract';

const CLIENT_ID_KEY = 'kpgs.adaptive-player.client.v1';
const PROFILE_KEY = 'kpgs.adaptive-player.profile.v1';
const QUEUE_KEY = 'kpgs.adaptive-player.progressive-queue.v1';
const RECEIPT_KEY = 'kpgs.adaptive-player.progressive-receipt.v1';

const EVIDENCE = [
  'repo://governance/adaptive-player-progressive-update-poc.md',
  'git://RobynAwesome/Kopano-Labs-Website/b45ed21b795f8cf2cd601dd141b056d033be3a1b',
];

type QueueItem = {
  update: ProgressiveUpdate;
  status: 'pending' | 'held' | 'rejected';
  queued_at: string;
  receipt: SwfusReceipt | null;
};

export type PlayerProgressiveStatus =
  | { state: 'idle'; reason: null; receipt: null }
  | { state: 'pending'; reason: string; receipt: null }
  | { state: 'applied'; reason: null; receipt: SwfusReceipt }
  | { state: 'held' | 'rejected'; reason: string; receipt: SwfusReceipt };

function randomId(prefix: string) {
  const suffix = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clientId() {
  const current = localStorage.getItem(CLIENT_ID_KEY);
  if (current) return current;
  const created = randomId('client');
  localStorage.setItem(CLIENT_ID_KEY, created);
  return created;
}

function queue() {
  return readJson<QueueItem[]>(QUEUE_KEY, []);
}

function writeQueue(items: QueueItem[]) {
  writeJson(QUEUE_KEY, items);
}

function endpoint() {
  const configured = (import.meta.env.VITE_KPGS_PROGRESSIVE_UPDATE_ENDPOINT || '').trim();
  return configured || null;
}

function decisiveReason(receipt: SwfusReceipt) {
  return [...receipt.stages].reverse().find((stage) => ['HOLD', 'REJECT'].includes(stage.status))?.reason
    || `canonical SWFUS disposition: ${receipt.disposition}`;
}

export function readSavedPlayerProfile(): PlayerProfile | null {
  try {
    const value = localStorage.getItem(PROFILE_KEY);
    return value && ['lite', 'mobile', 'enhanced', 'immersive'].includes(value)
      ? value as PlayerProfile
      : null;
  } catch {
    return null;
  }
}

export function readPlayerProgressiveStatus(): PlayerProgressiveStatus {
  const items = queue();
  const blocked = items.find((item) => item.status !== 'pending');
  if (blocked?.receipt) {
    return { state: blocked.status, receipt: blocked.receipt, reason: decisiveReason(blocked.receipt) };
  }
  if (items.length) {
    return { state: 'pending', receipt: null, reason: 'profile saved on this device; canonical update is queued' };
  }
  const last = readJson<SwfusReceipt | null>(RECEIPT_KEY, null);
  if (isSwfusReceipt(last) && last.disposition === 'APPLIED' && last.synchronized) {
    return { state: 'applied', receipt: last, reason: null };
  }
  return { state: 'idle', receipt: null, reason: null };
}

export function saveAndQueuePlayerProfile(profile: PlayerProfile, maximumProfile: PlayerProfile) {
  writeJson(PROFILE_KEY, profile);
  const items = queue();
  const last = readJson<SwfusReceipt | null>(RECEIPT_KEY, null);
  const projectionKnown = (isSwfusReceipt(last) && last.disposition === 'APPLIED')
    || items.some((item) => item.update.operation === 'CREATE');
  const updateId = randomId('player-profile');
  const update: ProgressiveUpdate = {
    schema: KPGS_PROGRESSIVE_UPDATE.schema,
    update_id: updateId,
    node_id: `kopanolabs:adaptive-player:profile:${clientId()}`,
    operation: projectionKnown ? 'UPDATE' : 'CREATE',
    lane: 'web.adaptive-player',
    context_route: 'kopanolabs.adaptive-player.profile',
    protocol: 'ADAPTIVE_PLAYER_PROFILE_PREFERENCE_V1',
    idempotency_key: updateId,
    value: { profile, maximum_profile: maximumProfile, selected_by: 'human' },
    apu_status: 'UNSPECIFIED',
    poc_validated: true,
    foc_detected: false,
    invariant_passed: true,
    authority_effect: 'none',
    state_class: 'non_authoritative',
    evidence_refs: [...EVIDENCE, `ui://adaptive-player/profile/${profile}`],
    correlation_id: randomId('corr'),
    source: 'kopanolabs-adaptive-player',
    expected_version: null,
    boundary_marker: KPGS_PROGRESSIVE_UPDATE.boundaryMarker,
  };
  items.push({ update, status: 'pending', queued_at: new Date().toISOString(), receipt: null });
  writeQueue(items);
  window.dispatchEvent(new CustomEvent('kpgs:adaptive-player-progressive'));
}

async function submit(update: ProgressiveUpdate) {
  const url = endpoint();
  if (!url || !navigator.onLine) return null;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(update),
    });
    const payload = await response.json() as unknown;
    const candidate = isSwfusReceipt(payload)
      ? payload
      : payload && typeof payload === 'object' && 'receipt' in payload
        ? (payload as { receipt?: unknown }).receipt
        : null;
    return isSwfusReceipt(candidate) ? candidate : null;
  } catch {
    return null;
  }
}

export async function flushPlayerProgressiveQueue(): Promise<PlayerProgressiveStatus> {
  const items = queue();
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (item.status !== 'pending') break;
    const receipt = await submit(item.update);
    if (!receipt) break;
    if (receipt.disposition === 'APPLIED' && receipt.synchronized) {
      writeJson(RECEIPT_KEY, receipt);
      items.splice(index, 1);
      index -= 1;
      writeQueue(items);
      continue;
    }
    item.receipt = receipt;
    item.status = receipt.disposition === 'REJECTED' ? 'rejected' : 'held';
    writeQueue(items);
    break;
  }
  window.dispatchEvent(new CustomEvent('kpgs:adaptive-player-progressive'));
  return readPlayerProgressiveStatus();
}
