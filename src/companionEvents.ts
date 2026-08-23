import type { RtcpRoute } from './rtcpRuntime';

export const COMPANION_ROUTE_EVENT = 'kpgs:companion-route';

export type CompanionRouteSignal = {
  schema: 'kopano.companion.route-signal.v1';
  requestId: string;
  domain: RtcpRoute['domain'];
  execution: Pick<RtcpRoute['execution'], 'mode'>;
  receipt: Pick<RtcpRoute['receipt'], 'gate' | 'outcome' | 'adapterId'>;
};

function signalFromRoute(route: RtcpRoute): CompanionRouteSignal {
  return {
    schema: 'kopano.companion.route-signal.v1',
    requestId: route.requestId,
    domain: route.domain,
    execution: { mode: route.execution.mode },
    receipt: {
      gate: route.receipt.gate,
      outcome: route.receipt.outcome,
      adapterId: route.receipt.adapterId,
    },
  };
}

export function announceCompanionRoute(route: RtcpRoute) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<CompanionRouteSignal>(COMPANION_ROUTE_EVENT, { detail: signalFromRoute(route) }));
}

export function subscribeCompanionRoute(listener: (signal: CompanionRouteSignal) => void) {
  if (typeof window === 'undefined') return () => undefined;
  const handle = (event: Event) => {
    const signal = (event as CustomEvent<CompanionRouteSignal>).detail;
    if (!signal || signal.schema !== 'kopano.companion.route-signal.v1') return;
    listener(signal);
  };
  window.addEventListener(COMPANION_ROUTE_EVENT, handle);
  return () => window.removeEventListener(COMPANION_ROUTE_EVENT, handle);
}
