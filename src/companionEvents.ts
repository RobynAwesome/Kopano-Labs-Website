import type { RtcpRoute } from './rtcpRuntime';

export const COMPANION_ROUTE_EVENT = 'kpgs:companion-route';

export function announceCompanionRoute(route: RtcpRoute) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<RtcpRoute>(COMPANION_ROUTE_EVENT, { detail: route }));
}

export function subscribeCompanionRoute(listener: (route: RtcpRoute) => void) {
  if (typeof window === 'undefined') return () => undefined;
  const handle = (event: Event) => {
    const route = (event as CustomEvent<RtcpRoute>).detail;
    if (!route || route.schema !== 'kopano.rtcp.route.v1') return;
    listener(route);
  };
  window.addEventListener(COMPANION_ROUTE_EVENT, handle);
  return () => window.removeEventListener(COMPANION_ROUTE_EVENT, handle);
}
