import { motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import type { ExperienceProfile } from '../experienceRuntime';
import { createKPGSSceneContract, emitKPGSReceipt } from '../kpgsSceneContract';
import type { View } from '../routeRegistry';
import { useExperienceProfile } from '../useExperienceProfile';
import '../lite-spatial.css';
import { KopanoContextWorkbench } from './KopanoContextWorkbench';
import { ProjectRegistry } from './ProjectRegistry';

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
    eyebrow: 'REAL-WORLD WORK',
    title: 'Built in real environments.',
    description: 'The evidence page is intentionally human-first. Technical governance stays behind the interface and is available through Proof when needed.',
    stage: 'BUILD → TEST → SCALE',
    boundary: 'PUBLIC EXPERIENCE ≠ INTERNAL GOVERNANCE CONSOLE',
    signals: [['BUILD', 'Useful first version'], ['TEST', 'Real operators and constraints'], ['SCALE', 'Only what survives']],
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
    eyebrow: 'PUBLIC ESTATE · ROBYNAWESOME AUTHORITY',
    title: 'Every public project gets a place in the estate.',
    description: 'RobynAwesome is now the canonical GitHub namespace for Kopano-owned repositories. Operating products, client systems and governance cores remain distinct from labs, workshops, learning repositories and reference forks.',
    stage: 'NAMESPACE → CLASSIFY → ROUTE → RECEIPT',
    boundary: 'REPOSITORY OWNERSHIP ≠ PRODUCTION VALIDATION',
    signals: [['OWNER', 'RobynAwesome namespace'], ['SCOPE', 'Public repositories only'], ['GATE', 'Product claims still require receipts']],
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
      aria-label="Lightweight version of the interactive project map"
    >
      <div className="lite-spatial-grid" aria-hidden="true" />
      <div className="lite-spatial-orbit lite-orbit-a" aria-hidden="true" />
      <div className="lite-spatial-orbit lite-orbit-b" aria-hidden="true" />
      <div className="lite-spatial-core" aria-hidden="true"><span>KC</span></div>
      <div className="lite-spatial-node lite-node-a" aria-hidden="true"><i /><span>NEED</span></div>
      <div className="lite-spatial-node lite-node-b" aria-hidden="true"><i /><span>CHOOSE</span></div>
      <div className="lite-spatial-node lite-node-c" aria-hidden="true"><i /><span>OPEN</span></div>
      <div className="lite-spatial-node lite-node-d" aria-hidden="true"><i /><span>PROOF</span></div>
      <span className="scene-label scene-label-a">LIGHTWEIGHT MODE</span>
      <span className="scene-label scene-label-b">FAST PATH · SAME CONTENT</span>
      <span className="scene-label scene-label-c">{stage}</span>
    </div>
  );
}

export function RouteExperienceSurface({ view, compact = false }: { view: View; compact?: boolean }) {
  if (view === 'foc') return null;

  const surface = surfaces[view];
  const profile = useExperienceProfile();
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
          : <Suspense fallback={<div className="scene-label scene-label-a" role="status">Loading interactive view…</div>}><KopanoScene view={view} /></Suspense>}
        <motion.div className="route-experience-stage-copy" initial={avoidWebGL ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <span>{avoidWebGL ? 'FAST VIEW' : 'INTERACTIVE VIEW'}</span>
          <strong>{surface.stage}</strong>
          <small>{avoidWebGL ? 'The page automatically keeps the same content while using a lighter renderer.' : 'Drag to explore. Motion automatically adapts to your device and preferences.'}</small>
        </motion.div>
      </div>
      {view === 'labs' && <KopanoContextWorkbench />}
      {view === 'content' && <ProjectRegistry />}
    </section>
  );
}
