import rtcpProjection from './data/rtcp.json';

export type RtcpSeat = {
  seat: number;
  id: string;
  name: string;
  title: string;
  role: string;
  type?: string;
  weight: string;
};

export type RtcpDomain = {
  id: string;
  label: string;
  host: string;
  state: string;
  integration: 'ADAPT_EXISTING';
  primaryCouncil: string[];
  intentTerms: string[];
};

type RtcpPublicProjection = {
  authority: { constitutional: string; runtime: string };
  council: RtcpSeat[];
  domains: RtcpDomain[];
};

export type RtcpRoute = {
  schema: 'kopano.rtcp.route.v1';
  requestId: string;
  intent: string;
  domain: Pick<RtcpDomain, 'id' | 'label' | 'host' | 'state' | 'integration'>;
  council: RtcpSeat[];
  execution: {
    mode: 'GOVERNANCE_ROUTE_ONLY' | 'PROVIDER_EXECUTED';
    providerBinding: string;
    next?: string;
  };
  receipt: {
    gate: string;
    outcome: string;
    adapterId: string;
    constitutionalAuthority: string;
    runtimeAuthority: string;
    truthBoundary: string;
  };
};

const projection = rtcpProjection as RtcpPublicProjection;
export const council: readonly RtcpSeat[] = projection.council;
export const rtcpDomains: readonly RtcpDomain[] = projection.domains;

function localRoute(intent: string): RtcpRoute {
  const normalized = intent.toLowerCase();
  const domain = rtcpDomains
    .map(item => ({ item, score: item.intentTerms.filter(term => normalized.includes(term)).length }))
    .sort((a, b) => b.score - a.score)[0];
  const selectedDomain = domain?.score ? domain.item : rtcpDomains[0];
  const ids = new Set(selectedDomain.primaryCouncil);
  ids.add('kc'); ids.add('khelos'); ids.add('antigravity');
  if (/teach|learn|education/.test(normalized)) ids.add('cassey');
  if (/build|code|architecture/.test(normalized)) ids.add('cassie');
  if (/protocol|research|deep/.test(normalized)) ids.add('kessa');
  if (/story|culture|anime/.test(normalized)) ids.add('yassie');
  if (/strategy|scale|resource/.test(normalized)) ids.add('apex');
  if (/safe|guardian|ethic/.test(normalized)) ids.add('thari');
  if (/career|personnel|perimeter/.test(normalized)) ids.add('anchor');

  return {
    schema: 'kopano.rtcp.route.v1',
    requestId: `local-${Date.now().toString(36)}`,
    intent: intent.trim() || 'explore Kopano ecosystem',
    domain: selectedDomain,
    council: council.filter(member => ids.has(member.id)),
    execution: {
      mode: 'GOVERNANCE_ROUTE_ONLY',
      providerBinding: 'LOCAL_PROJECTION',
      next: 'The .NET RTCP gateway becomes authoritative when its public runtime endpoint is bound.',
    },
    receipt: {
      gate: 'ALLOW',
      outcome: 'routed-local',
      adapterId: 'kpgs.rtcp.local-projection',
      constitutionalAuthority: projection.authority.constitutional,
      runtimeAuthority: projection.authority.runtime,
      truthBoundary: 'This browser route mirrors the pinned RTCP projection; it does not claim external model execution.',
    },
  };
}

export async function routeRtcpIntent(intent: string): Promise<RtcpRoute> {
  const base = (import.meta.env.VITE_KOPANO_HUB_API_BASE as string | undefined)?.replace(/\/$/, '');
  if (!base) return localRoute(intent);

  try {
    const response = await fetch(`${base}/api/rtcp/route`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ intent }),
    });
    if (!response.ok) return localRoute(intent);
    return await response.json() as RtcpRoute;
  } catch {
    return localRoute(intent);
  }
}
