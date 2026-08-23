import type { RtcpRoute } from './rtcpRuntime';

export type ExecutionClaim = 'ROUTE_ONLY' | 'PROVIDER_EXECUTED' | 'TOOL_EXECUTED' | 'BLOCKED';

export type CompanionAction = {
  id: 'open' | 'why' | 'again';
  label: string;
};

export type CompanionTurn = {
  schema: 'kopano.companion.turn.v1';
  speaker: 'Kopano Companion';
  message: string;
  goalSummary: string;
  routeSummary: string;
  actions: CompanionAction[];
  proofAvailable: boolean;
  executionClaim: ExecutionClaim;
  proofLine: string;
};

export const companionGreeting: CompanionTurn = {
  schema: 'kopano.companion.turn.v1',
  speaker: 'Kopano Companion',
  message: "Tell me what you're trying to do. I'll walk with you.",
  goalSummary: 'Waiting for your goal.',
  routeSummary: 'Nothing has been routed yet.',
  actions: [],
  proofAvailable: false,
  executionClaim: 'ROUTE_ONLY',
  proofLine: 'No system action has run.',
};

function goalFromIntent(intent: string) {
  const normalized = intent.toLowerCase();
  if (/work|job|gig|opportun|career/.test(normalized)) return 'find work or opportunity';
  if (/rover|mars|wheel|architecture|robot/.test(normalized)) return 'inspect or advance the rover mission';
  if (/crisis|emergency|report|safety/.test(normalized)) return 'handle a field or safety report';
  if (/football|soccer|court|fixture|arena/.test(normalized)) return 'use the football system';
  if (/learn|student|teach|education|course/.test(normalized)) return 'learn or get guided support';
  if (/ai|agent|context|orchestrat|scale/.test(normalized)) return 'work with the Kopano AI layer';
  if (/game|starfall|salvage/.test(normalized)) return 'enter an interactive systems experience';
  return 'find the right Kopano system';
}

function messageFor(intent: string, route: RtcpRoute) {
  const normalized = intent.toLowerCase();
  const destination = route.domain.label;
  if (/work|job|gig|opportun|career/.test(normalized)) {
    return `Got you — you're looking for work or opportunity. ${destination} is the best lane I found.`;
  }
  if (/rover|mars|wheel|architecture|robot/.test(normalized)) {
    return `You're checking the rover mission. ${destination} is where the current build state and evidence live.`;
  }
  if (/crisis|emergency|report|safety/.test(normalized)) {
    return `You're dealing with something field or safety related. ${destination} is the lane I would open first.`;
  }
  if (/football|soccer|court|fixture|arena/.test(normalized)) {
    return `You want the football lane. ${destination} is the right place to continue.`;
  }
  if (/learn|student|teach|education|course/.test(normalized)) {
    return `You want help learning or teaching. I found ${destination} as the best current lane.`;
  }
  return `I found a good route for that: ${destination}. You can continue there, or ask me why I chose it.`;
}

function executionClaim(route: RtcpRoute): ExecutionClaim {
  if (route.receipt.gate.toUpperCase().includes('BLOCK') || route.receipt.outcome.toLowerCase().includes('block')) {
    return 'BLOCKED';
  }
  if (route.execution.mode === 'PROVIDER_EXECUTED') return 'PROVIDER_EXECUTED';
  return 'ROUTE_ONLY';
}

export function companionTurnForRoute(intent: string, route: RtcpRoute): CompanionTurn {
  const claim = executionClaim(route);
  const proofLine = claim === 'PROVIDER_EXECUTED'
    ? 'A provider execution receipt is attached to this route.'
    : claim === 'BLOCKED'
      ? 'The protected action did not run.'
      : 'I selected a route only. No external AI or protected tool action is being claimed.';

  return {
    schema: 'kopano.companion.turn.v1',
    speaker: 'Kopano Companion',
    message: messageFor(intent, route),
    goalSummary: goalFromIntent(intent),
    routeSummary: `${route.domain.label} · ${route.domain.state}`,
    actions: [
      { id: 'open', label: `Open ${route.domain.label}` },
      { id: 'why', label: 'Why this route?' },
      { id: 'again', label: 'Try another request' },
    ],
    proofAvailable: true,
    executionClaim: claim,
    proofLine,
  };
}
