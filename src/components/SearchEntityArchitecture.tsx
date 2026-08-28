import '../sea.css';

const gates = [
  ['01', 'Discover', 'Can search and AI systems find the public evidence?'],
  ['02', 'Identify', 'Is it clear who or what the entity actually is?'],
  ['03', 'Disambiguate', 'Can the entity be separated from namesakes and connected to legitimate aliases?'],
  ['04', 'Relate', 'Are people, companies, products, places, profiles and works connected truthfully?'],
  ['05', 'Retrieve', 'Do real questions surface the right entity and the right supporting evidence?'],
  ['06', 'Validate', 'Are the resulting interpretations correct, supported, current and repeatable?'],
] as const;

const audiences = [
  ['People', 'One person. Many profiles. One public identity to govern.'],
  ['SMEs', 'Be the business AI can identify.'],
  ['B2B', 'Reduce ambiguity across brands, people, products, domains and public sources.'],
  ['Institutions', 'Make institutional knowledge discoverable, attributable and retrievable.'],
  ['Developers', 'Engineer the evidence layer between entities and retrieval.'],
  ['Researchers', 'Measure what generative systems retrieve, cite, absorb and misinterpret.'],
] as const;

const deliverables = [
  'SEA Entity State Audit',
  'Canonical Entity Record',
  'Public Entity Graph',
  'Search / AI Retrieval Matrix',
  'Prioritized Remediation Plan',
  'Post-change Validation Report',
] as const;

export function SEAHomeStrip() {
  return (
    <section className="sea-home-strip" aria-labelledby="sea-home-title">
      <div className="sea-home-copy">
        <span className="eyebrow">KOPANO LABS · SEARCH ENTITY ARCHITECTURE · SEA</span>
        <h2 id="sea-home-title">What does AI think of you?</h2>
        <p className="sea-home-lead">Make your company machine-understandable.</p>
        <p>Your website can be online, indexed and still be misunderstood. SEA engineers and validates the public evidence that helps search engines and AI systems discover, distinguish, understand, retrieve and verify you.</p>
        <div className="hero-actions">
          <a className="primary" href="/SEA/">See Search Entity Architecture</a>
          <a className="secondary" href="https://github.com/RobynAwesome/Search-Entity-Architecture" target="_blank" rel="noreferrer">Open methodology ↗</a>
        </div>
      </div>
      <div className="sea-home-proof" aria-label="SEA validation path">
        <span>FROM INDEXED TO UNDERSTOOD</span>
        <ol>
          {gates.map(([number, title]) => <li key={title}><b>{number}</b><strong>{title}</strong></li>)}
        </ol>
      </div>
    </section>
  );
}

export function SearchEntityArchitecture() {
  return (
    <div className="sea-page">
      <section className="sea-hero">
        <div className="sea-hero-copy">
          <span className="eyebrow">KOPANO LABS · SEARCH ENTITY ARCHITECTURE · SEA</span>
          <h1>What does AI<br/><em>think of you?</em></h1>
          <p className="sea-kicker">Make your company machine-understandable.</p>
          <p>We help people, businesses and institutions become easier for search engines and AI systems to discover, distinguish, understand, retrieve and verify.</p>
          <div className="hero-actions">
            <a className="primary" href="mailto:hello@kopanolabs.com?subject=SEA%20Entity%20State%20Audit">Audit my entity</a>
            <a className="secondary" href="#sea-method">See the method</a>
          </div>
        </div>
        <div className="sea-hero-graph" aria-label="Illustration of a public entity graph">
          <span className="sea-node sea-node-core">YOU</span>
          <span className="sea-node sea-node-a">Website</span>
          <span className="sea-node sea-node-b">Company</span>
          <span className="sea-node sea-node-c">Profiles</span>
          <span className="sea-node sea-node-d">Products</span>
          <span className="sea-node sea-node-e">People</span>
          <span className="sea-node sea-node-f">Evidence</span>
          <div className="sea-orbit sea-orbit-a"/><div className="sea-orbit sea-orbit-b"/><div className="sea-orbit sea-orbit-c"/>
        </div>
      </section>

      <section className="sea-problem">
        <span className="eyebrow">THE PROBLEM</span>
        <h2>Being indexed is not the same as being understood.</h2>
        <div className="sea-problem-grid">
          <p>Your website can exist. Your LinkedIn can exist. Your products, founders, locations and social profiles can all exist — while machines still merge the wrong names, miss the relationships, repeat stale information or retrieve weak evidence.</p>
          <p>When somebody asks an AI system about you, that machine may become the interface through which they meet your public identity. SEA treats that identity as infrastructure that can be audited, engineered and validated.</p>
        </div>
      </section>

      <section className="sea-method" id="sea-method">
        <div className="sea-section-head">
          <span className="eyebrow">THE SEA METHOD</span>
          <h2>From indexed to understood.</h2>
          <p>Six gates. Each gate produces evidence. No gate is declared complete because the previous one worked.</p>
        </div>
        <div className="sea-gates">
          {gates.map(([number, title, description]) => (
            <article key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sea-audiences">
        <div className="sea-section-head">
          <span className="eyebrow">WHO SEA IS FOR</span>
          <h2>One architecture. Different public identities.</h2>
        </div>
        <div className="sea-audience-grid">
          {audiences.map(([title, message]) => <article key={title}><span>{title}</span><p>{message}</p></article>)}
        </div>
      </section>

      <section className="sea-technical">
        <div>
          <span className="eyebrow">FOR DEVELOPERS · RESEARCHERS · INSTITUTIONS</span>
          <h2>Engineer the evidence layer between entities and retrieval.</h2>
        </div>
        <p>SEA converges technical SEO, entity resolution, structured identity, knowledge-graph readiness, public-source reconciliation and repeatable retrieval testing. We preserve the distinction between discoverability, source selection, answer influence and factual fidelity instead of reducing generative search to a ranking hack.</p>
      </section>

      <section className="sea-deliverables">
        <div className="sea-section-head">
          <span className="eyebrow">WHAT YOU GET</span>
          <h2>Public identity infrastructure with receipts.</h2>
        </div>
        <ul>{deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="sea-truth">
        <span className="eyebrow">TRUTH BOUNDARY</span>
        <h2>We don't control AI.<br/>We engineer the evidence it can find.</h2>
        <p>No provider can be forced to index, rank, cite or repeat a claim. SEA works on the controllable surface: clear technical structure, canonical identity, truthful relationships, useful public evidence and reproducible validation.</p>
        <div className="hero-actions">
          <a className="primary" href="mailto:hello@kopanolabs.com?subject=SEA%20Consultation">Talk to Kopano Labs</a>
          <a className="secondary" href="https://github.com/RobynAwesome/Search-Entity-Architecture" target="_blank" rel="noreferrer">Inspect the public method ↗</a>
        </div>
      </section>
    </div>
  );
}
