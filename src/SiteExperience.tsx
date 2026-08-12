import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ThemeMode = 'light' | 'dark' | 'crazy';

const estate = [
  { title: 'Kopano Labs', kind: 'Primary studio', href: 'https://KopanoLabs.com', repo: 'RobynAwesome/Kopano-Labs-Website', image: '/assets/brand/kopano-mark.svg', note: 'Systems studio, proof surfaces, Cars4Mars and public experiments.' },
  { title: 'Cars4Mars', kind: 'Rover programme', href: '/Cars4Mars/', repo: 'Kopano-Labs website surface', image: '/assets/cars4mars/astronaut-campaign.svg', note: 'Mission control, architecture, media, ledger and support.' },
  { title: 'FiveS Arena', kind: 'Community infrastructure', href: 'https://FivesArena.com', repo: 'RobynAwesome/Bookit-5s-Arena', image: '/assets/brand/kopano-mark.svg', note: 'Football booking, competition and participation infrastructure.' },
  { title: 'KasiLink', kind: 'Opportunity network', href: 'https://KasiLink.com', repo: 'Kopano ecosystem', image: '/assets/brand/kopano-mark.svg', note: 'Local opportunity and service routing.' },
  { title: 'CrisisConnect', kind: 'Field intelligence', href: 'https://crisisconnect.kopanolabs.com', repo: 'RobynAwesome/crisis-connect', image: '/assets/brand/kopano-mark.svg', note: 'Mobile-first crisis reporting and telemetry.' },
  { title: 'Starfall Salvage', kind: 'Interactive systems lab', href: 'https://starfallsalvage.kopanolabs.com', repo: 'Kopano ecosystem', image: '/assets/brand/kopano-mark.svg', note: 'Playable systems, interfaces, telemetry and governance.' },
  { title: 'Introduction to MCP', kind: 'Main Brain / governance', href: 'https://github.com/Kopano-Labs/Introduction-to-MCP', repo: 'Kopano-Labs/Introduction-to-MCP', image: '/assets/brand/kopano-mark.svg', note: 'Schematics, KPGS governance, stateless-renter entryway and source authority.' },
  { title: 'Project Jennifer', kind: 'Game / research', href: 'https://github.com/RobynAwesome/Project-Jennifer', repo: 'RobynAwesome/Project-Jennifer', image: '/assets/brand/kopano-mark.svg', note: 'Interactive AI/game systems research.' },
  { title: 'AMA-PHU App', kind: 'Entertainment platform', href: 'https://github.com/RobynAwesome/amaphu-app', repo: 'RobynAwesome/amaphu-app', image: '/assets/brand/kopano-mark.svg', note: 'Manga, game, anime and music distribution surface.' },
  { title: 'RobynAwesome GitHub', kind: 'Repository estate', href: 'https://github.com/RobynAwesome?tab=repositories', repo: 'All public repositories', image: '/assets/brand/kopano-mark.svg', note: 'Full public source portfolio and project archive.' },
] as const;

const links = [
  ['Now', '/'],
  ['Labs', '/labs/'],
  ['Cars4Mars', '/Cars4Mars/'],
  ['Content', '/content/'],
  ['FOC', '/FOC/'],
  ['Systems', '/systems/'],
  ['Proof', '/proof/'],
] as const;

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem('kopano-theme', mode);
}

export function SiteExperience() {
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('kopano-theme') as ThemeMode) || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRoute = useMemo(() => location.pathname.toLowerCase().startsWith('/content'), []);

  useEffect(() => applyTheme(theme), [theme]);

  const chooseTheme = (mode: ThemeMode) => {
    setTheme(mode);
    applyTheme(mode);
  };

  return <>
    <div className="experience-controls" aria-label="Display controls">
      <div className="theme-switcher" role="group" aria-label="Display mode">
        {(['light','dark','crazy'] as ThemeMode[]).map(mode => <button key={mode} className={theme === mode ? 'active' : ''} onClick={() => chooseTheme(mode)} aria-pressed={theme === mode}>{mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '🌀'}<span>{mode}</span></button>)}
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-controls="estate-menu" aria-label="Open navigation"><span/><span/><span/></button>
    </div>

    <AnimatePresence>
      {menuOpen && <motion.aside id="estate-menu" className="estate-menu" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:40}}>
        <div className="estate-menu-head"><img src="/assets/brand/kopano-mark.svg" alt=""/><div><strong>Kopano Labs</strong><small>Navigate the estate</small></div></div>
        <nav>{links.map(([label, href], index) => <motion.a key={href} href={href} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:index*.035}}>{label}<b>↗</b></motion.a>)}</nav>
        <a className="estate-source" href="https://github.com/RobynAwesome?tab=repositories" target="_blank" rel="noreferrer">Repository estate ↗</a>
      </motion.aside>}
    </AnimatePresence>

    {contentRoute && <div className="content-estate-page">
      <header className="content-estate-head"><a href="/" className="content-back">← Kopano Labs</a><span className="eyebrow">CONTENT + REPOSITORY ESTATE</span><h1>Everything connects.<br/><em>Nothing gets flattened.</em></h1><p>Projects, systems, experiments, public surfaces and source repositories—kept distinct, visual and directly reachable.</p></header>
      <main className="content-estate-grid">
        {estate.map((item, index) => <motion.a key={item.title} className="content-estate-card" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined} initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:index*.045}} whileHover={{y:-8,scale:1.01}}>
          <div className="content-estate-image"><img src={item.image} alt=""/></div><div className="content-estate-copy"><span>{item.kind}</span><h2>{item.title}</h2><p>{item.note}</p><code>{item.repo}</code></div><b className="content-estate-arrow">↗</b>
        </motion.a>)}
      </main>
      <footer className="content-estate-footer">Kopano Labs · source lineage before synthesis · edit, do not erase.</footer>
    </div>}
  </>;
}
