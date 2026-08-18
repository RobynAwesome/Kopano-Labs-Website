import registry from './governedExperiments.json';

export type GovernedExperiment = {
  id: string;
  name: string;
  lane: string;
  lifecycle: 'PLANT' | 'WATER' | 'PRUNE' | 'HARVEST' | 'FRUIT' | null;
  state: 'LIVE' | 'FIELD' | 'POC' | 'BUILD' | 'REWORK' | 'TARGET' | 'VALIDATED_LIVE' | 'VALIDATED_FIELD' | 'DELIVERED_EXTERNAL' | 'GOVERNED_EXTERNAL' | 'PUBLIC';
  relation: 'experiment' | 'validation-input' | 'evidence-surface';
  repo: string | null;
  surface: string | null;
  declaredDomain?: string;
  backing: string;
  description: string;
};

type GovernedExperimentRegistry = {
  schema: string;
  snapshotDate: string;
  source: {
    repository: string;
    path: string;
    commit: string;
    sourceSchema: string;
    sourceSha256: string;
  };
  authority: {
    constitutional: string;
    runtime: string;
    publicEvidence: string;
    repoNamespace: string;
    renterAssertion: string;
    realityIndex: string;
    promotion: string;
    convergence: string;
    projectionPolicy: string;
  };
  nodes: GovernedExperiment[];
};

export const governedExperimentRegistry = registry as GovernedExperimentRegistry;
export const governanceExperimentAuthority = governedExperimentRegistry.authority;
export const governedExperiments = governedExperimentRegistry.nodes;
export const governedExperimentSource = governedExperimentRegistry.source;
