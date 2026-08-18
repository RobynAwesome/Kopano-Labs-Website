import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useMemo, useState, type FormEvent } from 'react';
import './adaptive.css';
import { emitKPGSReceipt } from './kpgsSceneContract';
import { syncKPGSRuntime } from './experienceRuntime';
import type { Cars4MarsFocus } from './components/Cars4MarsMissionControl';
import { FOCMatrix } from './components/FOCMatrix';
import { GovernanceExperimentMap } from './components/GovernanceExperimentMap';
import { RoverVisual } from './components/RoverVisual';
import { SpatialDirectory } from './components/SpatialDirectory';
import { canonicalForView, pathForView, routeForIntent, routeForView, type View, viewForPath } from './routeRegistry';

const Cars4MarsMissionControl = lazy(() => import('./components/Cars4MarsMissionControl').then((module) => ({ default: module.Cars4MarsMissionControl })));
const KopanoScene = lazy(() => import('./components/KopanoScene').then((module) => ({ default: module.KopanoScene })));
const MarsRoverScene = lazy(() => import('./components/MarsRoverScene').then((module) => ({ default: module.MarsRoverScene })));
const RouteExperienceSurface = lazy(() => import('./components/RouteExperienceSurface').then((module) => ({ default: module.RouteExperienceSurface })));
const SystemAtlas = lazy(() => import('./components/SystemAtlas').then((module) => ({ default: module.SystemAtlas })));

const systems: [string, string, string][] = [
  ['Kopano Sovereign Hub', 'Governance experiment runtime', 'The runtime projection that binds KPGS experiments, adapters and receipts while MAIN-BRAIN remains constitutional authority.'],
  ['Kopano Context', 'Multi-agent orchestration', 'The orchestration and audit layer behind the ecosystem.'],
  ['FiveS Arena', 'Community infrastructure', 'Football booking, live fixtures, competition and local participation systems.'],
  ['KasiLink', 'Opportunity network', 'Township opportunity and service discovery with low-data routing.'],
  ['CrisisConnect', 'Field intelligence', 'Mobile-first crisis reporting and GPS-anchored lived telemetry.'],
  ['Starfall Salvage', 'Interactive systems lab', 'Games as a test bench for interfaces, telemetry and governance.'],
  ['Cars4Mars', 'Cyber-physical engineering', 'Rover architecture, public build evidence and physical validation.'],
];

const now = [
  { id:'hub', mark:'KSH', title:'Kopano Sovereign Hub', state:'RUNTIME', detail:'KPGS governance experiments converge through one governed runtime without moving constitutional authority out of MAIN-BRAIN.', href:'/labs/', tone:'blue' },
  { id:'fives', mark:'5S', title:'FiveS Arena', state:'LIVE', detail:'Community football infrastructure with live booking and fixture surfaces.', href:'https://fivesarena.com', tone:'green' },
  { id:'kasilink', mark:'KL', title:'KasiLink', state:'LIVE', detail:'Local opportunity and service routing for township conditions.', href:'https://kasilink.com', tone:'blue' },
  { id:'cars4mars', mark:'MARS', title:'Cars4Mars', state:'BUILD', detail:'Rover design submitted. Hardware build and physical validation next.', href:'/Cars4Mars/', tone:'mars' },
  { id:'crisis', mark:'CC', title:'CrisisConnect', state:'FIELD', detail:'Mobile-first reporting and GPS-anchored evidence flows.', href:'https://crisisconnect.kopanolabs.com', tone:'gold' },
  { id:'starfall', mark:'SS', title:'Starfall Salvage', state:'REWORK', detail:'Playable systems lab. Product flow and operations are being reworked.', href:'https://starfallsalvage.kopanolabs.com', tone:'violet' },
] as const;

const proof = [
  ['FOUNDER AUTHORITY', 'Kholofelo Robyn Rababalela', 'Founder · Director · Sovereign System Engineer'],
  ['DEPLOYMENT PROVENANCE', 'Observed in current Vercel metadata', 'RobynAwesome/Kopano-Labs-Website · not constitutional source authority'],
  ['CONSTITUTIONAL AUTHORITY', 'KPGS / MAIN-BRAIN', 'RobynAwesome/Introduction-to-MCP'],
  ['RUNTIME AUTHORITY', 'Kopano Sovereign Hub', 'RobynAwesome/kopano-sovereign-hub · runtime projection'],
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

function GovernedFallback({ label }: { label: string }) {
  return <div className="route-experience-boundary" role="status" aria-live="polite"><span>KPGS · ROUTE LOAD</span><strong>{label}</strong></div>;
}

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
    const contract = syncKPGSRuntime(view);
    emitKPGSReceipt(contract, 'route_activated', { path: route.path });
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
    if (location.pathname !== path) {
      history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolveIntent = (event: FormEvent) => {
    event.preventDefault();
    navigate(routeForIntent(intent || 'explore').id);
  };

  return <div className="app-shell" data-kpgs-route={view}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <header className="topbar">
      <button className="brand" onClick={() => navigate('home')}><span className="brand-mark"><img src="/assets/brand/kopano-mark.svg" alt=""/></span><span><strong>Kopano Labs</strong><small>SOUTH AFRICAN SYSTEMS STUDIO</small></span></button>
      <nav aria-label="Primary">
        <NavButton id="home" active={primaryView} onClick={navigate}>Now</NavButton>
        <NavButton id="systems" active={primaryView} onClick={navigate}>Systems</NavButton>
        <NavButton id="labs" active={primaryView} onClick={navigate}>Experiments</NavButton>
        <NavButton id="cars4mars" active={primaryView} onClick={navigate}>Cars4Mars</NavButton>
        <NavButton id="foc" active={primaryView} onClick={navigate}>Evidence gate</NavButton>
        <NavButton id="proof" active={primaryView} onClick={navigate}>Proof</NavButton>
      </nav>
      <a className="source-pill" href="/release.json">Live state ↗</a>
    </header>

    <main id="main-content">
      <AnimatePresence mode="wait">
        {view === 'home' && <motion.section key="home" className="page home" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
          <div className="hero-grid spatial-hero now-hero">
            <motion.div className="hero-copy" initial={{opacity:0,x:-70,filter:'blur(8px)'}} animate={{opacity:1,x:0,filter:'blur(0px)'}} transition={{duration:.8,ease:[.23,1,.32,1]}}>
              <span className="eyebrow">KOPANO LABS · SYSTEMS IN MOTION · BUILT IN SOUTH AFRICA</span>
              <h1>Realism.<br/><em>Sovereignty. Proof.</em></h1>
              <p>Offline-first, proof-gated systems built to stay useful when the grid and the cloud do not.</p>
              <p className="studio-principle">Realism accommodates aesthetics; sovereignty accommodates both.</p>
              <div className="hero-actions"><button className="primary" onClick={() => navigate('systems')}>Enter the systems</button><button className="secondary" onClick={() => navigate('labs')}>Run the experiments</button></div>
            </motion.div>
            <motion.div className="spatial-stage" initial={{opacity:0,scale:.92,rotateY:10}} animate={{opacity:1,scale:1,rotateY:0}} transition={{duration:1,ease:[.23,1,.32,1]}}><Suspense fallback={<GovernedFallback label="Loading spatial systems map…"/>}><KopanoScene view={view}/></Suspense><div className="command-card adaptive-command spatial-panel"><div className="command-body"><span className="eyebrow">ROUTE BY NEED</span><form className="intent-form" onSubmit={resolveIntent}><input value={intent} onChange={(event)=>setIntent(event.target.value)} placeholder="football, jobs, crisis, rover, AI…" aria-label="What are you looking for?"/><button type="submit">Go →</button></form></div></div></motion.div>
          </div>

          <Suspense fallback={<GovernedFallback label="Loading systems atlas…"/>}><SystemAtlas compact view={view}/></Suspense>

          <motion.div className="studio-intro" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div><span className="eyebrow">KOPANO ECOSYSTEM</span><h2>Different problems. One engineering discipline.</h2></div>
            <p>Kopano Labs connects governance experiments, client delivery, public-interest software, community infrastructure and cyber-physical builds without pretending they are the same product.</p>
          </motion.div>

          <section className="now-surface" aria-label="Current Kopano Labs work">
            {now.map((item,index)=><motion.a key={item.id} className={`now-card ${item.tone}`} href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel={item.href.startsWith('http')?'noreferrer':undefined} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} whileHover={{y:-6,scale:1.01}} viewport={{once:true}} transition={{delay:index*.05}}>
              {item.id==='cars4mars'?<RoverVisual className="now-rover"/>:<strong className="now-mark">{item.mark}</strong>}
              <div><span>{item.state}</span><h2>{item.title}</h2><p>{item.detail}</p></div>
            </motion.a>)}
          </section>

          <motion.section className="home-film" aria-label="Cars4Mars one-minute submission film" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div className="home-film-copy"><span className="eyebrow">CARS4MARS · ONE ACTIVE LANE</span><h2>From Cape Town to Mars.</h2><p>Rover design submitted. Hardware build and physical validation come next.</p><button className="secondary" onClick={() => navigate('cars4mars')}>Open Cars4Mars</button></div>
            <div className="home-film-frame"><iframe src="https://www.youtube-nocookie.com/embed/01exG-aWj6g?rel=0" title="Cars4Mars one-minute submission film" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div>
          </motion.section>

          <section className="next-public-strip"><span>UP NEXT</span><strong>Falling Walls Lab collaboration page</strong><strong>NICIS founder-in-action page</strong></section>
        </motion.section>}

        {view === 'foc' && <motion.section key="foc" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><Suspense fallback={<GovernedFallback label="Loading evidence surface…"/>}><RouteExperienceSurface view="foc"/></Suspense><FOCMatrix/></motion.section>}

        {view === 'labs' && <motion.section key="labs" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
          <div className="page-head"><span className="eyebrow">KOPANO LABS · KPGS</span><h1>Governance systems experiments.</h1><p>Cape Campass, Harvest-4-All, Starfall Salvage, CrisisConnect, KasiLink, Cars4Mars, Project Jennifer and the external receipts that test whether the same governance discipline survives different realities.</p></div>
          <Suspense fallback={<GovernedFallback label="Loading KC local rehearsal…"/>}><RouteExperienceSurface view="labs"/></Suspense>
          <div className="search-row"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Cape Campass, Harvest, Starfall, field receipts…"/><span>KSH</span></div>
          <GovernanceExperimentMap query={query}/>
        </motion.section>}

        {view === 'systems' && <motion.section key="systems" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="page-head"><span className="eyebrow">SYSTEMS</span><h1>Working systems.</h1><p>Operational surfaces with separate jobs, routes, constraints, data and evidence. The Sovereign Hub connects the governance experiment runtime without collapsing those systems into one product.</p></div><Suspense fallback={<GovernedFallback label="Loading systems atlas…"/>}><SystemAtlas view={view}/></Suspense><SpatialDirectory items={systems} kind="system"/></motion.section>}

        {isCars4MarsView(view) && <motion.section key={view} className="page mars-page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
          <div className="mars-hero spatial-mars"><div><span className="eyebrow">CARS4MARS · BUILD IN PUBLIC</span><h1>From Cape Town<br/>to Mars.</h1><p>Drive the browser rover, inspect the mechanisms, then follow the evidence ledger. Design submitted. Physical build next.</p><div className="hero-actions"><a className="primary" href="/Cars4Mars/">Mission control</a><a className="secondary" href="/Cars4Mars/Media/">Watch</a></div></div><div className="spatial-stage mars-stage"><Suspense fallback={<GovernedFallback label="Loading rover simulation…"/>}><MarsRoverScene view={view}/></Suspense><div className="mission-chip"><span>MISSION STATE</span><b>DESIGN → PHYSICAL VALIDATION</b></div></div></div>
          <div id="mission-control"><Suspense fallback={<GovernedFallback label="Loading mission control…"/>}><Cars4MarsMissionControl focus={focusForView(view)}/></Suspense></div>
        </motion.section>}

        {view === 'proof' && <motion.section key="proof" className="page" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="page-head"><span className="eyebrow">PUBLIC PROOF</span><h1>Public evidence.</h1><p>Source authority, runtime provenance, external validation and operating ownership. Private communications do not belong on this surface.</p></div><Suspense fallback={<GovernedFallback label="Loading proof surface…"/>}><RouteExperienceSurface view="proof"/></Suspense><div className="ledger">{proof.map(([kind,title,artifact])=><article key={title}><span className="status-dot"/><div><span className="eyebrow">{kind}</span><h3>{title}</h3></div><code>{artifact}</code></article>)}</div></motion.section>}
      </AnimatePresence>
    </main>

    <footer><span>Kopano Labs · Cape Town, South Africa</span><span>Reality → governance → receipt → public evidence</span></footer>
  </div>;
}
