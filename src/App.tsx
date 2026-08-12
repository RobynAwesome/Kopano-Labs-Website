import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import './adaptive.css';
import { Cars4MarsMissionControl, type Cars4MarsFocus } from './components/Cars4MarsMissionControl';
import { FOCMatrix } from './components/FOCMatrix';
import { KopanoScene } from './components/KopanoScene';
import { RoverVisual } from './components/RoverVisual';
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

const now = [
  { id:'cars4mars', mark:'MARS', title:'Cars4Mars', state:'BUILD', detail:'Rover design submitted. Hardware build and physical validation next.', href:'/Cars4Mars/', tone:'mars' },
  { id:'fives', mark:'5S', title:'FiveS Arena', state:'BACKED', detail:'Community football infrastructure with Hellenic FC backing.', href:'https://fivesarena.com', tone:'green' },
  { id:'kasilink', mark:'KL', title:'KasiLink', state:'BACKING TARGET', detail:'Local opportunity and service routing. Government backing remains a target.', href:'https://kasilink.com', tone:'blue' },
  { id:'campus', mark:'CC', title:'Cape Campus', state:'BACKING TARGET', detail:'Tourism-facing discovery concept. Partnership validation is still in progress.', href:'#', tone:'gold' },
  { id:'starfall', mark:'SS', title:'Starfall Salvage', state:'REWORK', detail:'Playable systems lab. Product flow and operations are being reworked.', href:'https://starfallsalvage.kopanolabs.com', tone:'violet' },
] as const;

const proof = [
  ['FOUNDER AUTHORITY', 'Kholofelo Robyn Rababalela', 'Founder · Director · Sovereign System Engineer'],
  ['DEPLOYMENT PROVENANCE', 'Observed in current Vercel metadata', 'RobynAwesome/Kopano-Labs-Website · not canonical source authority'],
  ['SOURCE AUTHORITY', 'Kopano Studio + Schematics lineage preserved', 'Kopano-Labs/Introduction-to-MCP'],
  ['OPERATING PRINCIPLE', 'No claims without evidence', 'Audit twice. Show the artifact.'],
];

const isCars4MarsView = (view: View) => view === 'cars4mars' || view.startsWith('cars4mars-');

const focusForView = (view: View): Cars4MarsFocus => {
  if (view === 'cars4mars-ledger') return 'ledger';
  if (view === 'cars4mars-architecture') return 'architecture';
  if (view === 'cars4mars-media') return 'media';
  if (view === 'cars4mars-support') return 'support';
  return 'overview';
};

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
  const primaryView: View = isCars4MarsView(view) ? 'cars4mars' : view;

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
    navigate(routeForIntent(intent || 'explore').id);
  };

  const filteredExperiments = experiments.filter((item) => item.join(' ').toLowerCase().includes(query.toLowerCase()));

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <header className="topbar">
      <button className="brand" onClick={() => navigate('home')}><span className="brand-mark"><img src="/assets/brand/kopano-mark.svg" alt=""/></span><span><strong>Kopano Labs</strong><small>SOUTH AFRICAN SYSTEMS STUDIO</small></span></button>
      <nav aria-label="Primary">
        <NavButton id="home" active={primaryView} onClick={navigate}>Now</NavButton>
        <NavButton id="labs" active={primaryView} onClick={navigate}>Labs</NavButton>
        <NavButton id="cars4mars" active={primaryView} onClick={navigate}>Cars4Mars</NavButton>
        <NavButton id="foc" active={primaryView} onClick={navigate}>FOC</NavButton>
        <NavButton id="systems" active={primaryView} onClick={navigate}>Systems</NavButton>
        <NavButton id="proof" active={primaryView} onClick={navigate}>Proof</NavButton>
      </nav>
      <a className="source-pill" href="/release.json">Live state ↗</a>
    </header>

    <main id="main-content">
      <AnimatePresence mode="wait">
        {view === 'home' && <motion.section key="home" className="page home" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
          <div className="hero-grid spatial-hero now-hero">
            <motion.div className="hero-copy" initial={{opacity:0,x:-70,filter:'blur(8px)'}} animate={{opacity:1,x:0,filter:'blur(0px)'}} transition={{duration:.8,ease:[.23,1,.32,1]}}>
              <span className="eyebrow">KOPANO LABS · BUILT IN SOUTH AFRICA</span>
              <h1>Realism.<br/><em>Sovereignty. Proof.</em></h1>
              <p>Offline-first, proof-gated systems built to stay useful when the grid and the cloud do not.</p>
              <p className="studio-principle">Realism accommodates aesthetics; sovereignty accommodates both.</p>
              <div className="hero-actions"><button className="primary" onClick={() => navigate('labs')}>Explore the labs</button><button className="secondary" onClick={() => navigate('cars4mars')}>Cars4Mars</button></div>
            </motion.div>
            <motion.div className="spatial-stage" initial={{opacity:0,scale:.92,rotateY:10}} animate={{opacity:1,scale:1,rotateY:0}} transition={{duration:1,ease:[.23,1,.32,1]}}><KopanoScene/><div className="command-card adaptive-command spatial-panel"><div className="command-body"><span className="eyebrow">ROUTE BY NEED</span><form className="intent-form" onSubmit={resolveIntent}><input value={intent} onChange={(event)=>setIntent(event.target.value)} placeholder="jobs, rover, crisis, football, AI…" aria-label="What are you looking for?"/><button type="submit">Go →</button></form></div></div></motion.div>
          </div>

          <motion.section className="home-film" aria-label="Cars4Mars one-minute submission film" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div className="home-film-copy"><span className="eyebrow">CARS4MARS · 60 SECOND MISSION</span><h2>From Cape Town to Mars.</h2><p>Rover design submitted. Hardware build and physical validation come next.</p><button className="secondary" onClick={() => navigate('cars4mars')}>Open Cars4Mars</button></div>
            <div className="home-film-frame"><iframe src="https://www.youtube-nocookie.com/embed/01exG-aWj6g?rel=0" title="Cars4Mars one-minute submission film" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div>
          </motion.section>

          <motion.div className="studio-intro" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div><span className="eyebrow">KOPANO ECOSYSTEM</span><h2>Different problems. One engineering discipline.</h2></div>
            <p>Kopano Labs connects orchestration, public-interest software, community infrastructure and cyber-physical builds without pretending they are the same product.</p>
          </motion.div>

          <section className="now-surface" aria-label="Current Kopano Labs work">
            {now.map((item,index)=><motion.a key={item.id} className={`now-card ${item.tone}`} href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel={item.href.startsWith('http')?'noreferrer':undefined} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} whileHover={{y:-6,scale:1.01}} viewport={{once:true}} transition={{delay:index*.05}}>
              {item.id==='cars4mars'?<RoverVisual className="now-rover"/>:<strong className="now-mark">{item.mark}</strong>}
              <div><span>{item.state}</span><h2>{item.title}</h2><p>{item.detail}</p></div>
            </motion.a>)}
          </section>

          <section className="next-public-strip"><span>UP NEXT</span><strong>Falling Walls Lab collaboration page</strong><strong>NICIS founder-in-action page</strong></section>
        </motion.section>}

        {view === 'foc' && <motion.section key="foc" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><FOCMatrix/></motion.section>}

        {view === 'labs' && <motion.section key="labs" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="page-head"><span className="eyebrow">KOPANO LABS</span><h1>Experiments in motion.</h1><p>Practical tools around jobs, language access, small business and collaborative execution.</p></div><div className="search-row"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search experiments…"/><span>{filteredExperiments.length}</span></div><SpatialDirectory items={filteredExperiments} kind="experiment" emptyLabel="No match."/></motion.section>}

        {view === 'systems' && <motion.section key="systems" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="page-head"><span className="eyebrow">SYSTEMS</span><h1>Working systems.</h1><p>Operational surfaces with separate jobs, routes, constraints and evidence.</p></div><SpatialDirectory items={systems} kind="system"/></motion.section>}

        {isCars4MarsView(view) && <motion.section key={view} className="page mars-page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
          <div className="mars-hero spatial-mars"><div><span className="eyebrow">CARS4MARS · BUILD IN PUBLIC</span><h1>From Cape Town<br/>to Mars.</h1><p>Design submitted. Physical build next.</p><div className="hero-actions"><a className="primary" href="/Cars4Mars/">Mission control</a><a className="secondary" href="/Cars4Mars/Media/">Watch</a></div></div><div className="spatial-stage mars-stage"><KopanoScene/><img className="mars-campaign-figure" src="/assets/cars4mars/astronaut-campaign.svg" alt="Cars4Mars campaign concept artwork"/><RoverVisual className="mars-rover-visual"/><div className="mission-chip"><span>MISSION STATE</span><b>DESIGN → PHYSICAL VALIDATION</b></div></div></div>
          <div id="mission-control"><Cars4MarsMissionControl focus={focusForView(view)}/></div>
        </motion.section>}

        {view === 'proof' && <motion.section key="proof" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="page-head"><span className="eyebrow">PUBLIC PROOF</span><h1>Public evidence.</h1><p>Source authority, deployment provenance and operating ownership. Private communications do not belong on this surface.</p></div><div className="ledger">{proof.map(([kind,title,artifact])=><article key={title}><span className="status-dot"/><div><span className="eyebrow">{kind}</span><h3>{title}</h3></div><code>{artifact}</code></article>)}</div></motion.section>}
      </AnimatePresence>
    </main>

    <footer><span>Kopano Labs · Cape Town, South Africa</span><span>Realism · Aesthetics · Sovereignty · Proof</span></footer>
  </div>;
}
