import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type View = 'home' | 'labs' | 'systems' | 'cars4mars' | 'proof';

const experiments = [
  ['Gig Matcher', 'Jobs + income', 'Match people to verified local work and apprenticeship paths.'],
  ['Youth Opportunity Finder', 'Education + youth', 'Find bursaries, programmes, communities and real next steps.'],
  ['SA Language Engine', 'Language access', 'Design interfaces that work across South Africa\'s language reality.'],
  ['SME Assistant', 'Small business', 'Practical operating help for informal and growing businesses.'],
  ['Kopano Forge', 'Collaborative execution', 'Move from idea to tasks, artifacts, review and proof.'],
  ['Kopano Code', 'Build + learn', 'Coding acceleration with craft learning and visible reasoning boundaries.'],
];

const systems = [
  ['Kopano Context', 'Multi-agent orchestration', 'The orchestration and audit layer behind the ecosystem.'],
  ['CrisisConnect', 'Field intelligence', 'Mobile-first crisis reporting and GPS-anchored lived telemetry.'],
  ['FiveS Arena', 'Community infrastructure', 'Football booking, competition and local participation systems.'],
  ['Starfall Salvage', 'Interactive systems lab', 'Games as a test bench for interfaces, telemetry and governance.'],
];

const proof = [
  ['PUBLIC SOURCE', 'Dedicated website repository established', 'RobynAwesome/Kopano-Labs-Website'],
  ['SOURCE AUTHORITY', 'Kopano Studio + Schematics lineage preserved', 'Kopano-Labs/Introduction-to-MCP'],
  ['OPERATING PRINCIPLE', 'No claims without evidence', 'Audit twice. Show the artifact.'],
  ['BUILD MODEL', 'Public work moves through visible states', 'idea → experiment → proof → production'],
];

const routeByView: Record<View, string> = {
  home: '/',
  labs: '/labs/',
  systems: '/systems/',
  cars4mars: '/Cars4Mars/',
  proof: '/proof/',
};

function viewFromPath(pathname: string): View {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (path === '/labs') return 'labs';
  if (path === '/systems') return 'systems';
  if (path === '/cars4mars') return 'cars4mars';
  if (path === '/proof') return 'proof';
  return 'home';
}

function NavButton({ id, active, onClick, children }: { id: View; active: View; onClick: (id: View) => void; children: React.ReactNode }) {
  return <button className={`nav-button ${active === id ? 'active' : ''}`} onClick={() => onClick(id)}>{children}</button>;
}

export function App() {
  const initial = useMemo<View>(() => viewFromPath(location.pathname), []);
  const [view, setView] = useState<View>(initial);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const syncFromHistory = () => setView(viewFromPath(location.pathname));
    window.addEventListener('popstate', syncFromHistory);
    return () => window.removeEventListener('popstate', syncFromHistory);
  }, []);

  const navigate = (next: View) => {
    setView(next);
    const path = routeByView[next];
    if (location.pathname !== path) history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredExperiments = experiments.filter((item) => item.join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <header className="topbar">
        <button className="brand" onClick={() => navigate('home')}>
          <span className="brand-mark">K</span>
          <span><strong>Kopano Labs</strong><small>South African systems studio</small></span>
        </button>
        <nav>
          <NavButton id="labs" active={view} onClick={navigate}>Labs</NavButton>
          <NavButton id="systems" active={view} onClick={navigate}>Systems</NavButton>
          <NavButton id="cars4mars" active={view} onClick={navigate}>Cars4Mars</NavButton>
          <NavButton id="proof" active={view} onClick={navigate}>Proof</NavButton>
        </nav>
        <a className="source-pill" href="https://github.com/RobynAwesome/Kopano-Labs-Website" target="_blank" rel="noreferrer">Source ↗</a>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && <motion.section key="home" className="page home" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="eyebrow">SOVEREIGN SYSTEMS · BUILT IN SOUTH AFRICA</span>
                <h1>Not a portfolio.<br/><em>A working lab.</em></h1>
                <p>Kopano Labs turns lived problems into experiments, systems and public proof. We build for weak networks, real communities, hardware constraints and the realities that polished demos usually hide.</p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => navigate('labs')}>Open the lab</button>
                  <button className="secondary" onClick={() => navigate('proof')}>Inspect the proof</button>
                </div>
              </div>
              <div className="command-card">
                <div className="command-tabs"><span className="active">Observe</span><span>Build</span><span>Verify</span></div>
                <div className="command-body">
                  <span className="eyebrow">KOPANO WORKSPACE</span>
                  <h2>What are we proving today?</h2>
                  <div className="prompt-box"><span>›</span><p>Turn a lived South African problem into a testable system.</p></div>
                  <div className="command-stats"><span><b>01</b> Reality</span><span><b>02</b> Experiment</span><span><b>03</b> Evidence</span><span><b>04</b> Production</span></div>
                </div>
              </div>
            </div>
            <section className="manifesto-band">
              <span>BUILD</span><i>→</i><span>TEST</span><i>→</i><span>PROVE</span><i>→</i><span>PRESERVE</span>
            </section>
            <section className="split-section">
              <div><span className="eyebrow">WHY THIS EXISTS</span><h2>Software should survive contact with reality.</h2></div>
              <p>Our standard is not whether an interface looks convincing. It is whether the thing can be understood, used, audited and improved by the people it is supposed to serve.</p>
            </section>
          </motion.section>}

          {view === 'labs' && <motion.section key="labs" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="page-head"><span className="eyebrow">KOPANO LABS</span><h1>Experiments with a path to impact.</h1><p>The April 2026 Labs strategy called for a Google-Labs-style gallery: clear experiments, fast iteration, and a visible graduation path into real products. This is that surface.</p></div>
            <div className="search-row"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search experiments, problems or capabilities…"/><span>{filteredExperiments.length} experiments</span></div>
            <div className="card-grid">{filteredExperiments.map(([name, category, desc], i) => <article className="system-card" key={name}><span className="index">0{i+1}</span><span className="eyebrow">{category}</span><h3>{name}</h3><p>{desc}</p><button>Open experiment ↗</button></article>)}</div>
          </motion.section>}

          {view === 'systems' && <motion.section key="systems" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="page-head"><span className="eyebrow">SYSTEMS</span><h1>The lab graduates into systems.</h1><p>These are not theme cards. Each system is a separate operational surface with its own evidence, constraints and lifecycle.</p></div>
            <div className="systems-list">{systems.map(([name, category, desc], i) => <article key={name}><span className="number">0{i+1}</span><div><span className="eyebrow">{category}</span><h2>{name}</h2><p>{desc}</p></div><span className="arrow">↗</span></article>)}</div>
          </motion.section>}

          {view === 'cars4mars' && <motion.section key="cars" className="page mars-page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="mars-hero"><div><span className="eyebrow">CARS4MARS · 2026</span><h1>From Cape Town<br/>to Mars.</h1><p>A rover programme treated as an engineering evidence chain, not concept art. Design claims stay separate from physical proof.</p><div className="hero-actions"><a className="primary" href="/reports/KOPANO_LABS.pdf">Final Design Report</a><button className="secondary" onClick={() => navigate('proof')}>Build ledger</button></div></div><div className="mars-orbit"><div className="planet"/><span>BUILD STATE<br/><b>DESIGN → PHYSICAL VALIDATION</b></span></div></div>
            <div className="evidence-grid"><article><span className="eyebrow">01 · DESIGN</span><h3>Architecture defined</h3><p>Rover geometry, power, communications, compute and bounded intelligence remain explicit design representations until built.</p></article><article><span className="eyebrow">02 · BUILD</span><h3>Procure + assemble</h3><p>Parts, frame, drivetrain and protected power move the programme from representation into physical evidence.</p></article><article><span className="eyebrow">03 · TEST</span><h3>Break it in public</h3><p>Failures, field footage, telemetry and corrections belong in the ledger rather than being hidden behind campaign polish.</p></article></div>
          </motion.section>}

          {view === 'proof' && <motion.section key="proof" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="page-head"><span className="eyebrow">PUBLIC PROOF</span><h1>Show the lineage. Show the state.</h1><p>Kopano Labs should make it difficult to confuse aspiration with evidence. Every important claim needs a source, state or artifact.</p></div>
            <div className="ledger">{proof.map(([kind,title,artifact]) => <article key={title}><span className="status-dot"/><div><span className="eyebrow">{kind}</span><h3>{title}</h3></div><code>{artifact}</code></article>)}</div>
            <div className="source-callout"><div><span className="eyebrow">SOURCE AUTHORITY</span><h2>Introduction-to-MCP is the archive. This repo is the website.</h2></div><p>Strategy, Studio concepts and historical implementation lineage are preserved from the organization repository. Production website work now has one dedicated home.</p></div>
          </motion.section>}
        </AnimatePresence>
      </main>

      <footer><span>Kopano Labs · Cape Town, South Africa</span><span>Reality → Experiment → Proof → Production</span></footer>
    </div>
  );
}
