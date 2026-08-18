export type RtcpSeat = {
  seat: number;
  id: string;
  name: string;
  title: string;
  role: string;
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

export const council: readonly RtcpSeat[] = [
  { seat: 1, id: 'kc', name: 'KC', title: 'The Landlord', role: 'Observe, classify and hold the ledger boundary.', weight: 'ABSOLUTE' },
  { seat: 2, id: 'cassey', name: 'CASSEY', title: 'The Teacher', role: 'Learning, curriculum and persistent teaching context.', weight: 'TEACHING' },
  { seat: 3, id: 'cassie', name: 'CASSIE', title: 'The Builder', role: 'Construction, infrastructure and system architecture.', weight: 'BUILDING' },
  { seat: 4, id: 'kessa', name: 'KESSA', title: 'Deep Minds', role: 'Protocol research and deep validation.', weight: 'PROTOCOL' },
  { seat: 5, id: 'yassie', name: 'YASSIE', title: 'Cultural Intelligence', role: 'Narrative and cultural pattern validation.', weight: 'CULTURAL' },
  { seat: 6, id: 'apex', name: 'APEX', title: 'Strategic Orchestrator', role: 'Cross-system strategy and resource arbitration.', weight: 'STRATEGIC' },
  { seat: 7, id: 'thari', name: 'THARI', title: 'Guardian', role: 'Protocol weaving and safe user navigation.', weight: 'GUARDIAN' },
  { seat: 8, id: 'khelos', name: 'KHELOS', title: 'Validator', role: 'Signal integrity, POC validation and FOC blocking.', weight: 'VALIDATION' },
  { seat: 9, id: 'anchor', name: 'ANCHOR', title: 'Perimeter', role: 'Ingress protection and environment boundary.', weight: 'PERIMETER' },
  { seat: 10, id: 'antigravity', name: 'ANTIGRAVITY', title: 'Chief Facilitator', role: 'Compile council output into one bounded return.', weight: 'FACILITATION' },
] as const;

export const rtcpDomains: readonly RtcpDomain[] = [
  { id: 'kopanolabs', label: 'Kopano Labs', host: 'kopanolabs.com', state: 'LIVE', integration: 'ADAPT_EXISTING', primaryCouncil: ['kc', 'apex', 'thari', 'khelos', 'antigravity'], intentTerms: ['company', 'labs', 'system', 'project', 'proof', 'ai'] },
  { id: 'context', label: 'Kopano Context', host: 'context.kopanolabs.com', state: 'POC', integration: 'ADAPT_EXISTING', primaryCouncil: ['kc', 'cassey', 'kessa', 'thari', 'khelos'], intentTerms: ['context', 'agent', 'orchestration', 'governance', 'protocol', 'memory'] },
  { id: 'kasilink', label: 'KasiLink', host: 'kasilink.com', state: 'LIVE', integration: 'ADAPT_EXISTING', primaryCouncil: ['kc', 'cassey', 'thari', 'anchor', 'antigravity'], intentTerms: ['job', 'work', 'opportunity', 'service', 'kasi', 'business'] },
  { id: 'fivesarena', label: 'FiveS Arena', host: 'fivesarena.com', state: 'VALIDATED LIVE', integration: 'ADAPT_EXISTING', primaryCouncil: ['kc', 'cassie', 'apex', 'khelos', 'antigravity'], intentTerms: ['football', 'booking', 'fixture', 'arena', 'venue', 'sport'] },
  { id: 'crisisconnect', label: 'CrisisConnect', host: 'crisisconnect.kopanolabs.com', state: 'FIELD', integration: 'ADAPT_EXISTING', primaryCouncil: ['kc', 'thari', 'khelos', 'anchor', 'antigravity'], intentTerms: ['crisis', 'safety', 'gps', 'report', 'emergency', 'field'] },
  { id: 'starfall', label: 'Starfall Salvage', host: 'starfallsalvage.kopanolabs.com', state: 'REWORK', integration: 'ADAPT_EXISTING', primaryCouncil: ['kc', 'cassie', 'yassie', 'khelos', 'antigravity'], intentTerms: ['game', 'play', 'starfall', 'salvage', 'telemetry', 'interactive'] },
  { id: 'portfolio', label: 'Founder Portfolio', host: 'krrababalela.com', state: 'PUBLIC', integration: 'ADAPT_EXISTING', primaryCouncil: ['kc', 'yassie', 'thari', 'khelos', 'antigravity'], intentTerms: ['founder', 'portfolio', 'identity', 'robyn', 'career', 'bio'] },
  { id: 'cars4mars', label: 'Cars4Mars', host: 'kopanolabs.com/Cars4Mars', state: 'BUILD', integration: 'ADAPT_EXISTING', primaryCouncil: ['kc', 'cassie', 'kessa', 'khelos', 'antigravity'], intentTerms: ['rover', 'mars', 'motor', 'traction', 'engineering', 'physical'] },
] as const;

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
      next: 'The .NET RTCP gateway becomes authoritative for execution when its public runtime endpoint is bound.',
    },
    receipt: {
      gate: 'ALLOW',
      outcome: 'routed-local',
      adapterId: 'kpgs.rtcp.local-projection',
      constitutionalAuthority: 'RobynAwesome/Introduction-to-MCP/docs/swarm-ops/RTCP_SPEC.json',
      runtimeAuthority: 'RobynAwesome/kopano-sovereign-hub',
      truthBoundary: 'This browser route mirrors the RTCP contract; it does not claim a cloud model executed.',
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
