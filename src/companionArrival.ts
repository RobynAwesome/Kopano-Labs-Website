import type { CompanionRouteSignal } from './companionEvents';
import type { ExecutionClaim } from './companionRuntime';

export const COMPANION_ACTION_STORAGE_KEY = 'kpgs.companion.action-log.v1';
export const MAX_COMPANION_ACTION_RECEIPTS = 8;

export type ArrivalActionKind = 'NAVIGATE' | 'LOCAL_REVEAL' | 'REMOTE_READ';
export type ArrivalPermission = 'EXPLICIT_TAP' | 'LOCAL_ONLY' | 'PROTECTED_CONFIRMATION';

export type ArrivalAction = {
  id: string;
  label: string;
  summary: string;
  consequence: string;
  kind: ArrivalActionKind;
  permission: ArrivalPermission;
  href?: string;
  localResult?: string;
};

export type ArrivalFixture = {
  id: string;
  home: string;
  away: string;
  status: string;
  time: string;
};

export type CompanionActionReceipt = {
  schema: 'kopano.companion.action-receipt.v1';
  requestId: string;
  actionId: string;
  destination: {
    id: string;
    label: string;
  };
  executionClaim: ExecutionClaim;
  effect: ArrivalActionKind;
  receipt: {
    gate: string;
    outcome: string;
    adapterId: string;
    source: 'LOCAL_UI' | 'BROWSER_OBSERVED_REMOTE';
  };
  summary: string;
  createdAt: string;
};

export type ArrivalActionResult = {
  receipt: CompanionActionReceipt;
  fixtures?: ArrivalFixture[];
};

const fivesFeedBase = 'https://fivesarena.com/api/football/league/premier-league';

const ACTIONS: Record<string, readonly ArrivalAction[]> = {
  fivesarena: [
    {
      id: 'fives-check-fixtures',
      label: 'Check latest fixtures',
      summary: 'Read the public FiveS Arena fixture feed without changing venue state.',
      consequence: 'Reads public fixture data only. No booking, account or venue data is changed.',
      kind: 'REMOTE_READ',
      permission: 'EXPLICIT_TAP',
    },
    {
      id: 'fives-open-fixtures',
      label: 'Open all fixtures',
      summary: 'Continue to the authoritative FiveS Arena fixture surface.',
      consequence: 'Opens FiveS Arena in a new tab after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: 'https://fivesarena.com/fixtures',
    },
  ],
  kasilink: [
    {
      id: 'kasilink-open-opportunities',
      label: 'Browse KasiLink opportunities',
      summary: 'Continue into the live township opportunity and service network.',
      consequence: 'Opens KasiLink in a new tab after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: 'https://kasilink.com',
    },
    {
      id: 'kasilink-low-data-note',
      label: 'Show the low-data path',
      summary: 'Explain what remains useful when bandwidth or device capability is constrained.',
      consequence: 'Shows guidance on this device only.',
      kind: 'LOCAL_REVEAL',
      permission: 'LOCAL_ONLY',
      localResult: 'KasiLink remains the live opportunity lane. Use the lightweight discovery path first on constrained data, then open the full system only when you need deeper interaction.',
    },
  ],
  crisisconnect: [
    {
      id: 'crisis-open-field-lane',
      label: 'Open the field reporting lane',
      summary: 'Continue to the public CrisisConnect field surface.',
      consequence: 'Opens CrisisConnect in a new tab after your tap. No report is submitted automatically.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: 'https://crisisconnect.kopanolabs.com',
    },
    {
      id: 'crisis-report-checklist',
      label: 'Prepare a report checklist',
      summary: 'Show the minimum information a useful field report should contain.',
      consequence: 'Shows a checklist locally. It does not collect or transmit your report.',
      kind: 'LOCAL_REVEAL',
      permission: 'LOCAL_ONLY',
      localResult: 'Field report checklist: location or landmark; what happened; current severity; time observed; media only when safe and consent-aware; immediate risk to people; and whether emergency services are already involved.',
    },
  ],
  starfall: [
    {
      id: 'starfall-launch',
      label: 'Enter Starfall Salvage',
      summary: 'Continue to the playable systems and telemetry lab.',
      consequence: 'Opens Starfall Salvage in a new tab after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: 'https://starfallsalvage.kopanolabs.com',
    },
  ],
  cars4mars: [
    {
      id: 'cars4mars-mission-control',
      label: 'Open mission control',
      summary: 'Enter the rover mission surface and current evidence state.',
      consequence: 'Navigates within Kopano Labs after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: '/Cars4Mars/',
    },
    {
      id: 'cars4mars-ledger',
      label: 'Inspect the build ledger',
      summary: 'Review dated evidence and verified state transitions.',
      consequence: 'Navigates to the public Cars4Mars evidence ledger after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: '/Cars4Mars/Ledger/',
    },
    {
      id: 'cars4mars-architecture',
      label: 'Inspect rover architecture',
      summary: 'Open the bounded drive, power, control, perception and safety architecture.',
      consequence: 'Navigates to the public rover architecture after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: '/Cars4Mars/Architecture/',
    },
  ],
  context: [
    {
      id: 'context-proof',
      label: 'Inspect public proof',
      summary: 'Trace current source authority, runtime provenance and public receipts.',
      consequence: 'Navigates to Kopano Labs public proof after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: '/proof/',
    },
    {
      id: 'context-systems',
      label: 'Explore the systems atlas',
      summary: 'Return to the governed system worlds without claiming KC owner readiness.',
      consequence: 'Navigates within Kopano Labs after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: '/systems/',
    },
  ],
  portfolio: [
    {
      id: 'portfolio-open',
      label: 'Open founder portfolio',
      summary: 'Continue to the public founder identity and work surface.',
      consequence: 'Opens the founder portfolio in a new tab after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: 'https://krrababalela.com',
    },
  ],
  kopanolabs: [
    {
      id: 'kopanolabs-systems',
      label: 'Explore working systems',
      summary: 'Enter the interactive systems atlas.',
      consequence: 'Navigates within Kopano Labs after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: '/systems/',
    },
    {
      id: 'kopanolabs-labs',
      label: 'See current experiments',
      summary: 'Inspect experiments without promoting them beyond their governed state.',
      consequence: 'Navigates within Kopano Labs after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: '/labs/',
    },
    {
      id: 'kopanolabs-proof',
      label: 'Show public proof',
      summary: 'Open source lineage and verification receipts.',
      consequence: 'Navigates within Kopano Labs after your tap.',
      kind: 'NAVIGATE',
      permission: 'EXPLICIT_TAP',
      href: '/proof/',
    },
  ],
};

function label(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const key of ['name', 'shortName', 'displayName', 'teamName']) {
      const candidate = record[key];
      if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
    }
  }
  return fallback;
}

function normalizeFixture(value: unknown, index: number): ArrivalFixture | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  const home = label(row.homeTeam ?? row.home, 'Home');
  const away = label(row.awayTeam ?? row.away, 'Away');
  return {
    id: label(row.id ?? row.fixtureId ?? row.matchId, `${home}-${away}-${index}`),
    home,
    away,
    status: label(row.status ?? row.state ?? row.phase, 'Scheduled'),
    time: label(row.kickoff ?? row.kickoffTime ?? row.date ?? row.utcDate, 'Live schedule'),
  };
}

function actionReceipt(
  signal: CompanionRouteSignal,
  action: ArrivalAction,
  executionClaim: ExecutionClaim,
  gate: string,
  outcome: string,
  adapterId: string,
  source: CompanionActionReceipt['receipt']['source'],
  summary: string,
): CompanionActionReceipt {
  return {
    schema: 'kopano.companion.action-receipt.v1',
    requestId: signal.requestId,
    actionId: action.id,
    destination: { id: signal.domain.id, label: signal.domain.label },
    executionClaim,
    effect: action.kind,
    receipt: { gate, outcome, adapterId, source },
    summary,
    createdAt: new Date().toISOString(),
  };
}

function isActionReceipt(value: unknown): value is CompanionActionReceipt {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CompanionActionReceipt>;
  return candidate.schema === 'kopano.companion.action-receipt.v1'
    && typeof candidate.requestId === 'string'
    && typeof candidate.actionId === 'string'
    && typeof candidate.executionClaim === 'string'
    && typeof candidate.createdAt === 'string'
    && !!candidate.destination
    && typeof candidate.destination.id === 'string'
    && typeof candidate.destination.label === 'string'
    && !!candidate.receipt
    && typeof candidate.receipt.gate === 'string'
    && typeof candidate.receipt.outcome === 'string'
    && typeof candidate.receipt.adapterId === 'string'
    && typeof candidate.receipt.source === 'string'
    && typeof candidate.summary === 'string';
}

export function arrivalActionsForSignal(signal: CompanionRouteSignal): readonly ArrivalAction[] {
  return (ACTIONS[signal.domain.id] ?? ACTIONS.kopanolabs).slice(0, 3);
}

export function readCompanionActionLog(storage?: Storage): CompanionActionReceipt[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(COMPANION_ACTION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isActionReceipt).slice(0, MAX_COMPANION_ACTION_RECEIPTS);
  } catch {
    return [];
  }
}

export function appendCompanionActionReceipt(receipt: CompanionActionReceipt, storage?: Storage): CompanionActionReceipt[] {
  const current = readCompanionActionLog(storage);
  const next = [receipt, ...current].slice(0, MAX_COMPANION_ACTION_RECEIPTS);
  if (storage) {
    try {
      storage.setItem(COMPANION_ACTION_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage can be disabled or full. The visible action result remains usable.
    }
  }
  return next;
}

export function navigationReceipt(signal: CompanionRouteSignal, action: ArrivalAction): CompanionActionReceipt {
  return actionReceipt(
    signal,
    action,
    'ROUTE_ONLY',
    'USER_TAP_REQUIRED',
    'navigation-requested',
    'kpgs.companion.navigation-intent',
    'LOCAL_UI',
    'Navigation was requested by the user. No provider or protected tool execution is claimed.',
  );
}

export async function executeArrivalAction(
  signal: CompanionRouteSignal,
  action: ArrivalAction,
  fetcher?: typeof fetch,
): Promise<ArrivalActionResult> {
  if (action.permission === 'PROTECTED_CONFIRMATION') {
    return {
      receipt: actionReceipt(
        signal,
        action,
        'BLOCKED',
        'BLOCK',
        'protected-confirmation-required',
        'kpgs.companion.guard',
        'LOCAL_UI',
        'This action requires a protected confirmation path that Arrival Actions v1 does not bypass.',
      ),
    };
  }

  if (action.kind === 'LOCAL_REVEAL') {
    return {
      receipt: actionReceipt(
        signal,
        action,
        'ROUTE_ONLY',
        'LOCAL_ONLY',
        'local-guidance-rendered',
        'kpgs.companion.local-guidance',
        'LOCAL_UI',
        action.localResult ?? action.summary,
      ),
    };
  }

  if (action.kind !== 'REMOTE_READ' || action.id !== 'fives-check-fixtures' || !fetcher) {
    return {
      receipt: actionReceipt(
        signal,
        action,
        'ROUTE_ONLY',
        'NO_EXECUTION',
        'action-not-executed',
        'kpgs.companion.arrival-actions',
        'LOCAL_UI',
        'No executable read-only adapter is attached to this action.',
      ),
    };
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 6500);
  try {
    const metaResponse = await fetcher(`${fivesFeedBase}/meta`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
    });
    if (!metaResponse.ok) throw new Error('fixture metadata unavailable');
    const meta = await metaResponse.json() as Record<string, unknown>;
    const season = label(meta.selectedSeason, '2025');

    const matchResponse = await fetcher(`${fivesFeedBase}/matches?season=${encodeURIComponent(season)}`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
    });
    const body = await matchResponse.json() as { matches?: unknown[] };
    if (!matchResponse.ok || !Array.isArray(body.matches)) throw new Error('fixture feed unavailable');

    const fixtures = body.matches
      .map(normalizeFixture)
      .filter((item): item is ArrivalFixture => Boolean(item))
      .slice(0, 4);
    if (!fixtures.length) throw new Error('fixture feed empty');

    return {
      fixtures,
      receipt: actionReceipt(
        signal,
        action,
        'TOOL_EXECUTED',
        'READ_ONLY',
        'fixture-read-complete',
        'fivesarena.public-fixture-read',
        'BROWSER_OBSERVED_REMOTE',
        `Read ${fixtures.length} current fixture records from the public FiveS Arena API. No write occurred.`,
      ),
    };
  } catch {
    return {
      receipt: actionReceipt(
        signal,
        action,
        'ROUTE_ONLY',
        'DEGRADED',
        'fixture-read-unavailable',
        'fivesarena.public-fixture-read',
        'BROWSER_OBSERVED_REMOTE',
        'The public fixture read did not complete, so no tool-execution claim is made. FiveS Arena remains the authoritative destination.',
      ),
    };
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
