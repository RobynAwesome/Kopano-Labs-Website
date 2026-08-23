import type { CompanionRouteSignal } from './companionEvents';
import type { ExecutionClaim } from './companionRuntime';

export const COMPANION_QUEST_STORAGE_KEY = 'kpgs.companion.quest-log.v1';
export const MAX_COMPANION_QUEST_RECEIPTS = 8;

export type CompanionQuestReceipt = {
  schema: 'kopano.companion.quest-receipt.v1';
  requestId: string;
  destination: {
    id: string;
    label: string;
    state: string;
  };
  executionClaim: ExecutionClaim;
  receipt: {
    gate: string;
    outcome: string;
    adapterId: string;
  };
  createdAt: string;
};

function executionClaimForSignal(signal: CompanionRouteSignal): ExecutionClaim {
  if (signal.receipt.gate.toUpperCase().includes('BLOCK') || signal.receipt.outcome.toLowerCase().includes('block')) {
    return 'BLOCKED';
  }
  if (signal.execution.mode === 'PROVIDER_EXECUTED') return 'PROVIDER_EXECUTED';
  return 'ROUTE_ONLY';
}

function isQuestReceipt(value: unknown): value is CompanionQuestReceipt {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CompanionQuestReceipt>;
  return candidate.schema === 'kopano.companion.quest-receipt.v1'
    && typeof candidate.requestId === 'string'
    && typeof candidate.createdAt === 'string'
    && typeof candidate.executionClaim === 'string'
    && !!candidate.destination
    && typeof candidate.destination.id === 'string'
    && typeof candidate.destination.label === 'string'
    && typeof candidate.destination.state === 'string'
    && !!candidate.receipt
    && typeof candidate.receipt.gate === 'string'
    && typeof candidate.receipt.outcome === 'string'
    && typeof candidate.receipt.adapterId === 'string';
}

export function questReceiptFromSignal(signal: CompanionRouteSignal): CompanionQuestReceipt {
  return {
    schema: 'kopano.companion.quest-receipt.v1',
    requestId: signal.requestId,
    destination: {
      id: signal.domain.id,
      label: signal.domain.label,
      state: signal.domain.state,
    },
    executionClaim: executionClaimForSignal(signal),
    receipt: {
      gate: signal.receipt.gate,
      outcome: signal.receipt.outcome,
      adapterId: signal.receipt.adapterId,
    },
    createdAt: new Date().toISOString(),
  };
}

export function readCompanionQuestLog(storage?: Storage): CompanionQuestReceipt[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(COMPANION_QUEST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isQuestReceipt).slice(0, MAX_COMPANION_QUEST_RECEIPTS);
  } catch {
    return [];
  }
}

export function appendCompanionQuestReceipt(signal: CompanionRouteSignal, storage?: Storage): CompanionQuestReceipt[] {
  const current = readCompanionQuestLog(storage);
  if (current.some(entry => entry.requestId === signal.requestId)) return current;

  const next = [questReceiptFromSignal(signal), ...current].slice(0, MAX_COMPANION_QUEST_RECEIPTS);
  if (storage) {
    try {
      storage.setItem(COMPANION_QUEST_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage can be disabled or full. The in-memory return remains usable.
    }
  }
  return next;
}

export function clearCompanionQuestLog(storage?: Storage): CompanionQuestReceipt[] {
  if (storage) {
    try {
      storage.removeItem(COMPANION_QUEST_STORAGE_KEY);
    } catch {
      // A blocked storage API should not break the companion surface.
    }
  }
  return [];
}
