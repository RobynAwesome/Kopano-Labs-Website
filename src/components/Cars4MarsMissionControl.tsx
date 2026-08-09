import { motion } from 'framer-motion';

export type Cars4MarsFocus = 'overview' | 'ledger' | 'architecture' | 'media' | 'support';

const states = [
  ['DESIGNED', 'LOCKED', 'Design submission completed 02 Aug 2026.', 'verified'],
  ['FUNDED', 'PENDING EVIDENCE', 'Funding discussion is not a funding instrument.', 'pending'],
  ['ORDERED', 'NO ORDER EVIDENCE', 'Advance only on PO, invoice or verified donor commitment.', 'blocked'],
  ['ASSEMBLED', 'NOT STARTED', 'Advance on dated assembly record and configuration evidence.', 'blocked'],
  ['TESTED', 'NOT STARTED', 'Advance on continuous footage, measurements and pass/fail record.', 'blocked'],
] as const;

const ledger = [
  ['2026-08-02', 'DESIGN', 'Submission complete', 'DFR-01 delivered to the Cars4Mars organisers. Website delivery is not a release dependency.', 'verified'],
  ['2026-08-09', 'WEB', 'Report gate retracted', 'The obsolete PDF reconstruction and Google Drive delivery path were removed from production, crawl policy and CI.', 'verified'],
  ['NEXT', 'PHYSICAL', 'Funding + procurement gate', 'Advance only when funding instruments, orders and the resulting physical evidence exist.', 'pending'],
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
  ['MEDIA + EDUCATION', 'Document the build or host a learning session', 'Every public output routes back to the mission record.'],
] as const;

const channel = 'https://youtube.com/@kopanolabs';

const nav = [
  ['overview', '/Cars4Mars/', 'Mission'],
  ['ledger', '/Cars4Mars/Ledger/', 'Ledger'],
  ['architecture', '/Cars4Mars/Architecture/', 'Architecture'],
  ['media', '/Cars4Mars/Media/', 'Watch'],
  ['support', '/Cars4Mars/Support/', 'Support'],
] as const;

export function Cars4MarsMissionControl({ focus = 'overview' }: { focus?: Cars4MarsFocus }) {
  const overview = focus === 'overview';
  const showLedger = overview || focus === 'ledger';
  const showArchitecture = overview || focus === 'architecture';
  const showMedia = overview || focus === 'media';
  const showSupport = overview || focus === 'support';

  return <div className="mission-control">
    <nav className="mission-nav" aria-label="Cars4Mars mission control sections">
      {nav.map(([id, href, label]) => <a key={id} href={href} className={focus === id ? 'active' : undefined} aria-current={focus === id ? 'page' : undefined}>{label}</a>)}
    </nav>

    {overview && <>
      <section id="status" className="mission-status" aria-label="Cars4Mars mission status">
        <div className="mission-section-head"><span className="eyebrow">CURRENT MISSION STATE</span><h2>Submission is complete. Hardware still has to earn the rest.</h2></div>
        <div className="mission-state-grid">{states.map(([name, state, evidence, tone], index) => <motion.article key={name} className={`mission-state ${tone}`} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.05}}><span>{String(index + 1).padStart(2,'0')}</span><b>{name}</b><strong>{state}</strong><p>{evidence}</p></motion.article>)}</div>
      </section>

      <section className="next-gate-panel"><div><span className="eyebrow">NEXT PHYSICAL GATE</span><h2>Funding, orders, frame, drive and protected power.</h2><p>Release evidence: approved orders plus loaded forward/reverse, turn and emergency-stop evidence. Design intent does not advance this gate.</p></div><div className="gate-meta"><span>DUE WINDOW</span><strong>OPEN — EVIDENCE DRIVEN</strong><span>ACCEPTANCE</span><strong>ORDERS + LOADED DRIVE + TURN + E-STOP</strong></div></section>
    </>}

    {showLedger && <section id="ledger" className="ledger-section">
      <div className="mission-section-head"><span className="eyebrow">OPEN BUILD LEDGER</span><h2>What changed, what is proven, what comes next.</h2><p>The ledger records transitions. It does not manufacture progress between evidence events.</p></div>
      <div className="cars-ledger">{ledger.map(([date, lane, title, detail, tone]) => <article key={`${date}-${title}`} className={`cars-ledger-entry ${tone}`}><time>{date}</time><span>{lane}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
    </section>}

    {overview && <section className="mission-module-grid">
      <article className="mission-module report-module"><span className="eyebrow">DESIGN SUBMISSION</span><h3>Submitted. Closed. No longer a website dependency.</h3><p>The competition has the submitted design package. KopanoLabs.com now tracks what happens after submission: funding, procurement, assembly, testing, failures and verified physical progress.</p><div className="artifact-state"><i /> SUBMISSION COMPLETE · 02 AUG 2026</div></article>
      <article className="mission-module watch-module"><span className="eyebrow">WATCH THE BUILD</span><h3>One channel. Live work and uploads stay attached to the mission.</h3><p>The public site remains the evidence map; YouTube carries the moving image. Use the live and upload lanes to inspect current media without treating video alone as proof.</p><div className="media-actions"><a href={`${channel}/live`} target="_blank" rel="noreferrer">Live channel ↗</a><a href={`${channel}/videos`} target="_blank" rel="noreferrer">Latest uploads ↗</a><a href={`${channel}/shorts`} target="_blank" rel="noreferrer">Shorts ↗</a></div></article>
    </section>}

    {showArchitecture && <section id="architecture" className="architecture-section"><div className="mission-section-head"><span className="eyebrow">ROVER ARCHITECTURE</span><h2>Bounded intelligence. Deterministic safety.</h2></div><div className="architecture-grid">{architecture.map(([name, spec, rule]) => <article key={name}><span>{name}</span><strong>{spec}</strong><p>{rule}</p></article>)}</div></section>}

    {showMedia && <section id="media" className="media-section">
      <div className="mission-section-head"><span className="eyebrow">MEDIA CONTROL</span><h2>Live lane, uploads lane, evidence boundary.</h2><p>YouTube is the moving-media transport. The mission ledger remains the state authority.</p></div>
      <div className="media-control-grid">
        <a className="media-control-card live" href={`${channel}/live`} target="_blank" rel="noreferrer"><span>LIVE</span><strong>Check the Kopano Labs live channel</strong><p>If a live stream is active, this lane resolves directly to it. If not, YouTube shows the channel live surface.</p><b>OPEN LIVE ↗</b></a>
        <a className="media-control-card" href={`${channel}/videos`} target="_blank" rel="noreferrer"><span>UPLOADS</span><strong>Newest build footage</strong><p>Submission media, future tests, failures and progress footage remain discoverable through the channel upload feed.</p><b>OPEN UPLOADS ↗</b></a>
        <a className="media-control-card" href={channel} target="_blank" rel="noreferrer"><span>CHANNEL</span><strong>@kopanolabs</strong><p>Use the channel as the persistent video identity while KopanoLabs.com remains the public mission map.</p><b>OPEN CHANNEL ↗</b></a>
      </div>
    </section>}

    {showSupport && <section id="support" className="support-section"><div className="mission-section-head"><span className="eyebrow">SUPPORT THE MISSION</span><h2>Move a gate, not a vanity metric.</h2><p>Every contribution has to terminate in equipment, funding, expertise, facilities, documentation or learning that advances a recorded gate.</p></div><div className="support-grid">{support.map(([lane, ask, returnState]) => <article key={lane}><span>{lane}</span><h3>{ask}</h3><p>{returnState}</p></article>)}</div></section>}

    <section className="official-acknowledgement"><span className="eyebrow">OFFICIAL ACKNOWLEDGEMENT</span><p>Kopano Labs is participating in the <strong>Cars4Mars African Rover Challenge</strong>, described in the programme material as the only competition of its kind in Africa and the MENA region.</p><a href="https://www.cars4mars.co.za" target="_blank" rel="noreferrer">Visit the official Cars4Mars site ↗</a></section>
  </div>;
}
