import { lazy, Suspense, useEffect, useState, type MouseEvent } from 'react';
import { routeForView, viewForPath } from './routeRegistry';
import { AnimatePresence, motion } from 'framer-motion';

const RouteExperienceSurface = lazy(() => import('./components/RouteExperienceSurface').then((module) => ({ default: module.RouteExperienceSurface })));

type ThemeMode = 'light' | 'dark' | 'crazy';

const estate = [
  { title: 'Kopano Labs', kind: 'Primary studio', href: 'https://KopanoLabs.com', repo: 'RobynAwesome/Kopano-Labs-Website', image: '/assets/brand/kopano-mark.svg', note: 'Observed implementation/deployment source for the systems studio, proof surfaces, public experiments and shared interactive atlas. Canonical production-source authority remains owner-gated.' },
  { title: 'FiveS Arena', kind: 'Community infrastructure', href: 'https://FivesArena.com', repo: 'RobynAwesome/Bookit-5s-Arena', image: '/assets/brand/kopano-mark.svg', note: 'Football booking, live fixture APIs, competition and participation infrastructure.' },
  { title: 'KasiLink', kind: 'Opportunity network', href: 'https://KasiLink.com', repo: 'Production source is governed separately', image: '/assets/brand/kopano-mark.svg', note: 'Local opportunity and service routing with a lower-data discovery lane.' },
  { title: 'CrisisConnect', kind: 'Field intelligence', href: 'https://crisisconnect.kopanolabs.com', repo: 'RobynAwesome/crisis-connect', image: '/assets/brand/kopano-mark.svg', note: 'Mobile-first crisis reporting, GPS evidence and telemetry.' },
  { title: 'Starfall Salvage', kind: 'Interactive systems lab', href: 'https://starfallsalvage.kopanolabs.com', repo: 'Production source is governed separately', image: '/assets/brand/kopano-mark.svg', note: 'Playable systems, interfaces, telemetry and governance.' },
  { title: 'Cars4Mars', kind: 'Cyber-physical programme', href: '/Cars4Mars/', repo: 'RobynAwesome/Kopano-Labs-Website', image: '/assets/cars4mars/astronaut-campaign.svg', note: 'Mission control, rover architecture, media, ledger and support. The submitted design PDF remains retired from the website.' },
  { title: 'Kopano Context', kind: 'Orchestration', href: 'https://kopanocontext.kopanolabs.com', repo: 'Main Brain owner-gated lane', image: '/assets/diagrams/agent-routing.svg', note: 'Canonical interface target for the orchestration and audit system; owner delivery remains proof-gated.' },
  { title: 'Introduction to MCP', kind: 'Main Brain / governance', href: 'https://github.com/Kopano-Labs/Introduction-to-MCP', repo: 'Kopano-Labs/Introduction-to-MCP', image: '/assets/brand/kopano-mark.svg', note: 'Schematics, KPGS/KPEFS governance, stateless-renter entryway and constitutional source authority.' },
  { title: 'Project Jennifer', kind: 'Game / research', href: 'https://github.com/RobynAwesome/Project-Jennifer', repo: 'RobynAwesome/Project-Jennifer', image: '/assets/brand/kopano-mark.svg', note: 'Interactive AI and game systems research.' },
  { title: 'AMA-PHU App', kind: 'Entertainment platform', href: 'https://github.com/RobynAwesome/amaphu-app', repo: 'RobynAwesome/amaphu-app', image: '/assets/brand/kopano-mark.svg', note: 'Manga, game, anime and music distribution surface.' },
] as const;

const links = [
  ['Now', '/'],
  ['Systems', '/systems/'],
  ['Labs', '/labs/'],
  ['Content', '/content/'],
  ['Cars4Mars', '/Cars4Mars/'],
  ['Evidence gate', '/FOC/'],
  ['Proof', '/proof/'],
] as const;

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem('kopano-theme', mode);
}

export function SiteExperience() {
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('kopano-theme') as ThemeMode) || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [pathname, setPathname] = useState(() => location.pathname);
  const [guideOpen, setGuideOpen] = useState(false);
  const contentRoute = pathname.toLowerCase().startsWith('/content');
  const currentRoute = routeForView(viewForPath(pathname));

  useEffect(() => {
    const syncPath = () => {
      setPathname(location.pathname);
      setGuideOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  useEffect(() => applyTheme(theme), [theme]);

  const chooseTheme = (mode: ThemeMode) => {
    setTheme(mode);
    applyTheme(mode);
  };

  const navigateInternal = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/')) return;
    event.preventDefault();
    if (location.pathname !== href) {
      history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setMenuOpen(false);
    setGuideOpen(false);
  };

  return <>
    <div className="experience-controls" aria-label="Site controls">
      <div className="journey-controls" aria-label="Route history">
        <button type="button" className="journey-button" onClick={() => history.back()} aria-label="Go back" title="Back">←</button>
        <span>{currentRoute.id === 'home' ? 'NOW' : currentRoute.id.toUpperCase()}</span>
        <button type="button" className="journey-button" onClick={() => history.forward()} aria-label="Go forward" title="Forward">→</button>
      </div>
      <button type="button" className={'guide-trigger' + (guideOpen ? ' active' : '')} onClick={() => setGuideOpen((open) => !open)} aria-expanded={guideOpen} aria-controls="site-guide" aria-label="Open page guide" title="Page guide">i</button>
      <div className="theme-switcher" role="group" aria-label="Display mode">
        {(['light','dark','crazy'] as ThemeMode[]).map(mode => <button key={mode} className={theme === mode ? 'active' : ''} onClick={() => chooseTheme(mode)} aria-pressed={theme === mode}>{mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '🌀'}<span>{mode}</span></button>)}
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-controls="estate-menu" aria-label="Open navigation"><span/><span/><span/></button>
      <AnimatePresence>
        {guideOpen && <motion.aside id="site-guide" className="guide-panel" initial={{opacity:0,y:-8,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:.98}}>
          <div className="guide-panel-head"><span className="eyebrow">GUIDE · {currentRoute.id === 'home' ? 'NOW' : currentRoute.id.toUpperCase()}</span><button type="button" onClick={() => setGuideOpen(false)} aria-label="Close page guide">×</button></div>
          <h2>{currentRoute.title}</h2>
          <p>{currentRoute.description}</p>
          <ol>
            <li>Choose one visible surface and make the first move.</li>
            <li>Use Back / Forward to keep the route context intact.</li>
            <li>Read the truth boundary before treating a POC as evidence.</li>
          </ol>
          <div className="guide-boundary"><span>GOVERNANCE RULE</span><strong>INTERACTION FIRST · EVIDENCE BEFORE CLAIM</strong></div>
        </motion.aside>}
      </AnimatePresence>
    </div>

    <AnimatePresence>
      {menuOpen && <motion.aside id="estate-menu" className="estate-menu" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:40}}>
        <div className="estate-menu-head"><img src="/assets/brand/kopano-mark.svg" alt=""/><div><strong>Kopano Labs</strong><small>Navigate the estate</small></div></div>
        <nav>{links.map(([label, href], index) => <motion.a key={href} href={href} onClick={(event) => navigateInternal(event, href)} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:index*.035}}>{label}<b>↗</b></motion.a>)}</nav>
        <a className="estate-source" href="https://github.com/Kopano-Labs/Introduction-to-MCP" target="_blank" rel="noreferrer">Main Brain governance ↗</a>
      </motion.aside>}
    </AnimatePresence>

    {contentRoute && <div className="content-estate-page">
      <header className="content-estate-head"><a href="/" className="content-back" onClick={(event) => navigateInternal(event, '/')}>← Kopano Labs</a><span className="eyebrow">CONTENT + PUBLIC ESTATE</span><h1>Everything connects.<br/><em>Nothing gets flattened.</em></h1><p>Projects, systems, experiments and public surfaces stay distinct. Repository labels are shown only where they are explicitly established; Main Brain governs architecture while each product keeps its own source lineage.</p></header>
      <Suspense fallback={<div className="route-experience-boundary" role="status"><span>KPGS · ROUTE LOAD</span><strong>Loading public-estate spatial surface…</strong></div>}><RouteExperienceSurface view="content"/></Suspense>
      <main className="content-estate-grid">
        {estate.map((item, index) => <motion.a key={item.title} className="content-estate-card" href={item.href} onClick={(event) => navigateInternal(event, item.href)} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined} initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:index*.045}} whileHover={{y:-8,scale:1.01}}>
          <div className="content-estate-image"><img src={item.image} alt=""/></div><div className="content-estate-copy"><span>{item.kind}</span><h2>{item.title}</h2><p>{item.note}</p><code>{item.repo}</code></div><b className="content-estate-arrow">↗</b>
        </motion.a>)}
      </main>
      <footer className="content-estate-footer">Kopano Labs · Main Brain before mutation · source lineage before synthesis · edit, do not erase.</footer>
    </div>}
  </>;
}