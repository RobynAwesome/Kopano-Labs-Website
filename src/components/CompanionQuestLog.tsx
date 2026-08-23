import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  appendCompanionQuestReceipt,
  clearCompanionQuestLog,
  readCompanionQuestLog,
  type CompanionQuestReceipt,
} from '../companionJourney';
import type { RtcpRoute } from '../rtcpRuntime';

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

export function CompanionQuestLog({ route }: { route: RtcpRoute | null }) {
  const [entries, setEntries] = useState<CompanionQuestReceipt[]>([]);

  useEffect(() => {
    setEntries(readCompanionQuestLog(deviceStorage()));
  }, []);

  useEffect(() => {
    if (!route) return;
    setEntries(appendCompanionQuestReceipt(route, deviceStorage()));
  }, [route?.requestId]);

  const clear = () => setEntries(clearCompanionQuestLog(deviceStorage()));

  return <section className="companion-quest-log" aria-labelledby="companion-quest-title">
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
  </section>;
}
