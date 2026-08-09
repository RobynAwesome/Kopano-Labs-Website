import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import './adaptive.css';
import { Cars4MarsMissionControl } from './components/Cars4MarsMissionControl';
import { KopanoScene } from './components/KopanoScene';
import { SpatialDirectory } from './components/SpatialDirectory';
import { canonicalForView, pathForView, routeForIntent, routeForView, type View, viewForPath } from './routeRegistry';

const experiments: [string, string, string][] = [
  ['Gig Matcher', 'Jobs + income', 'Match people to verified local work and apprenticeship paths.'],
  ['Youth Opportunity Finder', 'Education + youth', 'Find bursaries, programmes, communities and real next steps.'],
  ['SA Language Engine', 'Language access', 'Design interfaces that work across South Africa\'s language reality.'],
  ['SME Assistant', 'Small business', 'Practical operating help for informal and growing businesses.'],
  ['Kopano Forge', 'Collaborative execution', 'Move from idea to tasks, artifacts, review and proof.'],
  ['Kopano Code', 'Build + learn', 'Coding acceleration with craft learning and visible reasoning boundaries.'],
];

const systems: [string, string, string][] = [
  ['Kopano Context', 'Multi-agent orchestration', 'The orchestration and audit layer behind the ecosystem.'],
  ['CrisisConnect', 'Field intelligence', 'Mobile-first crisis reporting and GPS-anchored lived telemetry.'],
  ['FiveS Arena', 'Community infrastructure', 'Football booking, competition and local participation systems.'],
  ['Starfall Salvage', 'Interactive systems lab', 'Games as a test bench for interfaces, telemetry and governance.'],
];

const proof = [
  ['FOUNDER AUTHORITY', 'Kholofelo Robyn Rababalela', 'Founder · Sovereign System Engineer · final public-system decision authority'],
  ['DEPLOYMENT PROVENANCE', 'Observed in current Vercel metadata', 'RobynAwesome/Kopano-Labs-Website · not canonical source authority'],
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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <header className="topbar">
        <button className="brand" onClick={() => navigate('home')}>
          <span className="brand-mark"><img src="/assets/brand/kopano-mark.svg" alt="" /></span>
          <span><strong>Kopano Labs</strong><small>South African systems studio</small></span>
        </button>
        <nav aria-label="Primary">
          <NavButton id="labs" active={view} onClick={navigate}>Labs</NavButton>
          <NavButton id="systems" active={view} onClick={navigate}>Systems</NavButton>
          <NavButton id="cars4mars" active={view} onClick={navigate}>Cars4Mars</NavButton>
          <NavButton id="proof" active={view} onClick={navigate}>Proof</NavButton>
        </nav>
        <a className="source-pill" href="https://github.com/RobynAwesome/Kopano-Labs-Website" target="_blank" rel="noreferrer">Deployment source ↗</a>
      </header>

      <main id="main-content">
        <AnimatePresence mode="wait">
          {view === 'home' && <motion.section key="home" className="page home" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="hero-grid spatial-hero">
              <motion.div className="hero-copy" initial={{opacity:0,x:-70,filter:'blur(8px)'}} animate={{opacity:1,x:0,filter:'blur(0px)'}} transition={{duration:.9,ease:[.23,1,.32,1]}}>
                <span className="eyebrow">SOVEREIGN SYSTEMS · BUILT IN SOUTH AFRICA</span>
                <h1>Not a portfolio.<br/><em>A living system.</em></h1>
                <p>Kopano Labs turns lived problems into experiments, systems and public proof. Context, evidence and systems orbit one another instead of sitting inside dead cards.</p>
                <div className="hero-actions"><button className="primary" onClick={() => navigate('cars4mars')}>Enter Cars4Mars</button><button className="secondary" onClick={() => navigate('labs')}>Open the lab</button></div>
              </motion.div>
              <motion.div className="spatial-stage" initial={{opacity:0,scale:.92,rotateY:12}} animate={{opacity:1,scale:1,rotateY:0}} transition={{duration:1.1,ease:[.23,1,.32,1]}}>
                <KopanoScene />
                <div className="command-card adaptive-command spatial-panel">
                  <div className="command-tabs"><span className="active">Need</span><span>Route</span><span>Verify</span></div>
                  <div className="command-body"><span className="eyebrow">ADAPTIVE ENTRY</span><h2>What do you want?</h2><form className="intent-form" onSubmit={resolveIntent}><input value={intent} onChange={(event) => setIntent(event.target.value)} placeholder="Mars rover, jobs, systems, proof…" aria-label="What are you looking for?" /><button type="submit">Route me →</button></form></div>
                </div>
              </motion.div>
            </div>
            <section className="manifesto-band"><span>IMAGINE</span><i>→</i><span>BUILD</span><i>→</i><span>PROVE</span><i>→</i><span>PRESERVE</span></section>
            <section className="split-section adaptive-story"><div><span className="eyebrow">ADAPTIVE BY DESIGN</span><h2>One system. Different depths.</h2><img src="/assets/diagrams/agent-routing.svg" alt="User intent routes through an agent toward databases, APIs and documents" /></div><p>People should not receive the same wall of information. Crawlers, judges, builders, clients and curious visitors enter through different intentions while one route and evidence registry keeps the system coherent.</p></section>
          </motion.section>}

          {view === 'labs' && <motion.section key="labs" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="page-head"><span className="eyebrow">KOPANO LABS</span><h1>Experiments with a path to impact.</h1><p>Search by problem or capability, then enter one context instead of reading a catalogue wall.</p></div><div className="search-row"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search experiments, problems or capabilities…"/><span>{filteredExperiments.length} experiments</span></div><SpatialDirectory items={filteredExperiments} kind="experiment" emptyLabel="No experiment matches that intent yet." /></motion.section>}

          {view === 'systems' && <motion.section key="systems" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="page-head"><span className="eyebrow">SYSTEMS</span><h1>The lab graduates into systems.</h1><p>Each operational surface has its own context, evidence, constraints and lifecycle.</p></div><SpatialDirectory items={systems} kind="system" /></motion.section>}

          {view === 'cars4mars' && <motion.section key="cars" className="page mars-page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="mars-hero spatial-mars"><div><span className="eyebrow">CARS4MARS · PRIMARY EVIDENCE ROUTE</span><h1>From Cape Town<br/>to Mars.</h1><p>A rover programme treated as an engineering evidence chain, not concept art. Design, procurement, assembly and field validation remain visibly separate states.</p><div className="hero-actions"><a className="primary" href="#mission-control">Mission control</a><button className="secondary" onClick={() => navigate('proof')}>Public proof</button></div></div><div className="spatial-stage mars-stage"><KopanoScene /><img className="mars-campaign-figure" src="/assets/cars4mars/astronaut-campaign.svg" alt="Cars4Mars campaign concept artwork, not physical rover evidence" /><div className="mission-chip"><span>MISSION STATE</span><b>DESIGN → PHYSICAL VALIDATION</b></div></div></div>
            <div id="mission-control"><Cars4MarsMissionControl /></div>
          </motion.section>}

          {view === 'proof' && <motion.section key="proof" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="page-head"><span className="eyebrow">PUBLIC PROOF</span><h1>Show the lineage. Show the state.</h1><p>Every important claim needs a source, state or artifact — including who owns the final public-system decision.</p></div><div className="ledger">{proof.map(([kind,title,artifact]) => <article key={title}><span className="status-dot"/><div><span className="eyebrow">{kind}</span><h3>{title}</h3></div><code>{artifact}</code></article>)}</div><div className="source-callout"><div><span className="eyebrow">DISCOVERY WORKFLOW</span><h2>Route manifest → humans + sitemap + robots + CI.</h2></div><p>The website owns one public discovery map. Crawlers receive XML/TXT guidance; humans receive the adaptive interface; CI verifies they remain synchronized.</p></div></motion.section>}
        </AnimatePresence>
      </main>

      <footer><span>Kopano Labs · Cape Town, South Africa</span><span>Founder: Kholofelo Robyn Rababalela · Intent → Route → Evidence → Production</span></footer>
    </div>
  );
}
