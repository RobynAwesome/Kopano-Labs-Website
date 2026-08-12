import { useEffect, useState } from 'react';

type Fixture = { id: string; home: string; away: string; status: string; time: string };

const feedBase = 'https://fivesarena.com/api/football/league/premier-league';

function label(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const key of ['name', 'shortName', 'displayName', 'teamName']) {
      const candidate = record[key];
      if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
    }
  }
  return fallback;
}

function normalize(value: unknown, index: number): Fixture | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  const home = label(row.homeTeam ?? row.home, 'Home');
  const away = label(row.awayTeam ?? row.away, 'Away');
  return {
    id: label(row.id ?? row.fixtureId ?? row.matchId, `${home}-${away}-${index}`),
    home,
    away,
    status: label(row.status ?? row.state ?? row.phase, 'Scheduled'),
    time: label(row.kickoff ?? row.kickoffTime ?? row.date ?? row.utcDate, 'Live schedule'),
  };
}

export function FivesArenaFeed() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [state, setState] = useState<'loading' | 'live' | 'fallback'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6500);
    const run = async () => {
      try {
        const metaResponse = await fetch(`${feedBase}/meta`, { signal: controller.signal, cache: 'no-store' });
        const meta = await metaResponse.json() as Record<string, unknown>;
        const season = label(meta.selectedSeason, '2025');
        const matchResponse = await fetch(`${feedBase}/matches?season=${encodeURIComponent(season)}`, { signal: controller.signal, cache: 'no-store' });
        const body = await matchResponse.json() as { matches?: unknown[] };
        if (!matchResponse.ok || !Array.isArray(body.matches)) throw new Error('feed unavailable');
        const next = body.matches.map(normalize).filter((item): item is Fixture => Boolean(item)).slice(0, 4);
        setFixtures(next);
        setState(next.length ? 'live' : 'fallback');
      } catch {
        setState('fallback');
      } finally {
        window.clearTimeout(timeout);
      }
    };
    void run();
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, []);

  return <div className="fives-feed" aria-live="polite">
    <div className="fives-feed-head"><span>FIVESARENA.COM · READ-ONLY FIXTURE FEED</span><b className={state}>{state === 'live' ? 'LIVE API' : state === 'loading' ? 'SYNCING' : 'DIRECT LINK'}</b></div>
    {fixtures.length ? <div className="fixture-rail">{fixtures.map((fixture)=><article key={fixture.id}><small>{fixture.status}</small><strong>{fixture.home}<i>vs</i>{fixture.away}</strong><time>{fixture.time}</time></article>)}</div> : <div className="fixture-fallback"><strong>Fixtures remain authoritative at FiveS Arena.</strong><span>This preview fails soft if the cross-site feed is unavailable.</span></div>}
    <a href="https://fivesarena.com/fixtures" target="_blank" rel="noreferrer">Open all fixtures ↗</a>
  </div>;
}
