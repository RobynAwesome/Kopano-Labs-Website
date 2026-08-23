import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

type NodeId = 'you' | 'companion' | 'guard' | 'system' | 'receipt';

type SecurityNode = {
  id: NodeId;
  label: string;
  short: string;
  detail: string;
};

const nodes: SecurityNode[] = [
  { id: 'you', label: 'You', short: 'YOU', detail: 'Your request starts here.' },
  { id: 'companion', label: 'Companion', short: 'AI', detail: 'Explains and routes. It does not inherit your authority.' },
  { id: 'guard', label: 'Guard', short: 'GUARD', detail: 'Permission and policy checks happen before protected work.' },
  { id: 'system', label: 'System', short: 'ACT', detail: 'A bounded product or tool may act only after the guard allows it.' },
  { id: 'receipt', label: 'Receipt', short: 'PROOF', detail: 'The result is not a claim until there is evidence of what happened.' },
];

export function CompanionSecurityGraph() {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<'safe' | 'blocked'>('safe');
  const blocked = mode === 'blocked';

  return <section className="companion-security" aria-labelledby="companion-security-title">
    <div className="companion-security-head">
      <div>
        <span className="eyebrow">YOUR SHIELD</span>
        <h3 id="companion-security-title">See where protected actions stop.</h3>
        <p>Simple version: I can guide you, but I cannot jump past the guard and act on a protected system by myself.</p>
      </div>
      <button type="button" className={blocked ? 'is-blocked' : ''} onClick={() => setMode(blocked ? 'safe' : 'blocked')}>
        {blocked ? 'Show safe path' : 'Try a blocked path'}
      </button>
    </div>

    <div className={`security-path ${blocked ? 'blocked' : 'safe'}`} role="img" aria-label={blocked ? 'A blocked attempt cannot bypass the guard' : 'A safe request passes from you through the companion and guard to a bounded system and receipt'}>
      {nodes.map((node, index) => <div className="security-node-wrap" key={node.id}>
        <motion.article
          className={`security-node node-${node.id} ${blocked && node.id === 'guard' ? 'is-stop' : ''}`}
          initial={reduceMotion ? false : { opacity: 0, y: 8, scale: .96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reduceMotion ? 0 : index * .055 }}
        >
          <span>{node.short}</span>
          <strong>{node.label}</strong>
          <small>{node.detail}</small>
        </motion.article>
        {index < nodes.length - 1 && <span className="security-link" aria-hidden="true">→</span>}
      </div>)}

      <AnimatePresence>
        {blocked && <motion.div
          className="breach-attempt"
          initial={reduceMotion ? false : { opacity: 0, scaleX: .4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .3 }}
          aria-hidden="true"
        >
          <span>INVALID BYPASS</span><b>×</b>
        </motion.div>}
      </AnimatePresence>
    </div>

    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        className={`security-result ${blocked ? 'blocked' : 'safe'}`}
        initial={reduceMotion ? false : { opacity: 0, y: 7 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        aria-live="polite"
      >
        <img src={blocked ? '/assets/security/guard-shield.svg' : '/assets/security/receipt-sigil.svg'} alt="" />
        <div>
          <strong>{blocked ? 'Blocked here. The protected action did not run.' : 'Safe path. The system acts only after the guard allows it.'}</strong>
          <span>{blocked ? 'This is an educational trust-boundary demonstration, not a penetration-test result.' : 'A receipt comes back so the interface can distinguish routing from real execution.'}</span>
        </div>
      </motion.div>
    </AnimatePresence>

    <details className="security-details">
      <summary>Show the technical boundary</summary>
      <p>KHELOS / THARI-style validation and permission policy sit at the guard boundary. Browser UI never receives long-lived provider secrets. This public visual deliberately omits credentials, private addresses and exploit instructions.</p>
    </details>
  </section>;
}
