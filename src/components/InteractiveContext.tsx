import { FormEvent, useMemo, useState } from 'react';

type Props = { name: string; kind: 'experiment' | 'system' };

type Action = { label: string; href?: string; note: string };

const actions: Record<string, Action[]> = {
  'Kopano Context': [
    { label: 'Inspect public proof', href: '/proof/', note: 'Trace source, state and evidence before trusting a claim.' },
    { label: 'Open KC target', href: 'https://kopanocontext.kopanolabs.com', note: 'Canonical interface target; owner-ready runtime remains proof-gated.' },
    { label: 'Open website source', href: 'https://github.com/RobynAwesome/Kopano-Labs-Website', note: 'Observed website implementation, not KC runtime authority.' },
  ],
  'CrisisConnect': [
    { label: 'Capture field report', note: 'Prototype a GPS + media + severity report locally on this device.' },
  ],
  'FiveS Arena': [
    { label: 'Open FiveS Arena', href: 'https://FivesArena.com', note: 'Community football infrastructure and booking surface.' },
  ],
  'Starfall Salvage': [
    { label: 'Launch Starfall Salvage', href: 'https://starfallsalvage.kopanolabs.com', note: 'Interactive systems and telemetry test bench.' },
  ],
};

function Result({ children }: { children: React.ReactNode }) {
  return <div className="context-result" role="status">{children}</div>;
}

export function InteractiveContext({ name, kind }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [choice, setChoice] = useState('');

  const suggestions = useMemo(() => {
    if (name === 'Gig Matcher') return ['Retail + service', 'Digital + admin', 'Trades + field work'];
    if (name === 'Youth Opportunity Finder') return ['Bursaries', 'Learnerships', 'Communities'];
    if (name === 'SA Language Engine') return ['English → isiXhosa', 'English → isiZulu', 'Plain-language rewrite'];
    if (name === 'SME Assistant') return ['Pricing', 'Cash flow', 'Customer follow-up'];
    if (name === 'Kopano Forge') return ['Turn idea into tasks', 'Define evidence gate', 'Create review checklist'];
    if (name === 'Kopano Code') return ['HTML/CSS', 'JavaScript', 'Python'];
    return [];
  }, [name]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = value.trim();
    if (!text && !choice) {
      setResult('Choose a path or type what you need first.');
      return;
    }
    const input = text || choice;
    const responses: Record<string, string> = {
      'Gig Matcher': `Starter match: ${input}. Next step: verify location, availability and a real employer or apprenticeship source before presenting an opportunity.`,
      'Youth Opportunity Finder': `Opportunity route: ${input}. Next step: collect province, age/study level and deadline so results can be narrowed instead of dumping a long list.`,
      'SA Language Engine': `Language task queued: ${input}. Keep names, places and technical terms intact; translate meaning before style.`,
      'SME Assistant': `SME focus: ${input}. Start with one measurable business problem, one weekly action and one proof metric.`,
      'Kopano Forge': `Forge route: ${input}. Convert it into owner → task → artifact → evidence → review instead of leaving it as an idea.`,
      'Kopano Code': `Learning route: ${input}. Build a tiny working example first, then explain the code and failure states.`,
      'CrisisConnect': `Field report staged locally: ${input}. Production submission must add GPS, timestamp, media, severity and consent boundaries.`,
    };
    setResult(responses[name] ?? `${name}: ${input}`);
  };

  const systemActions = actions[name] ?? [];

  return (
    <section className="context-workbench" aria-label={`${name} interactive context`}>
      <div className="context-workbench-head">
        <span className="eyebrow">{kind === 'experiment' ? 'TRY THE EXPERIMENT' : 'ENTER THE SYSTEM'}</span>
        <h3>{name}</h3>
        <p>{kind === 'experiment' ? 'A lightweight local interaction first. No account, no heavy download, no fake result.' : 'Use the live route where one exists; otherwise inspect the bounded prototype state.'}</p>
      </div>

      {suggestions.length > 0 && <div className="context-chips" aria-label="Quick paths">{suggestions.map(item => <button type="button" key={item} className={choice === item ? 'active' : ''} onClick={() => setChoice(item)}>{item}</button>)}</div>}

      {(kind === 'experiment' || name === 'CrisisConnect') && <form className="context-form" onSubmit={submit}>
        <label htmlFor={`context-${name.replace(/\s+/g, '-').toLowerCase()}`}>What do you need?</label>
        <div><input id={`context-${name.replace(/\s+/g, '-').toLowerCase()}`} value={value} onChange={event => setValue(event.target.value)} placeholder={name === 'CrisisConnect' ? 'Describe what is happening…' : 'Type one need, problem or goal…'} /><button type="submit">Run →</button></div>
      </form>}

      {systemActions.length > 0 && <div className="context-actions">{systemActions.map(action => action.href ? <a key={action.label} href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel={action.href.startsWith('http') ? 'noreferrer' : undefined}><strong>{action.label}</strong><span>{action.note}</span></a> : <button type="button" key={action.label} onClick={() => setResult(action.note)}><strong>{action.label}</strong><span>{action.note}</span></button>)}</div>}

      {result && <Result>{result}</Result>}
    </section>
  );
}
