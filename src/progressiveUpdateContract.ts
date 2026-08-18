export const KPGS_PROGRESSIVE_UPDATE = {
  canonicalRepository: 'RobynAwesome/Introduction-to-MCP',
  canonicalCommit: '6eeb285d0775a7e74ceadc06e32b4068fcfbc595',
  schema: 'kpgs.progressive-update.v1',
  receiptSchema: 'kpgs.swfus.receipt.v1',
  boundaryMarker: '#NB',
} as const;

export const SWFUS_STAGES = [
  'TELEMETRY', 'CLASSIFICATION', 'ROUTING', 'PROTOCOL_SELECTION',
  'INVARIANT_AUDIT', 'POC_FOC_CHECK', 'STATE_UPDATE', 'DISTRIBUTION',
] as const;

export type PlayerProfile = 'lite' | 'mobile' | 'enhanced' | 'immersive';
export type ProgressiveUpdate = {
  schema: 'kpgs.progressive-update.v1';
  update_id: string;
  node_id: string;
  operation: 'CREATE' | 'UPDATE';
  lane: string;
  context_route: string;
  protocol: string;
  idempotency_key: string;
  value: { profile: PlayerProfile; maximum_profile: PlayerProfile; selected_by: 'human' };
  apu_status: 'UNSPECIFIED';
  poc_validated: true;
  foc_detected: false;
  invariant_passed: true;
  authority_effect: 'none';
  state_class: 'non_authoritative';
  evidence_refs: string[];
  correlation_id: string;
  source: 'kopanolabs-adaptive-player';
  expected_version: null;
  boundary_marker: '#NB';
};

export type SwfusReceipt = {
  schema: 'kpgs.swfus.receipt.v1';
  receipt_id: string;
  update_id: string;
  node_id: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  disposition: 'APPLIED' | 'OBSERVED' | 'HELD' | 'REJECTED';
  stages: Array<{ stage: (typeof SWFUS_STAGES)[number]; status: string; reason: string }>;
  synchronized: boolean;
  canonical_authority_changed: false;
  state_digest: string | null;
  evidence_refs: string[];
  correlation_id: string;
  boundary_marker: '#NB';
  replayed: boolean;
  created_at: string;
};

const nonEmpty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

export function isSwfusReceipt(value: unknown): value is SwfusReceipt {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SwfusReceipt>;
  return item.schema === KPGS_PROGRESSIVE_UPDATE.receiptSchema
    && nonEmpty(item.receipt_id)
    && nonEmpty(item.update_id)
    && nonEmpty(item.node_id)
    && ['CREATE', 'READ', 'UPDATE', 'DELETE'].includes(item.operation || '')
    && ['APPLIED', 'OBSERVED', 'HELD', 'REJECTED'].includes(item.disposition || '')
    && typeof item.synchronized === 'boolean'
    && item.canonical_authority_changed === false
    && (item.state_digest === null || typeof item.state_digest === 'string')
    && Array.isArray(item.evidence_refs)
    && item.evidence_refs.every(nonEmpty)
    && typeof item.correlation_id === 'string'
    && item.boundary_marker === '#NB'
    && typeof item.replayed === 'boolean'
    && nonEmpty(item.created_at)
    && Array.isArray(item.stages)
    && item.stages.length === SWFUS_STAGES.length
    && item.stages.every((stage, index) => stage.stage === SWFUS_STAGES[index] && nonEmpty(stage.status) && typeof stage.reason === 'string');
}
