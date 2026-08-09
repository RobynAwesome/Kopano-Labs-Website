import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InteractiveContext } from './InteractiveContext';

type DirectoryItem = [name: string, category: string, description: string];

type SpatialDirectoryProps = {
  items: DirectoryItem[];
  kind: 'experiment' | 'system';
  emptyLabel?: string;
};

export function SpatialDirectory({ items, kind, emptyLabel = 'No matching routes.' }: SpatialDirectoryProps) {
  const [activeName, setActiveName] = useState(items[0]?.[0] ?? '');
  const [openName, setOpenName] = useState('');
  const workbenchRef = useRef<HTMLDivElement>(null);
  const activeIndex = useMemo(() => Math.max(0, items.findIndex(([name]) => name === activeName)), [items, activeName]);
  const active = items[activeIndex] ?? items[0];

  useEffect(() => {
    if (activeName && !items.some(([name]) => name === activeName)) setActiveName(items[0]?.[0] ?? '');
  }, [items, activeName]);

  if (!active) return <div className="directory-empty">{emptyLabel}</div>;

  const enterContext = () => {
    setOpenName(active[0]);
    window.setTimeout(() => workbenchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  return (
    <section className={`spatial-directory ${kind}`} aria-label={`${kind} directory`}>
      <div className="directory-rail" role="list">
        {items.map(([name, category], index) => {
          const selected = name === active[0];
          return (
            <button type="button" role="listitem" aria-pressed={selected} className={selected ? 'selected' : ''} key={name} onClick={() => setActiveName(name)} onPointerEnter={event => { if (event.pointerType === 'mouse') setActiveName(name); }}>
              <span className="directory-index">{String(index + 1).padStart(2, '0')}</span>
              <span><b>{name}</b><small>{category}</small></span>
              <i aria-hidden="true">→</i>
            </button>
          );
        })}
      </div>

      <div className="directory-stage" aria-live="polite">
        <div className="directory-grid" aria-hidden="true" />
        <div className="directory-orbit orbit-a" aria-hidden="true" />
        <div className="directory-orbit orbit-b" aria-hidden="true" />
        {items.map(([name], index) => {
          const angle = (index / Math.max(items.length, 1)) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 34;
          const y = 50 + Math.sin(angle) * 31;
          const selected = name === active[0];
          return <motion.button type="button" aria-label={`Focus ${name}`} key={name} className={`directory-node ${selected ? 'selected' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} animate={{ scale: selected ? 1.45 : 1, opacity: selected ? 1 : .5 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} onClick={() => setActiveName(name)}><span /></motion.button>;
        })}
        <motion.div key={active[0]} className="directory-core" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .28 }}>
          <span className="eyebrow">{active[1]}</span>
          <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
          <h2>{active[0]}</h2>
          <p>{active[2]}</p>
          <button type="button" onClick={enterContext}>Enter context →</button>
        </motion.div>
      </div>

      <div ref={workbenchRef} className={`directory-workbench-slot ${openName ? 'open' : ''}`}>
        {openName && <><button className="context-close" type="button" onClick={() => setOpenName('')} aria-label="Close interactive context">Close ×</button><InteractiveContext name={openName} kind={kind} /></>}
      </div>
    </section>
  );
}
