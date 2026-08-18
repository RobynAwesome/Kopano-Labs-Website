import evidence from '../data/publicEvidence.json';

type EvidenceItem = {
  id: string;
  name: string;
  area: string;
  state: string;
  summary: string;
  href: string;
};

type PublicEvidence = {
  headline: string;
  intro: string;
  primaryAction: string;
  primaryActionHref: string;
  items: EvidenceItem[];
  technical: {
    source: string;
    runtime: string;
    rule: string;
    detailsHref: string;
  };
};

const publicEvidence = evidence as PublicEvidence;

const contextStats = [
  ['33.6%', 'South Africa unemployment', 'Q2 2026'],
  ['60.9%', 'Ages 15–24', 'Q1 2026'],
  ['40.6%', 'Ages 25–34', 'Q1 2026'],
] as const;

const process = [
  ['01', 'Build', 'Start with a real problem and a useful first version.'],
  ['02', 'Test', 'Put it in front of real people, operators or physical constraints.'],
  ['03', 'Scale', 'Expand only what survives the real environment.'],
] as const;

export function FOCMatrix() {
  return <section className="proof-surface" id="field-validation">
    <header className="proof-hero">
      <span className="eyebrow">REAL-WORLD WORK</span>
      <h1>{publicEvidence.headline}</h1>
      <p>{publicEvidence.intro}</p>
      <div className="proof-actions">
        <a className="primary" href={publicEvidence.primaryActionHref}>{publicEvidence.primaryAction}</a>
        <a className="secondary" href="#how-we-work">How we work</a>
      </div>
    </header>

    <section className="proof-cards" aria-label="Real-world validation">
      {publicEvidence.items.map((item) => {
        const external = item.href.startsWith('http');
        return <a key={item.id} className="proof-card" href={item.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
          <div className="proof-card-topline"><span>{item.area}</span><b>{item.state}</b></div>
          <h2>{item.name}</h2>
          <p>{item.summary}</p>
          <small>View work →</small>
        </a>;
      })}
    </section>

    <section className="proof-process" id="how-we-work" aria-labelledby="proof-process-title">
      <div className="proof-section-heading">
        <span className="eyebrow">HOW WE WORK</span>
        <h2 id="proof-process-title">Build. Test. Scale.</h2>
        <p>The method stays consistent even when the industry changes.</p>
      </div>
      <div className="proof-process-grid">
        {process.map(([index, title, description]) => <article key={title}>
          <span>{index}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>)}
      </div>
    </section>

    <section className="proof-context" aria-labelledby="proof-context-title">
      <div>
        <span className="eyebrow">WHY THIS MATTERS</span>
        <h2 id="proof-context-title">Built for South African constraints.</h2>
        <p>We design around the economic and infrastructure conditions people actually experience.</p>
      </div>
      <div className="proof-stat-row">
        {contextStats.map(([value, label, period]) => <article key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
          <small>{period}</small>
        </article>)}
      </div>
      <small className="proof-source-note">Stats SA figures are shown by their original reporting periods rather than blended into a synthetic headline.</small>
    </section>

    <details className="proof-technical">
      <summary>Technical proof</summary>
      <div className="proof-technical-body">
        <p>{publicEvidence.technical.rule}</p>
        <div>
          <a href={publicEvidence.technical.source} target="_blank" rel="noreferrer">Governance source ↗</a>
          <a href={publicEvidence.technical.runtime} target="_blank" rel="noreferrer">Runtime source ↗</a>
          <a href={publicEvidence.technical.detailsHref}>Detailed proof →</a>
        </div>
      </div>
    </details>
  </section>;
}
