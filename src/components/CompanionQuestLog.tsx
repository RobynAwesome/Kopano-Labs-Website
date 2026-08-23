import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { subscribeCompanionRoute } from '../companionEvents';
import {
  appendCompanionQuestReceipt,
  clearCompanionQuestLog,
  readCompanionQuestLog,
  type CompanionQuestReceipt,
} from '../companionJourney';
import type { RtcpRoute } from '../rtcpRuntime';

type JourneyVisual = {
  requestId: string;
  destination: string;
  worldLabel: string;
};

function deviceStorage(): Storage | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function timeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function atlasWorldLabel(route: RtcpRoute) {
  switch (route.domain.id) {
    case 'fivesarena': return 'FiveS Arena';
    case 'kasilink': return 'KasiLink';
    case 'crisisconnect': return 'CrisisConnect';
    case 'starfall': return 'Starfall Salvage';
    case 'cars4mars': return 'Cars4Mars';
    case 'context':
    case 'portfolio':
    case 'kopanolabs':
    default: return 'Kopano Context';
  }
}

function activateAtlasWorld(label: string) {
  if (typeof document === 'undefined') return;
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.atlas-selector button'));
  const target = buttons.find(button => button.querySelector('strong')?.textContent?.trim() === label);
  if (target && !target.classList.contains('active')) target.click();
}

export function CompanionQuestLog() {
  const reduceMotion = useReducedMotion();
  const [entries, setEntries] = useState<CompanionQuestReceipt[]>([]);
  const [journey, setJourney] = useState<JourneyVisual | null>(null);

  useEffect(() => {
    const storage = deviceStorage();
    setEntries(readCompanionQuestLog(storage));
    return subscribeCompanionRoute(route => {
      const worldLabel = atlasWorldLabel(route);
      setEntries(appendCompanionQuestReceipt(route, storage));
      activateAtlasWorld(worldLabel);
      setJourney({ requestId: route.requestId, destination: route.domain.label, worldLabel });
    });
  }, []);

  useEffect(() => {
    if (!journey || typeof window === 'undefined') return;
    const timeout = window.setTimeout(() => setJourney(current => current?.requestId === journey.requestId ? null : current), reduceMotion ? 2200 : 1450);
    return () => window.clearTimeout(timeout);
  }, [journey?.requestId, reduceMotion]);

  const clear = () => setEntries(clearCompanionQuestLog(deviceStorage()));
  const atlasStage = typeof document === 'undefined' ? null : document.querySelector('.atlas-stage');
  const journeyPortal = journey && atlasStage ? createPortal(
    <motion.div
      key={journey.requestId}
      className="atlas-companion-journey"
      role="status"
      aria-live="polite"
      initial={reduceMotion ? false : { opacity: 0, x: -34 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: [0, 1, 1, 0], x: [-34, 0, 42] }}
      transition={reduceMotion ? { duration: 0 } : { duration: 1.25, times: [0, .2, .72, 1] }}
    >
      <motion.img
        src="/assets/companion/companion-orb.svg"
        alt=""
        animate={reduceMotion ? undefined : { rotate: [0, 8, -5, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 1.1 }}
      />
      <div>
        <span>COMPANION ROUTE</span>
        <strong>{journey.destination}</strong>
        <small>{journey.worldLabel} woke up · opening the external system still requires your tap.</small>
      </div>
    </motion.div>,
    atlasStage,
  ) : null;

  return <>
    {journeyPortal}
    <section className="companion-quest-log" aria-labelledby="companion-quest-title">
      <div className="companion-quest-head">
        <div>
          <span className="eyebrow">YOUR JOURNEY RECEIPTS</span>
          <h3 id="companion-quest-title">Where the companion has taken you.</h3>
          <p>Stored only on this device. Raw request text is not saved.</p>
        </div>
        {entries.length > 0 && <button type="button" onClick={clear}>Clear this device</button>}
      </div>

      {entries.length === 0 ? <div className="companion-quest-empty">
        <img src="/assets/security/receipt-sigil.svg" alt="" />
        <div><strong>No journey receipts yet.</strong><span>Ask the companion for something and the routed destination will appear here.</span></div>
      </div> : <div className="companion-quest-list" role="list">
        <AnimatePresence initial={false}>
          {entries.map((entry, index) => <motion.article
            key={entry.requestId}
            role="listitem"
            className="companion-quest-entry"
            data-claim={entry.executionClaim}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: Math.min(index * .025, .1) }}
          >
            <img src="/assets/security/receipt-sigil.svg" alt="" />
            <div>
              <span>{entry.executionClaim.replaceAll('_', ' ')}</span>
              <strong>{entry.destination.label}</strong>
              <small>{entry.destination.state} · {entry.receipt.outcome}</small>
            </div>
            <time dateTime={entry.createdAt}>{timeLabel(entry.createdAt)}</time>
          </motion.article>)}
        </AnimatePresence>
      </div>}
    </section>
  </>;
}
