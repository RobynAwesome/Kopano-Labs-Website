import { FormEvent, useEffect, useState } from 'react';

type LaneId = 'labs' | 'kasilink' | 'cars4mars';

type Lane = {
  id: LaneId;
  label: string;
  trigger: string;
  response: string;
};

const lanes: readonly Lane[] = [
  {
    id: 'labs',
    label: 'Kopano Labs',
    trigger: 'a bounded experiment need',
    response: 'Labs returned a bounded first move and kept the claim behind evidence.',
  },
  {
    id: 'kasilink',
    label: 'KasiLink',
    trigger: 'an opportunity or service need',
    response: 'KasiLink is the selected product lane; the next step is local context before a handoff.',
  },
  {
    id: 'cars4mars',
    label: 'Cars4Mars',
    trigger: 'an engineering or validation need',
    response: 'Cars4Mars is the selected evidence lane; model output remains separate from physical validation.',
  },
];

const stages = ['INPUT', 'CLASSIFY', 'ROUTE', 'EVIDENCE'] as const;

function laneFor(input: string) {
  const normalized = input.toLowerCase();
  if (/rover|mars|physical|motor|traction|drive/.test(normalized)) return lanes[2];
  if (/job|work|opportunity|service|business|kasi/.test(normalized)) return lanes[1];
  return lanes[0];
}

export function KopanoContextWorkbench() {
  const [input, setInput] = useState('');
  const [laneId, setLaneId] = useState<LaneId>('labs');
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState('Choose a lane or enter one bounded need.');

  const activeLane = lanes.find((lane) => lane.id === laneId) ?? lanes[0];

  useEffect(() => {
    if (!running) return;
    if (stage >= stages.length - 1) {
      setRunning(false);
      setResult(activeLane.response);
      return;
    }

    const timer = window.setTimeout(() => setStage((current) => current + 1), 280);
    return () => window.clearTimeout(timer);
  }, [activeLane.response, running, stage]);

  const chooseLane = (lane: Lane) => {
    setLaneId(lane.id);
    setStage(0);
    setResult(lane.trigger + ' ready for a local rehearsal.');
  };

  const run = (event: FormEvent) => {
    event.preventDefault();
    const nextLane = laneFor(input);
    setLaneId(nextLane.id);
    setStage(0);
    setResult('KC is tracing ' + nextLane.trigger + ' locally.');
    setRunning(true);
  };

  return (
    <section className="kc-workbench" aria-label="Kopano Context local proof of concept">
      <div className="kc-workbench-header">
        <div>
          <span className="eyebrow">KOPANO CONTEXT · KC</span>
          <h3>Make the orchestration visible.</h3>
          <p>One need enters. KC classifies the lane, keeps the next move bounded and returns the evidence boundary.</p>
        </div>
        <div className="kc-workbench-status">
          <span className="kc-status-dot" />
          <strong>LOCAL POC</strong>
          <small>owner-ready runtime pending</small>
        </div>
      </div>

      <div className="kc-workbench-tools">
        <div className="kc-lane-selector" role="list" aria-label="Choose a Kopano lane">
          {lanes.map((lane, index) => (
            <button type="button" role="listitem" key={lane.id} className={lane.id === laneId ? 'active' : ''} onClick={() => chooseLane(lane)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{lane.label}</strong>
              <small>{lane.trigger}</small>
            </button>
          ))}
        </div>

        <form className="kc-form" onSubmit={run}>
          <label htmlFor="kc-need">One bounded need</label>
          <div>
            <input id="kc-need" value={input} onChange={(event) => setInput(event.target.value)} placeholder="jobs, language, crisis, rover…" />
            <button type="submit" disabled={running}>{running ? 'Routing…' : 'Run KC POC →'}</button>
          </div>
        </form>
      </div>

      <div className="kc-pipeline" aria-live="polite" aria-label="KC local routing stages">
        {stages.map((label, index) => (
          <div key={label} className={'kc-stage ' + (index <= stage ? 'complete ' : '') + (index === stage && running ? 'active' : '')}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{label}</strong>
            <small>{index <= stage ? 'acknowledged' : 'waiting'}</small>
          </div>
        ))}
      </div>

      <div className="kc-result">
        <div>
          <span>LOCAL RETURN · {activeLane.label.toUpperCase()}</span>
          <strong>{result}</strong>
        </div>
        <a href="https://kopanocontext.kopanolabs.com" target="_blank" rel="noreferrer">Open KC target ↗</a>
      </div>

      <div className="kc-ecosystem-check" aria-label="Three-lane ecosystem check">
        <article><span>01 · MAIN BRAIN / KC</span><strong>GOVERNED</strong><small>KC/Cassy authority remains owner-visible and proof-gated.</small></article>
        <article><span>02 · KOPANO LABS</span><strong>POC LIVE</strong><small>This browser-local rehearsal is the visible interaction layer.</small></article>
        <article><span>03 · CARS4MARS</span><strong>MODEL BOUND</strong><small>Simulation can explain a system; it cannot prove the physical build.</small></article>
      </div>

      <div className="kc-boundary"><span>TRUTH BOUNDARY</span><strong>LOCAL KC REHEARSAL ≠ OWNER-READY KC RUNTIME</strong></div>
    </section>
  );
}
