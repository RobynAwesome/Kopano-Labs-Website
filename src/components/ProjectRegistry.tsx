import { useEffect, useMemo, useState } from 'react';
import '../project-registry.css';

type Project = { name: string; role?: string; url: string; note?: string };
type Estate = {
  schema: string;
  authority: string;
  owner: string;
  snapshotDate: string;
  governance: { scope: string; privateRepos: string; classification: string };
  projects: Project[];
  labsAndReferences: Project[];
};

export function ProjectRegistry() {
  const [estate, setEstate] = useState<Estate | null>(null);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<'projects' | 'labs' | 'all'>('projects');

  useEffect(() => {
    let active = true;
    fetch('/projects.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Project estate ${response.status}`);
        return response.json() as Promise<Estate>;
      })
      .then((data) => { if (active) setEstate(data); })
      .catch(() => { if (active) setEstate(null); });
    return () => { active = false; };
  }, []);

  const rows = useMemo(() => {
    if (!estate) return [];
    const base = scope === 'projects' ? estate.projects : scope === 'labs' ? estate.labsAndReferences : [...estate.projects, ...estate.labsAndReferences];
    const needle = query.trim().toLowerCase();
    if (!needle) return base;
    return base.filter((project) => `${project.name} ${project.role ?? ''} ${project.note ?? ''}`.toLowerCase().includes(needle));
  }, [estate, query, scope]);

  return <section className="project-registry" aria-labelledby="project-registry-title">
    <div className="project-registry-head">
      <div>
        <span className="eyebrow">ROBYNAWESOME · CANONICAL REPO ESTATE</span>
        <h2 id="project-registry-title">The work is bigger than the homepage.</h2>
      </div>
      <p>RobynAwesome is the canonical GitHub namespace for Kopano-owned repositories. Production products, client systems, constitutional governance sources and runtime hubs are separated from labs, workshops, learning repositories and upstream references so ownership does not become a false product claim.</p>
    </div>

    <div className="project-registry-controls">
      <div className="project-registry-tabs" role="group" aria-label="Project registry scope">
        <button className={scope === 'projects' ? 'active' : ''} onClick={() => setScope('projects')}>Projects {estate ? `· ${estate.projects.length}` : ''}</button>
        <button className={scope === 'labs' ? 'active' : ''} onClick={() => setScope('labs')}>Labs + references {estate ? `· ${estate.labsAndReferences.length}` : ''}</button>
        <button className={scope === 'all' ? 'active' : ''} onClick={() => setScope('all')}>All public repos {estate ? `· ${estate.projects.length + estate.labsAndReferences.length}` : ''}</button>
      </div>
      <label className="project-registry-search"><span>SEARCH ESTATE</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="KasiLink, Gemini, MCP, Arena…" /></label>
    </div>

    {!estate && <div className="project-registry-boundary"><strong>ESTATE UNAVAILABLE</strong><span>The public repository manifest could not be loaded. GitHub namespace authority remains RobynAwesome.</span></div>}

    {estate && <>
      <div className="project-registry-meta">
        <span>OWNER <strong>{estate.owner}</strong></span>
        <span>SNAPSHOT <strong>{estate.snapshotDate}</strong></span>
        <span>PUBLIC ONLY <strong>PRIVATE REPOS WITHHELD</strong></span>
        <a href={estate.authority} target="_blank" rel="noreferrer">Open GitHub authority ↗</a>
      </div>
      <div className="project-registry-grid">
        {rows.map((project) => <a key={project.name} className="project-registry-card" href={project.url} target="_blank" rel="noreferrer">
          <span>{project.role ? project.role.replaceAll('-', ' ').toUpperCase() : 'LAB / REFERENCE'}</span>
          <h3>{project.name}</h3>
          <p>{project.note ?? 'Public repository in the RobynAwesome lab and reference estate.'}</p>
          <small>github.com/RobynAwesome/{project.name} ↗</small>
        </a>)}
      </div>
      {rows.length === 0 && <div className="project-registry-boundary"><strong>NO MATCH</strong><span>Change the filter or search term. The manifest remains the source for this surface.</span></div>}
      <p className="project-registry-law"><strong>KPGS boundary:</strong> repository ownership proves source authority, not production maturity. MAIN-BRAIN holds constitutional authority; runtime hubs and public products still need their own deployment, user, field or client receipts.</p>
    </>}
  </section>;
}
