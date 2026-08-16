import { motion } from 'framer-motion';
import type { View } from '../routeRegistry';
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
    eyebrow: 'LABS · INTERACTION CONTRACT',
    title: 'Every experiment gets a bounded first move.',
    description: 'The route is a small working surface: choose a need, see a local response, then decide what evidence is required before the idea becomes a promise.',
    stage: 'INPUT → RESPONSE → EVIDENCE',
    boundary: 'INTERACTION ≠ SYSTEM VALIDATION',
    signals: [['INPUT', 'One need, problem or goal'], ['MODE', 'Local interaction first'], ['GATE', 'Claim only after evidence']],
  },
  foc: {
    eyebrow: 'FOC · PROMOTION GATE',
    title: 'Validation is a living system, not a scorecard.',
    description: 'The matrix stays inspectable while the spatial layer keeps the meaning visible: a product must work, be seen, have backing, stay current and remain connected.',
    stage: 'WORKS · VISIBLE · BACKED',
    boundary: 'PRESENTATION ≠ VALIDATION',
    signals: [['WORKS', 'Does the thing function?'], ['VISIBLE', 'Can the public inspect it?'], ['BACKING', 'Who makes it real?']],
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
    </section>
  );
}
