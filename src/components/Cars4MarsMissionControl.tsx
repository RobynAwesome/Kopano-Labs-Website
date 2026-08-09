import { motion } from 'framer-motion';

const states = [
  ['DESIGNED', 'LOCKED', 'DFR-01 · submitted 02 Aug 2026', 'verified'],
  ['FUNDED', 'PENDING EVIDENCE', 'Funding discussion is not a funding instrument.', 'pending'],
  ['ORDERED', 'NO ORDER EVIDENCE', 'Advance only on PO, invoice or verified donor commitment.', 'blocked'],
  ['ASSEMBLED', 'NOT STARTED', 'Advance on dated assembly record and configuration evidence.', 'blocked'],
  ['TESTED', 'NOT STARTED', 'Advance on continuous footage, measurements and pass/fail record.', 'blocked'],
] as const;

const architecture = [
  ['DRIVE', '6 × Rhino IG52 · 24 V · 60 rpm · 100 W', 'Passive rocker-bogie, six-wheel skid steer.'],
  ['CONTROL', 'Teensy 4.1 + 3 × Cytron MDDS30', 'Deterministic motor and safety authority remains local.'],
  ['PERCEPTION', 'Jetson Orin Nano Super + RealSense D455 + RPLIDAR A2M12', 'Perception may request bounded velocity; it does not bypass the safety controller.'],
  ['POWER', '24 V · 20 Ah LiFePO4 · 480 Wh', 'BMS, 60 A master fuse, contactor, E-stop and separate logic rails.'],
  ['COMMS', 'Local Wi-Fi + RFM95W LoRa heartbeat', 'No cloud required for driving. LoRa carries heartbeat/fail-stop, not video commands.'],
  ['GOVERNANCE', 'KC receives state/evidence copies only', 'No LLM or cloud service has actuation authority.'],
] as const;

const support = [
  ['EQUIPMENT', 'Fund or supply a named BOM item', 'Contribution → verification → logistics → dated ledger credit.'],
  ['FUNDING', 'Fund a complete physical gate', 'Amount and scope stay tied to purchase evidence and the resulting validation state.'],
  ['ENGINEERING', 'Review mechanics, power, safety, comms or vision', 'Session output becomes a decision record, not an invisible consultation.'],
  ['FACILITIES', 'Workshop, test ground, storage, transport or power', 'Access conditions and work performed are recorded against the gate.'],
  ['MEDIA + EDUCATION', 'Document the build or host a learning session', 'Every public output routes back to the canonical mission record.'],
] as const;

export function Cars4MarsMissionControl() {
  return <div className="mission-control">
    <section className="mission-status" aria-label="Cars4Mars mission status">
      <div className="mission-section-head"><span className="eyebrow">CURRENT MISSION STATE</span><h2>Design is evidence. Hardware still has to earn the rest.</h2></div>
      <div className="mission-state-grid">{states.map(([name, state, evidence, tone], index) => <motion.article key={name} className={`mission-state ${tone}`} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.05}}><span>{String(index + 1).padStart(2,'0')}</span><b>{name}</b><strong>{state}</strong><p>{evidence}</p></motion.article>)}</div>
    </section>

    <section className="next-gate-panel"><div><span className="eyebrow">NEXT PHYSICAL GATE · DFR-01</span><h2>Funding, orders, frame, drive and protected power.</h2><p>Release evidence: approved orders plus loaded forward/reverse, turn and emergency-stop evidence. Design intent does not advance this gate.</p></div><div className="gate-meta"><span>DUE WINDOW</span><strong>03–10 AUG 2026</strong><span>ACCEPTANCE</span><strong>ORDERS + LOADED DRIVE + TURN + E-STOP</strong></div></section>

    <section className="mission-module-grid">
      <article className="mission-module report-module"><span className="eyebrow">FINAL DESIGN REPORT</span><h3>DFR-01 · verified public artifact.</h3><p>The six-page report submitted on 02 August 2026 is the authoritative design baseline. Procurement, fabrication, integration and physical testing remain explicitly unverified inside the report.</p><a href="/reports/KOPANO_LABS.pdf" target="_blank" rel="noreferrer">Read the Final Design Report ↗</a><div className="artifact-state"><i /> VERIFIED · SHA-256 42842e59…86840855</div></article>
      <article className="mission-module watch-module"><span className="eyebrow">WATCH</span><a className="video-poster" href="https://youtube.com/@kopanolabs" target="_blank" rel="noreferrer" aria-label="Open Kopano Labs video channel"><img src="/assets/cars4mars/video-mission-poster.svg" alt="Cars4Mars watch the evidence video poster" /><span>Open video channel ↗</span></a><h3>Video is evidence media, not the truth database.</h3><p>The mission page stays canonical. Submission and future test footage open through the verified Kopano Labs channel until a specific embeddable video ID is registered in the evidence ledger.</p></article>
    </section>

    <section className="architecture-section"><div className="mission-section-head"><span className="eyebrow">ROVER ARCHITECTURE</span><h2>Bounded intelligence. Deterministic safety.</h2></div><div className="architecture-grid">{architecture.map(([name, spec, rule]) => <article key={name}><span>{name}</span><strong>{spec}</strong><p>{rule}</p></article>)}</div></section>

    <section className="support-section"><div className="mission-section-head"><span className="eyebrow">SUPPORT THE MISSION</span><h2>Move a gate, not a vanity metric.</h2><p>Every contribution has to terminate in equipment, funding, expertise, facilities, documentation or learning that advances a recorded gate.</p></div><div className="support-grid">{support.map(([lane, ask, returnState]) => <article key={lane}><span>{lane}</span><h3>{ask}</h3><p>{returnState}</p></article>)}</div></section>

    <section className="official-acknowledgement"><span className="eyebrow">OFFICIAL ACKNOWLEDGEMENT</span><p>Kopano Labs is participating in the <strong>Cars4Mars African Rover Challenge</strong>, described in the programme material as the only competition of its kind in Africa and the MENA region.</p><a href="https://www.cars4mars.co.za" target="_blank" rel="noreferrer">Visit the official Cars4Mars site ↗</a></section>
  </div>;
}
