type Signal = 'yes' | 'partial' | 'no' | 'target';

type Product = {
  name: string;
  route: string;
  works: Signal;
  visible: Signal;
  backing: Signal;
  current: Signal;
  connected: Signal;
  backingLabel: string;
};

const products: Product[] = [
  { name: 'FiveS Arena', route: 'https://fivesarena.com', works: 'yes', visible: 'yes', backing: 'yes', current: 'yes', connected: 'yes', backingLabel: 'Hellenic FC venue + operating environment' },
  { name: 'KasiLink', route: 'https://kasilink.com', works: 'partial', visible: 'yes', backing: 'target', current: 'partial', connected: 'partial', backingLabel: 'Government backing target' },
  { name: 'Cape Campus', route: '#', works: 'partial', visible: 'partial', backing: 'target', current: 'partial', connected: 'target', backingLabel: 'Tourism backing target' },
  { name: 'Starfall Salvage', route: 'https://starfallsalvage.kopanolabs.com', works: 'partial', visible: 'yes', backing: 'no', current: 'partial', connected: 'yes', backingLabel: 'Operations rework before investor push' },
  { name: 'Cars4Mars', route: '/Cars4Mars/', works: 'partial', visible: 'yes', backing: 'partial', current: 'yes', connected: 'yes', backingLabel: 'Competition programme + physical build phase' },
];

const realityStats = [
  ['33.6%', 'South Africa official unemployment', 'Q2 2026 · Stats SA QLFS'],
  ['60.9%', 'Unemployment · ages 15–24', 'Q1 2026 · Stats SA youth labour market'],
  ['40.6%', 'Unemployment · ages 25–34', 'Q1 2026 · Stats SA youth labour market'],
] as const;

const fieldReceipts = [
  {
    state: 'VALIDATED · LIVE',
    name: "Five's Arena × Hellenic FC",
    kind: 'Client / venue operating system',
    detail: 'A public football operating environment at Hellenic Football Club in Milnerton: court booking, competitions, fixtures, tournament flows, manager surfaces and customer-facing routes. Kopano Labs founder Kholofelo Robyn Rababalela is publicly identified as Lead Developer.',
    evidence: 'External venue + public users + live transactional/competition surfaces.',
    href: 'https://fivesarena.com',
  },
  {
    state: 'VALIDATED · FIELD',
    name: 'North West · 10-acre lucerne / alfalfa farm',
    kind: 'Field client / operational decision support',
    detail: 'Farm-specific operating work covering frost windows, lucerne regrowth, irrigation assets, pumps, pivots, valves, livestock cold stress and water-security planning. AMBER/RED thresholds turn weather and field observations into concrete actions.',
    evidence: 'Named farmer workflow + sendable alerts + field checklist + escalation thresholds.',
    href: '#convergence-runtime',
  },
  {
    state: 'DELIVERED · EXTERNAL',
    name: 'Flow Inc Ink',
    kind: 'Completed external digital project',
    detail: 'Delivered digital work for an operating tattoo and piercing business in Midrand. This belongs in the evidence graph as client delivery, not as an internal Kopano product concept.',
    evidence: 'External operating business + completed project delivery.',
    href: '#convergence-runtime',
  },
  {
    state: 'ACTIVE · BOUNDED',
    name: 'UCT PhD development engagement',
    kind: 'Academic / hands-on development engagement',
    detail: 'Active hands-on development work associated with a UCT PhD candidate. It is visible here as an engagement, but it is not promoted to a validated client receipt until delivery or commercial evidence exists.',
    evidence: 'Governed as active engagement; client claim remains MAYBE.',
    href: '#convergence-runtime',
  },
] as const;

const convergence = [
  ['MCP', 'Tool + context connection', 'Connects models and agents to tools, data and enterprise surfaces.'],
  ['MMAO', 'Multi-Mobile Agent Orchestration', 'Coordinates independent AI systems across mobile, local and cloud workflows instead of treating one model as the whole system.'],
  ['KC / KPGS', 'Governance + orchestration plane', 'Routes capability, permissions, escalation and evidence. Models are renters; governance remains sovereign.'],
  ['GSMB / KPSMB', 'Persistent state lineage', 'Carries grounded memory, context and provenance so execution can remain persistent and consistent without persisting a bad root.'],
  ['CCP', 'Conceptual Convergence Protocol', 'Competing model outputs converge only when the shared concept survives evidence, contradiction and governance checks.'],
  ['POC RECEIPT', 'Canonical proof', 'The result becomes claimable only when the artifact, state transition or real-world outcome can be inspected.'],
] as const;

const renterFamilies = [
  'Google · Gemini · AI Studio · ADK · Gemma',
  'OpenAI · ChatGPT · Codex',
  'Microsoft · Copilot · Azure',
  'AWS · Hugging Face',
  'Qwen',
  'Mistral / Ministral',
  'Perplexity · Cursor · Anti-Gravity',
] as const;

const score = (value: Signal) => value === 'yes' ? 2 : value === 'partial' ? 1 : 0;

function classify(product: Product) {
  const evidence = score(product.works) + score(product.visible) + score(product.backing) + score(product.current) + score(product.connected);
  if (product.backing === 'yes' && product.works === 'yes' && product.visible === 'yes') return ['BACKED', 'validated'];
  if (product.works === 'partial' && product.current === 'partial') return ['REWORK', 'warning'];
  if (product.backing === 'target') return ['NEEDS BACKING', 'target'];
  if (evidence <= 2) return ['FOC RISK', 'risk'];
  return ['BUILDING', 'building'];
}

const reviewContract = [
  ['01', 'WORKS', 'A person or operator can complete a meaningful first move.'],
  ['02', 'VISIBLE', 'The public or client can inspect the current state and artifact.'],
  ['03', 'BACKED', 'An owner, external environment, source or next physical gate is named.'],
] as const;

export function FOCMatrix() {
  return <section className="foc-surface">
    <div className="foc-head">
      <span className="eyebrow">FOC · EVIDENCE GATE</span>
      <h1>Reality first.<br/><em>Then the index.</em></h1>
      <p>Search visibility is an observer, not the authority. Kopano Labs governs claims from real operating receipts: client delivery, field decisions, public systems, institutional work and physical validation.</p>
    </div>

    <div className="reality-stat-grid" aria-label="South African unemployment context">
      {realityStats.map(([value, label, source]) => <article key={label}><strong>{value}</strong><span>{label}</span><small>{source}</small></article>)}
    </div>
    <p className="reality-stat-note">The national Q2 2026 rate and the youth age-band figures use different Stats SA reporting periods. They are shown separately rather than blended into a synthetic headline.</p>

    <section className="field-validation" id="field-validation" aria-labelledby="field-validation-title">
      <div className="field-validation-head">
        <div><span className="eyebrow">REAL-WORLD VALIDATION LEDGER</span><h2 id="field-validation-title">What has survived outside our own ecosystem?</h2></div>
        <p>A concept does not become proof because Kopano Labs can render it. External operators, users, constraints and deliverables create the receipt.</p>
      </div>
      <div className="field-receipt-grid">
        {fieldReceipts.map((receipt) => <a key={receipt.name} className="field-receipt" href={receipt.href} target={receipt.href.startsWith('http') ? '_blank' : undefined} rel={receipt.href.startsWith('http') ? 'noreferrer' : undefined}>
          <span>{receipt.state}</span>
          <small>{receipt.kind}</small>
          <h3>{receipt.name}</h3>
          <p>{receipt.detail}</p>
          <b>{receipt.evidence}</b>
        </a>)}
      </div>
    </section>

    <section className="convergence-runtime" id="convergence-runtime" aria-labelledby="convergence-runtime-title">
      <div className="field-validation-head">
        <div><span className="eyebrow">FROM MCP TO GOVERNED CONVERGENCE</span><h2 id="convergence-runtime-title">Why one founder can operate across different client domains.</h2></div>
        <p>The operating advantage is not one favourite model. It is the governed ability to rent different capabilities, preserve state and converge them into one inspectable decision.</p>
      </div>
      <div className="convergence-chain">
        {convergence.map(([name, label, detail], index) => <article key={name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><small>{label}</small><p>{detail}</p></article>)}
      </div>
      <div className="renter-families" aria-label="AI and cloud capability families used in the orchestration ecosystem">
        {renterFamilies.map((family) => <span key={family}>{family}</span>)}
      </div>
      <p className="convergence-law"><strong>Operating law:</strong> the operator is the source of context; the governed system is the execution layer; the receipt is the proof. Claims remain MAYBE until reality validates the POC.</p>
    </section>

    <div className="foc-contract-strip" aria-label="FOC review contract">
      {reviewContract.map(([index, label, detail]) => <article key={label}><span>{index}</span><strong>{label}</strong><p>{detail}</p></article>)}
    </div>

    <div className="foc-matrix" role="table" aria-label="Kopano Labs evidence gate matrix">
      <div className="foc-row foc-row-head" role="row"><b>PRODUCT</b><b>WORKS</b><b>VISIBLE</b><b>BACKING</b><b>CURRENT</b><b>CONNECTED</b><b>STATE</b></div>
      {products.map((product) => {
        const [state, tone] = classify(product);
        return <a key={product.name} className={'foc-row ' + tone} href={product.route} target={product.route.startsWith('http') ? '_blank' : undefined} rel={product.route.startsWith('http') ? 'noreferrer' : undefined} role="row">
          <div><strong>{product.name}</strong><small>{product.backingLabel}</small></div>
          <i data-signal={product.works}>{product.works}</i>
          <i data-signal={product.visible}>{product.visible}</i>
          <i data-signal={product.backing}>{product.backing}</i>
          <i data-signal={product.current}>{product.current}</i>
          <i data-signal={product.connected}>{product.connected}</i>
          <span>{state}</span>
        </a>;
      })}
    </div>
  </section>;
}
