import { motion } from 'framer-motion';
import { governanceExperimentAuthority, governedExperiments, type GovernedExperiment } from '../data/governedExperiments';

const stateTone = (state: GovernedExperiment['state']) => {
  if (['VALIDATED_LIVE', 'VALIDATED_FIELD', 'DELIVERED_EXTERNAL', 'LIVE', 'PUBLIC'].includes(state)) return 'validated';
  if (['FIELD', 'BUILD', 'POC', 'GOVERNED_EXTERNAL'].includes(state)) return 'building';
  if (['REWORK', 'TARGET'].includes(state)) return 'review';
  return 'maybe';
};

const lifecycleIndex = ['PLANT', 'WATER', 'PRUNE', 'HARVEST'] as const;

function ExperimentCard({ experiment, index }: { experiment: GovernedExperiment; index: number }) {
  const target = experiment.surface ?? experiment.repo;
  const external = Boolean(target?.startsWith('http'));

  return <motion.article
    className={`governed-experiment-card ${stateTone(experiment.state)}`}
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: .12 }}
    transition={{ delay: Math.min(index * .025, .2) }}
  >
    <div className="governed-experiment-topline">
      <span>{experiment.lifecycle ?? 'EXTENSION'}</span>
      <b>{experiment.state}</b>
    </div>
    <small>{experiment.lane}</small>
    <h3>{experiment.name}</h3>
    <p>{experiment.description}</p>
    <div className="governed-experiment-backing"><span>BOUNDARY</span><strong>{experiment.backing}</strong></div>
    <div className="governed-experiment-actions">
      {target ? <a href={target} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>Open evidence →</a> : <span>MAYBE · binding receipt required</span>}
      {experiment.surface && experiment.repo && <a href={experiment.repo} target="_blank" rel="noreferrer">Source ↗</a>}
    </div>
  </motion.article>;
}

export function GovernanceExperimentMap({ query = '' }: { query?: string }) {
  const normalized = query.trim().toLowerCase();
  const visible = governedExperiments.filter((experiment) => !normalized || [
    experiment.name,
    experiment.lane,
    experiment.state,
    experiment.lifecycle ?? '',
    experiment.backing,
    experiment.description,
  ].join(' ').toLowerCase().includes(normalized));
  const validationInputs = governedExperiments.filter((experiment) => experiment.relation === 'validation-input').length;

  return <section className="governed-experiment-map" aria-labelledby="governed-experiment-title">
    <div className="governed-experiment-heading">
      <div>
        <span className="eyebrow">KOPANO SOVEREIGN HUB · GOVERNANCE SYSTEMS EXPERIMENTS</span>
        <h2 id="governed-experiment-title">The things we actually run.</h2>
      </div>
      <div className="governed-experiment-count"><strong>{visible.length}</strong><span>visible nodes</span><small>{validationInputs} external validation inputs</small></div>
    </div>

    <div className="governance-authority-strip">
      <div><span>CONSTITUTION</span><strong>{governanceExperimentAuthority.constitutional}</strong></div>
      <div><span>RUNTIME</span><strong>{governanceExperimentAuthority.runtime}</strong></div>
      <div><span>LAW</span><strong>{governanceExperimentAuthority.realityIndex}</strong></div>
    </div>

    <div className="mmao-lifecycle" aria-label="Original MMAO lifecycle">
      {lifecycleIndex.map((phase, index) => <div key={phase}><span>{String(index + 1).padStart(2, '0')}</span><strong>{phase}</strong><small>{governedExperiments.filter((experiment) => experiment.lifecycle === phase).map((experiment) => experiment.name).join(' · ')}</small></div>)}
      <div><span>05</span><strong>FRUIT</strong><small>Only the live, receipt-backed ecosystem graduates here.</small></div>
    </div>

    <p className="governed-experiment-law"><strong>{governanceExperimentAuthority.renterAssertion}</strong> · The Sovereign Hub is the runtime projection. MAIN-BRAIN stays landlord. Search/indexing observes the receipts; it does not create them.</p>

    <div className="governed-experiment-grid">
      {visible.map((experiment, index) => <ExperimentCard key={experiment.id} experiment={experiment} index={index} />)}
    </div>

    {visible.length === 0 && <div className="governed-experiment-empty">No governed experiment matches this search.</div>}
  </section>;
}
