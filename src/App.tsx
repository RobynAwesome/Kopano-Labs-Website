import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import './adaptive.css';
import { canonicalForView, pathForView, publicRoutes, routeForIntent, routeForView, type View, viewForPath } from './routeRegistry';

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

function NavButton({ id, active, onClick, children }: { id: View; active: View; onClick: (id: View) => void; children: React.ReactNode }) {
  return <button className={`nav-button ${active === id ? 'active' : ''}`} onClick={() => onClick(id)}>{children}</button>;
}

function setMeta(selector: string, attribute: 'content' | 'href', value: string) {
  const node = document.querySelector(selector);
  if (node) node.setAttribute(attribute, value);
}

export function App() {
  const initial = useMemo<View>(() => viewForPath(location.pathname), []);
  const [view, setView] = useState<View>(initial);
  const [query, setQuery] = useState('');
  const [intent, setIntent] = useState('');

  useEffect(() => {
    const syncFromHistory = () => setView(viewForPath(location.pathname));
    window.addEventListener('popstate', syncFromHistory);
    return () => window.removeEventListener('popstate', syncFromHistory);
  }, []);

  useEffect(() => {
    const route = routeForView(view);
    const canonical = canonicalForView(view);
    document.title = route.title;
    setMeta('meta[name="description"]', 'content', route.description);
    setMeta('link[rel="canonical"]', 'href', canonical);
    setMeta('meta[property="og:title"]', 'content', route.title);
    setMeta('meta[property="og:description"]', 'content', route.description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[name="twitter:title"]', 'content', route.title);
    setMeta('meta[name="twitter:description"]', 'content', route.description);
  }, [view]);

  const navigate = (next: View) => {
    setView(next);
    const path = pathForView(next);
    if (location.pathname !== path) history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolveIntent = (event: FormEvent) => {
    event.preventDefault();
    const match = routeForIntent(intent || 'explore');
    navigate(match.id);
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
                  <button className="primary" onClick={() => navigate('cars4mars')}>Cars4Mars evidence</button>
                  <button className="secondary" onClick={() => navigate('labs')}>Open the lab</button>
                </div>
              </div>
              <div className="command-card adaptive-command">
                <div className="command-tabs"><span className="active">Need</span><span>Route</span><span>Verify</span></div>
                <div className="command-body">
                  <span className="eyebrow">ADAPTIVE ENTRY</span>
                  <h2>What do you want?</h2>
                  <form className="intent-form" onSubmit={resolveIntent}>
                    <input value={intent} onChange={(event) => setIntent(event.target.value)} placeholder="Mars rover, jobs, systems, proof, experiments…" aria-label="What are you looking for?" />
                    <button type="submit">Take me there →</button>
                  </form>
                  <div className="intent-shortcuts">
                    {publicRoutes.filter((route) => route.id !== 'home').map((route) => (
                      <button key={route.id} onClick={() => navigate(route.id)}>
                        <span>{route.humanPrompt}</span><b>↗</b>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <section className="manifesto-band">
              <span>ASK</span><i>→</i><span>ROUTE</span><i>→</i><span>PROVE</span><i>→</i><span>PRESERVE</span>
            </section>
            <section className="split-section">
              <div><span className="eyebrow">ADAPTIVE BY DESIGN</span><h2>One route registry guides crawlers and humans.</h2></div>
              <p>The same public route manifest drives browser navigation, the adaptive entry surface, sitemap generation and robots policy. Change the map once; every discovery layer follows.</p>
            </section>
          </motion.section>}

          {view === 'labs' && <motion.section key="labs" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="page-head"><span className="eyebrow">KOPANO LABS</span><h1>Experiments with a path to impact.</h1><p>The Labs surface stays focused: find the experiment you need, understand what it does, then enter only that context.</p></div>
            <div className="search-row"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search experiments, problems or capabilities…"/><span>{filteredExperiments.length} experiments</span></div>
            <div className="card-grid">{filteredExperiments.map(([name, category, desc], i) => <article className="system-card" key={name}><span className="index">0{i+1}</span><span className="eyebrow">{category}</span><h3>{name}</h3><p>{desc}</p><button>Open experiment ↗</button></article>)}</div>
          </motion.section>}

          {view === 'systems' && <motion.section key="systems" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="page-head"><span className="eyebrow">SYSTEMS</span><h1>The lab graduates into systems.</h1><p>Each system is a separate operational surface with its own evidence, constraints and lifecycle.</p></div>
            <div className="systems-list">{systems.map(([name, category, desc], i) => <article key={name}><span className="number">0{i+1}</span><div><span className="eyebrow">{category}</span><h2>{name}</h2><p>{desc}</p></div><span className="arrow">↗</span></article>)}</div>
          </motion.section>}

          {view === 'cars4mars' && <motion.section key="cars" className="page mars-page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="mars-hero"><div><span className="eyebrow">CARS4MARS · PRIMARY EVIDENCE ROUTE</span><h1>From Cape Town<br/>to Mars.</h1><p>A rover programme treated as an engineering evidence chain, not concept art. This is the first discovery route in the generated public sitemap.</p><div className="hero-actions"><a className="primary" href="/reports/KOPANO_LABS.pdf">Final Design Report</a><button className="secondary" onClick={() => navigate('proof')}>Build ledger</button></div></div><div className="mars-orbit"><div className="planet"/><span>BUILD STATE<br/><b>DESIGN → PHYSICAL VALIDATION</b></span></div></div>
            <div className="evidence-grid"><article><span className="eyebrow">01 · DESIGN</span><h3>Architecture defined</h3><p>Rover geometry, power, communications, compute and bounded intelligence remain explicit design representations until built.</p></article><article><span className="eyebrow">02 · BUILD</span><h3>Procure + assemble</h3><p>Parts, frame, drivetrain and protected power move the programme from representation into physical evidence.</p></article><article><span className="eyebrow">03 · TEST</span><h3>Break it in public</h3><p>Failures, field footage, telemetry and corrections belong in the ledger rather than being hidden behind campaign polish.</p></article></div>
          </motion.section>}

          {view === 'proof' && <motion.section key="proof" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="page-head"><span className="eyebrow">PUBLIC PROOF</span><h1>Show the lineage. Show the state.</h1><p>Kopano Labs should make it difficult to confuse aspiration with evidence. Every important claim needs a source, state or artifact.</p></div>
            <div className="ledger">{proof.map(([kind,title,artifact]) => <article key={title}><span className="status-dot"/><div><span className="eyebrow">{kind}</span><h3>{title}</h3></div><code>{artifact}</code></article>)}</div>
            <div className="source-callout"><div><span className="eyebrow">DISCOVERY WORKFLOW</span><h2>Route manifest → humans + sitemap + robots + CI.</h2></div><p>The website source owns one public discovery map. Crawlers receive the XML/TXT representation; humans receive the adaptive interface; CI checks that they remain consistent.</p></div>
          </motion.section>}
        </AnimatePresence>
      </main>

      <footer><span>Kopano Labs · Cape Town, South Africa</span><span>Intent → Route → Evidence → Production</span></footer>
    </div>
  );
}
