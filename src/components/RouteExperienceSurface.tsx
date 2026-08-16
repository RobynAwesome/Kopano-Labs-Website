import { motion } from 'framer-motion';
import type { View } from '../routeRegistry';
import { KopanoContextWorkbench } from './KopanoContextWorkbench';
import { KopanoScene } from './KopanoScene';

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

export function RouteExperienceSurface({ view, compact = false }: { view: View; compact?: boolean }) {
  const surface = surfaces[view];
  if (!surface) return null;

  return (
    <section className={'route-experience-surface route-surface-' + view + (compact ? ' compact' : '')} aria-label={surface.eyebrow + ' spatial proof surface'} data-kpgs-surface={view}>
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
        <KopanoScene view={view} />
        <motion.div className="route-experience-stage-copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <span>LIVE SPATIAL CONTRACT</span>
          <strong>{surface.stage}</strong>
          <small>Pointer response follows route intent. Motion pauses when the page is hidden or reduced.</small>
        </motion.div>
      </div>
      {view === 'labs' && <KopanoContextWorkbench />}
    </section>
  );
}
