import { motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import { getExperienceProfile, type ExperienceProfile } from '../experienceRuntime';
import { createKPGSSceneContract, emitKPGSReceipt } from '../kpgsSceneContract';
import type { View } from '../routeRegistry';
import '../lite-spatial.css';
import { KopanoContextWorkbench } from './KopanoContextWorkbench';

const KopanoScene = lazy(() => import('./KopanoScene').then((module) => ({ default: module.KopanoScene })));

type SurfaceDefinition = {
  eyebrow: string;
  title: string;
  description: string;
  stage: string;
  boundary: string;
  signals: readonly [string, string][];
};

const surfaces: Partial<Record<View, SurfaceDefinition>> = {
  labs: {
    eyebrow: 'LABS · KC LOCAL REHEARSAL',
    title: 'Make the orchestration visible.',
    description: 'Labs is a working surface, not a gallery. Enter one need, watch KC classify the lane, then inspect the boundary before the next promise is made.',
    stage: 'INPUT → CLASSIFY → ROUTE → EVIDENCE',
    boundary: 'LOCAL REHEARSAL ≠ PRODUCTION ORCHESTRATION',
    signals: [['OWNER', 'KC / Cassy governance lane'], ['MODE', 'Browser-local first move'], ['GATE', 'Evidence before claim']],
  },
  foc: {
    eyebrow: 'FOC · EVIDENCE GATE',
    title: 'One contract. No theatre.',
    description: 'This review surface keeps the state legible: inspect what works, what is visible, who backs it, how current it is and what it connects to. FOC groups are out; evidence stays.',
    stage: 'INPUT → REVIEW → GATE',
    boundary: 'PRESENTATION ≠ VALIDATION',
    signals: [['WORKS', 'Does the thing function?'], ['EVIDENCE', 'Can the artifact be inspected?'], ['OWNER', 'Who carries the next move?']],
  },
  proof: {
    eyebrow: 'PROOF · SOURCE LINEAGE',
    title: 'Proof is a route, not a claim.',
    description: 'This surface connects the public artifact to its source authority and current state, so visitors can inspect provenance without confusing a deployment with ownership.',
    stage: 'SOURCE → STATE → ARTIFACT',
    boundary: 'SOURCE LINEAGE ≠ DEPLOYMENT PROVENANCE',
    signals: [['SOURCE', 'Who owns the authority?'], ['STATE', 'What is true now?'], ['ARTIFACT', 'What can be inspected?']],
  },
  content: {
    eyebrow: 'PUBLIC ESTATE · NAVIGATION CONTRACT',
    title: 'The estate stays connected without becoming one product.',
    description: 'Projects, systems, experiments and governance surfaces keep their own identity. This map gives the visitor a next step while the labels preserve source lineage.',
    stage: 'ESTATE → LINEAGE → NEXT STEP',
    boundary: 'PUBLIC ESTATE ≠ SOURCE AUTHORITY',
    signals: [['ESTATE', 'Projects stay distinct'], ['LINEAGE', 'Source is named'], ['ROUTE', 'Next action is visible']],
  },
};

function LiteSpatialScene({ view, stage, profile }: { view: View; stage: string; profile: ExperienceProfile }) {
  const contract = useMemo(() => createKPGSSceneContract(view, profile, 'home'), [profile, view]);

  useEffect(() => {
    const reason = profile.reducedMotion ? 'reduced-motion' : profile.saveData ? 'save-data' : profile.tier;
    emitKPGSReceipt(contract, 'scene_mounted', { renderer: 'css-lite', webgl: false, reason });
  }, [contract, profile]);

  return (
    <div
      className="kopano-scene kopano-scene-lite"
      data-kpgs-scene={contract.scene.id}
      data-kpgs-tier={contract.runtime.tier}
      data-kpgs-renderer="css-lite"
      aria-label="Kopano spatial proof surface, lightweight non-WebGL renderer"
    >
      <div className="lite-spatial-grid" aria-hidden="true" />
      <div className="lite-spatial-orbit lite-orbit-a" aria-hidden="true" />
      <div className="lite-spatial-orbit lite-orbit-b" aria-hidden="true" />
      <div className="lite-spatial-core" aria-hidden="true"><span>KC</span></div>
      <div className="lite-spatial-node lite-node-a" aria-hidden="true"><i /><span>INPUT</span></div>
      <div className="lite-spatial-node lite-node-b" aria-hidden="true"><i /><span>CLASSIFY</span></div>
      <div className="lite-spatial-node lite-node-c" aria-hidden="true"><i /><span>ROUTE</span></div>
      <div className="lite-spatial-node lite-node-d" aria-hidden="true"><i /><span>EVIDENCE</span></div>
      <span className="scene-label scene-label-a">KPGS · CSS LITE</span>
      <span className="scene-label scene-label-b">NO WEBGL · PROOF PRESERVED</span>
      <span className="scene-label scene-label-c">{stage}</span>
    </div>
  );
}

export function RouteExperienceSurface({ view, compact = false }: { view: View; compact?: boolean }) {
  const surface = surfaces[view];
  const profile = useMemo(() => getExperienceProfile(), []);
  if (!surface) return null;

  const avoidWebGL = profile.tier === 'lite' || profile.saveData || profile.reducedMotion;

  return (
    <section className={'route-experience-surface route-surface-' + view + (compact ? ' compact' : '')} aria-label={surface.eyebrow + ' spatial proof surface'} data-kpgs-surface={view} data-kpgs-renderer={avoidWebGL ? 'css-lite' : 'webgl'}>
      <div className="route-experience-copy">
        <span className="eyebrow">{surface.eyebrow}</span>
        <h2>{surface.title}</h2>
        <p>{surface.description}</p>
        <div className="route-experience-signals">
          {surface.signals.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}
        </div>
        <div className="route-experience-boundary"><span>TRUTH BOUNDARY</span><strong>{surface.boundary}</strong></div>
      </div>
      <div className="route-experience-stage">
        {avoidWebGL
          ? <LiteSpatialScene view={view} stage={surface.stage} profile={profile} />
          : <Suspense fallback={<div className="scene-label scene-label-a" role="status">LOADING · SPATIAL CONTRACT</div>}><KopanoScene view={view} /></Suspense>}
        <motion.div className="route-experience-stage-copy" initial={avoidWebGL ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <span>{avoidWebGL ? 'LIVE LIGHTWEIGHT CONTRACT' : 'LIVE SPATIAL CONTRACT'}</span>
          <strong>{surface.stage}</strong>
          <small>{avoidWebGL ? 'Capability gate preserved the proof surface without requesting WebGL.' : 'Pointer response follows route intent. Motion pauses when the page is hidden or reduced.'}</small>
        </motion.div>
      </div>
      {view === 'labs' && <KopanoContextWorkbench />}
    </section>
  );
}
