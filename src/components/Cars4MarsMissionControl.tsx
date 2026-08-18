import { motion } from 'framer-motion';
import { RoverMechanismExplorer } from './RoverMechanismExplorer';
import { RoverVisual } from './RoverVisual';

export type Cars4MarsFocus = 'overview' | 'ledger' | 'architecture' | 'media' | 'support';

const states = [
  ['DESIGNED', 'LOCKED', 'DFR-01 submission completed 02 Aug 2026. P-001 refines a bounded wheel interface without rewriting the baseline.', 'verified'],
  ['FUNDED', 'PENDING EVIDENCE', 'Funding discussion is not a funding instrument.', 'pending'],
  ['ORDERED', 'NO ORDER EVIDENCE', 'Advance only on PO, invoice or verified donor commitment.', 'blocked'],
  ['ASSEMBLED', 'NOT STARTED', 'P-001 wheel dimensioning is active design work; no fabricated wheel or assembled rover is claimed.', 'blocked'],
  ['TESTED', 'NOT STARTED', 'Software/simulation evidence exists separately; physical mobility advances only on measured test evidence.', 'blocked'],
] as const;

const ledger = [
  ['2026-08-02', 'DESIGN', 'Submission complete', 'DFR-01 delivered to the Cars4Mars organisers. Website delivery is not a release dependency.', 'verified'],
  ['2026-08-09', 'WEB', 'Mission surface reopened', 'Cars4Mars moved from report remediation back to public build, media, architecture and backing work.', 'verified'],
  ['2026-08-15', 'SOFTWARE', 'Deterministic control evidence recorded', 'Host-side and native embedded-core tests passed in the engineering repository. This remains software evidence, not rover mobility evidence.', 'verified'],
  ['2026-08-18', 'MECHANICAL', 'P-001 wheel interface opened', 'At 19:17 SAST the physical-build transition was bounded to one 250 mm wheel interface. HPI d-school lab access and LightBurn 2 are facility context only; generated axle/wheel boards are design references only.', 'pending'],
  ['NEXT', 'P-001A', 'Dimension before fabrication', 'Capture the rough sketch plus front, side and top/section views; then define wheel width, hub face, centre bore, bolt pattern, tread pockets, material and actual process before releasing a coupon.', 'pending'],
] as const;

const architecture = [
  ['DRIVE', '6 × Rhino IG52 · 24 V · 60 rpm · 100 W', 'Passive rocker-bogie, six-wheel skid steer.'],
  ['CONTROL', 'Teensy 4.1 + 3 × Cytron MDDS30', 'Deterministic motor and safety authority remains local.'],
  ['PERCEPTION', 'Jetson Orin Nano Super + RealSense D455 + RPLIDAR A2M12', 'Perception may request bounded velocity; it does not bypass the safety controller.'],
  ['POWER', '24 V · 20 Ah LiFePO4 · 480 Wh', 'BMS, 60 A master fuse, contactor, E-stop and separate logic rails.'],
  ['COMMS', 'Local Wi-Fi + RFM95W LoRa heartbeat', 'No cloud required for driving. LoRa carries heartbeat/fail-stop, not video commands.'],
  ['GOVERNANCE', 'KC receives state/evidence copies only', 'No LLM or cloud service has actuation authority.'],
] as const;

const competitionFacts = [
  ['CHALLENGE', 'Design + build a small mobile Mars rover prototype'],
  ['CONTROL', 'Wireless operation + independent battery power'],
  ['FORMAT', 'Launch Stage online → Mars Stage in Johannesburg'],
  ['ENVELOPE', '≤ 80 cm × 80 cm footprint · ≤ 40 kg'],
  ['RANGE', 'Up to 80 m from the command station'],
  ['MISSIONS', 'Traversal + autonomous perception/navigation'],
  ['VISION', 'Hammer · tennis ball · traffic cone'],
  ['BALLOONS', 'Black → white → pink → yellow → blue'],
] as const;

const visualReferences = [
  ['/assets/cars4mars/rover-open-concept.jpg', 'OPEN SYSTEMS VIEW', 'Supplied concept visualisation of the rover with the electronics bay exposed.', 'Design reference · not physical build evidence.'],
  ['/assets/cars4mars/rover-field-concept.jpg', 'FIELD CONCEPT', 'Supplied concept visualisation of the rover in a Mars-like field setting.', 'Design reference · not physical build evidence.'],
] as const;

const featuredVideo = '01exG-aWj6g';

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
        <div className="mission-section-head"><span className="eyebrow">CURRENT MISSION STATE · 18 AUG 2026</span><h2>DFR-01 locked. P-001 wheel interface active.</h2><p>Current mechanical state: generated concept → dimensioning. No wheel, axle, rocker-bogie assembly or rover is promoted to fabricated/tested until a dated physical receipt exists.</p></div>
        <div className="mission-state-grid">{states.map(([name, state, evidence, tone], index) => <motion.article key={name} className={`mission-state ${tone}`} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.05}}><span>{String(index + 1).padStart(2,'0')}</span><b>{name}</b><strong>{state}</strong><p>{evidence}</p></motion.article>)}</div>
      </section>

      <section className="competition-brief">
        <div className="competition-rover"><RoverVisual/></div>
        <div><span className="eyebrow">THE CHALLENGE · ON THIS PAGE</span><h2>What the rover must actually do.</h2><div className="competition-facts">{competitionFacts.map(([label,value])=><article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div></div>
      </section>

      <RoverMechanismExplorer />

      <section className="visual-reference-section" aria-label="Cars4Mars design reference visuals">
        <div className="mission-section-head"><span className="eyebrow">DESIGN REFERENCE · NOT VALIDATION EVIDENCE</span><h2>Keep the target rover visible.</h2><p>These supplied concept visuals keep the intended rover shape present while the ledger stays honest: they are design references, not proof of assembly or testing.</p></div>
        <div className="visual-reference-grid">{visualReferences.map(([src, label, alt, note]) => <figure key={src} className="visual-reference-card"><img src={src} alt={alt} loading="lazy" decoding="async" sizes="(max-width: 760px) 100vw, 50vw" /><figcaption><strong>{label}</strong><span>{note}</span></figcaption></figure>)}</div>
      </section>

      <section className="next-gate-panel"><div><span className="eyebrow">NEXT PHYSICAL GATE · P-001A</span><h2>Wheel/hub dimensions → fit coupon → tread coupon → first wheel prototype.</h2></div><div className="gate-meta"><span>ACCEPTANCE</span><strong>ROUGH SKETCH + 3 VIEWS + DIMENSIONED INTERFACE + COUPON RECEIPT</strong></div></section>
    </>}

    {focus === 'architecture' && <RoverMechanismExplorer />}

    {showLedger && <section id="ledger" className="ledger-section">
      <div className="mission-section-head"><span className="eyebrow">OPEN BUILD LEDGER</span><h2>Transitions only.</h2></div>
      <div className="cars-ledger">{ledger.map(([date, lane, title, detail, tone]) => <article key={`${date}-${title}`} className={`cars-ledger-entry ${tone}`}><time>{date}</time><span>{lane}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
    </section>}

    {showArchitecture && <section id="architecture" className="architecture-section"><div className="mission-section-head"><span className="eyebrow">ROVER ARCHITECTURE</span><h2>Bounded intelligence. Deterministic safety.</h2></div><div className="architecture-grid">{architecture.map(([name, spec, rule]) => <article key={name}><span>{name}</span><strong>{spec}</strong><p>{rule}</p></article>)}</div></section>}

    {showMedia && <section id="media" className="media-section">
      <div className="mission-section-head"><span className="eyebrow">MEDIA CONTROL</span><h2>Watch the work.</h2></div>
      <div className="media-control-grid">
        <a className="media-control-card live" href={`${channel}/live`} target="_blank" rel="noreferrer"><span>LIVE</span><strong>Kopano Labs live</strong><b>OPEN ↗</b></a>
        <a className="media-control-card" href={`${channel}/videos`} target="_blank" rel="noreferrer"><span>UPLOADS</span><strong>Build footage</strong><b>OPEN ↗</b></a>
        <a className="media-control-card" href={`${channel}/shorts`} target="_blank" rel="noreferrer"><span>SHORTS</span><strong>Fast updates</strong><b>OPEN ↗</b></a>
      </div>
      <div className="media-featured">
        <div><span className="eyebrow">VERIFIED RECORDED PROOF · DESIGN / DEMO</span><h3>Watch the current mission film.</h3><p>This confirmed channel upload makes the public media POC observable. It remains recorded design/demo material and does not advance the physical validation state.</p></div>
        <div className="media-video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${featuredVideo}?rel=0`} title="Cars4Mars demo video of Kopano Labs team's rover" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
      </div>
    </section>}

    {showSupport && <section id="support" className="support-section"><div className="mission-section-head"><span className="eyebrow">SUPPORT THE MISSION</span><h2>Move a gate.</h2></div><div className="support-grid">{support.map(([lane, ask, returnState]) => <article key={lane}><span>{lane}</span><h3>{ask}</h3><p>{returnState}</p></article>)}</div></section>}

    <section className="official-acknowledgement"><span className="eyebrow">CARS4MARS AFRICAN ROVER CHALLENGE</span><p>Student rover competition with online Launch Stage and in-person Mars Stage. Kopano Labs keeps the challenge context here so visitors can understand the mission without leaving this surface.</p><small>Organiser reference: cars4mars.co.za</small></section>
  </div>;
}
