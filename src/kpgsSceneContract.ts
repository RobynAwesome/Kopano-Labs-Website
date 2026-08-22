import type { ExperienceProfile, ExperienceTier } from './experienceRuntime';
import { routeForView, type View } from './routeRegistry';

export type KPGSSceneId = 'home' | 'context' | 'fives' | 'kasilink' | 'crisis' | 'starfall' | 'mars';

export type KPGSIntentClass = 'narrative' | 'operational' | 'model' | 'source';

export type KPGSBudget = {
  dpr: number | [number, number];
  particleCount: number;
  sparkles: number;
  maxDrawCalls: number;
  maxFrameMs: number;
};

export type KPGSSceneContract = {
  schema: 'kpgs.scene_contract.v1';
  route: {
    id: View;
    path: string;
    prompt: string;
    intent: string;
    intentClass: KPGSIntentClass;
  };
  scene: {
    id: KPGSSceneId;
    label: string;
  };
  runtime: {
    tier: ExperienceTier;
    animate: boolean;
    reducedMotion: boolean;
    saveData: boolean;
    pauseWhenHidden: true;
  };
  budget: KPGSBudget;
  behavior: {
    pointerResponse: 'off' | 'lerped';
    routeResponse: 'contract';
    orbit: 'bounded';
  };
  boundary: string;
  receipt: {
    schema: 'kpgs.scene_receipt.v1';
    channel: 'local-event';
    network: false;
  };
};

const routeScenes: Record<View, KPGSSceneId> = {
  home: 'home',
  systems: 'context',
  labs: 'home',
  content: 'home',
  foc: 'home',
  proof: 'home',
  about: 'home',
  cars4mars: 'mars',
  'cars4mars-ledger': 'mars',
  'cars4mars-architecture': 'mars',
  'cars4mars-media': 'mars',
  'cars4mars-support': 'mars',
};

const sceneLabels: Record<KPGSSceneId, string> = {
  home: 'Kopano spatial field',
  context: 'Kopano Context mesh',
  fives: 'FiveS Arena field',
  kasilink: 'KasiLink network',
  crisis: 'CrisisConnect radar',
  starfall: 'Starfall Salvage field',
  mars: 'Cars4Mars rover',
};

const intentClasses: Record<View, KPGSIntentClass> = {
  home: 'narrative',
  systems: 'operational',
  labs: 'operational',
  content: 'source',
  foc: 'source',
  proof: 'source',
  about: 'source',
  cars4mars: 'model',
  'cars4mars-ledger': 'source',
  'cars4mars-architecture': 'model',
  'cars4mars-media': 'source',
  'cars4mars-support': 'operational',
};

const tierBudgets: Record<ExperienceTier, KPGSBudget> = {
  lite: {
    dpr: 1,
    particleCount: 0,
    sparkles: 0,
    maxDrawCalls: 12,
    maxFrameMs: 33.3,
  },
  balanced: {
    dpr: [1, 1.2],
    particleCount: 160,
    sparkles: 12,
    maxDrawCalls: 18,
    maxFrameMs: 24,
  },
  full: {
    dpr: [1, 1.45],
    particleCount: 420,
    sparkles: 28,
    maxDrawCalls: 24,
    maxFrameMs: 16.7,
  },
};

function boundaryFor(intentClass: KPGSIntentClass, scene: KPGSSceneId) {
  if (scene === 'mars' || intentClass === 'model') return 'MODEL EVIDENCE ≠ PHYSICAL VALIDATION';
  if (intentClass === 'source') return 'SOURCE LINEAGE ≠ DEPLOYMENT PROVENANCE';
  if (intentClass === 'operational') return 'INTERACTION ≠ SYSTEM VALIDATION';
  return 'VISUAL FORM ≠ PRODUCT CLAIM';
}

export function createKPGSSceneContract(
  view: View,
  profile: ExperienceProfile,
  sceneId = routeScenes[view],
): KPGSSceneContract {
  const route = routeForView(view);
  const intentClass = intentClasses[view];

  return {
    schema: 'kpgs.scene_contract.v1',
    route: {
      id: view,
      path: route.path,
      prompt: route.humanPrompt,
      intent: route.intents[0] ?? route.id,
      intentClass,
    },
    scene: {
      id: sceneId,
      label: sceneLabels[sceneId],
    },
    runtime: {
      tier: profile.tier,
      animate: !profile.reducedMotion && !profile.saveData,
      reducedMotion: profile.reducedMotion,
      saveData: profile.saveData,
      pauseWhenHidden: true,
    },
    budget: { ...tierBudgets[profile.tier] },
    behavior: {
      pointerResponse: profile.reducedMotion || profile.saveData ? 'off' : 'lerped',
      routeResponse: 'contract',
      orbit: 'bounded',
    },
    boundary: boundaryFor(intentClass, sceneId),
    receipt: {
      schema: 'kpgs.scene_receipt.v1',
      channel: 'local-event',
      network: false,
    },
  };
}

export function applyKPGSRootAttributes(contract: KPGSSceneContract) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.kpgsSchema = contract.schema;
  root.dataset.kpgsRoute = contract.route.id;
  root.dataset.kpgsScene = contract.scene.id;
  root.dataset.kpgsIntentClass = contract.route.intentClass;
  root.dataset.kpgsTier = contract.runtime.tier;
  root.dataset.kpgsMotion = contract.runtime.reducedMotion ? 'reduced' : 'full';
  root.dataset.kpgsBudget = String(contract.budget.maxDrawCalls);
}

export function emitKPGSReceipt(
  contract: KPGSSceneContract,
  event: 'route_activated' | 'scene_selected' | 'scene_mounted',
  details: Record<string, string | number | boolean> = {},
) {
  const receipt = {
    schema: contract.receipt.schema,
    event,
    ts: new Date().toISOString(),
    route: contract.route.id,
    scene: contract.scene.id,
    tier: contract.runtime.tier,
    budget_draw_calls: contract.budget.maxDrawCalls,
    ...details,
  };

  if (typeof window !== 'undefined') {
    performance.mark('kpgs:' + event + ':' + contract.scene.id);
    window.dispatchEvent(new CustomEvent('kpgs:receipt', { detail: receipt }));
  }

  return receipt;
}

export const sceneForView = (view: View) => routeScenes[view];
