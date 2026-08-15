import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type MechanismId = 'payload' | 'mobility' | 'perception' | 'power';

const mechanisms: readonly {
  id: MechanismId;
  index: string;
  label: string;
  summary: string;
  facts: readonly string[];
}[] = [
  {
    id: 'payload', index: '01', label: 'Payload transport',
    summary: 'A retained top tray carries the competition item while the battery stays low in the chassis to protect centre-of-mass stability.',
    facts: ['1 kg target payload', 'Positive tray retention', 'Low battery bay', 'Clear load / unload access'],
  },
  {
    id: 'mobility', index: '02', label: 'Rocker-bogie mobility',
    summary: 'Six driven wheels and passive articulation keep wheel contact across uneven terrain without giving software control over the mechanical safety envelope.',
    facts: ['6 × driven wheels', 'Passive articulation', 'Skid-steer authority', 'Loaded turn + E-stop gate'],
  },
  {
    id: 'perception', index: '03', label: 'Perception envelope',
    summary: 'Camera and LiDAR share the mast. The perception computer may request bounded motion; the local safety controller remains authoritative.',
    facts: ['RealSense D455', 'RPLIDAR A2M12', 'Hammer / ball / cone', 'Local safety authority'],
  },
  {
    id: 'power', index: '04', label: 'Power + fail-stop',
    summary: 'The 24 V battery feeds protected drive power and isolated logic rails through a master fuse, contactor and physical emergency stop.',
    facts: ['24 V · 20 Ah LiFePO4', '60 A master fuse', 'Contactor + E-stop', 'Separate logic rails'],
  },
] as const;

function PayloadDiagram() {
  return <svg viewBox="0 0 760 430" role="img" aria-label="Payload tray and low battery layout schematic">
    <path className="construct-grid" d="M40 80H720M40 160H720M40 240H720M40 320H720M120 40V390M240 40V390M360 40V390M480 40V390M600 40V390" />
    <path className="construct-body" d="M150 230H610L575 315H185Z" />
    <rect className="construct-battery" x="255" y="250" width="250" height="48" rx="10" />
    <text x="292" y="280">24 V BATTERY · LOW BAY</text>
    <rect className="construct-tray" x="235" y="167" width="290" height="42" rx="8" />
    <path className="construct-rail" d="M245 160V135H515V160" />
    <rect className="construct-payload" x="325" y="95" width="110" height="66" rx="10" />
    <text x="350" y="123">1 KG</text><text x="338" y="144">PAYLOAD</text>
    <path className="construct-arrow" d="M380 75V44M365 59L380 44L395 59" />
    <text className="construct-callout" x="414" y="54">LOAD / UNLOAD</text>
    <path className="construct-arrow" d="M535 186H675M661 172L675 186L661 200" />
    <text className="construct-callout" x="545" y="168">POSITIVE RETENTION</text>
    <circle className="construct-cog" cx="380" cy="276" r="11" /><path className="construct-cog" d="M380 251V301M355 276H405" />
    <text className="construct-callout" x="410" y="287">LOW CENTRE OF MASS</text>
    {[210, 380, 550].map((x) => <g key={x}><circle className="construct-wheel" cx={x} cy="335" r="34" /><circle className="construct-hub" cx={x} cy="335" r="13" /></g>)}
  </svg>;
}

function MobilityDiagram() {
  return <svg viewBox="0 0 760 430" role="img" aria-label="Six wheel passive articulation and terrain contact schematic">
    <path className="construct-grid" d="M40 80H720M40 160H720M40 240H720M40 320H720M120 40V390M240 40V390M360 40V390M480 40V390M600 40V390" />
    <path className="construct-terrain" d="M50 344C115 328 143 364 202 346C265 326 294 286 355 305C412 323 455 364 515 346C584 325 632 285 710 304" />
    <rect className="construct-body" x="195" y="148" width="370" height="92" rx="18" />
    <path className="construct-link" d="M230 236L180 310L355 284L520 315L555 236M355 236V284" />
    {[[175,318],[355,293],[525,322]].map(([x,y]) => <g key={`${x}-${y}`}><circle className="construct-wheel" cx={x} cy={y} r="39" /><circle className="construct-hub" cx={x} cy={y} r="14" /></g>)}
    <path className="construct-arrow" d="M115 126H270M256 112L270 126L256 140" /><text className="construct-callout" x="92" y="107">PASSIVE ROCKER MOTION</text>
    <path className="construct-arrow" d="M586 178H686M672 164L686 178L672 192" /><text className="construct-callout" x="575" y="153">BODY STAYS INSIDE ENVELOPE</text>
    <path className="construct-contact" d="M150 365H200M330 340H380M500 370H550" />
    <text className="construct-callout" x="278" y="396">WHEEL CONTACT IS THE MECHANISM</text>
  </svg>;
}

function PerceptionDiagram() {
  return <svg viewBox="0 0 760 430" role="img" aria-label="Camera and LiDAR perception envelope schematic">
    <path className="construct-grid" d="M40 80H720M40 160H720M40 240H720M40 320H720M120 40V390M240 40V390M360 40V390M480 40V390M600 40V390" />
    <rect className="construct-body" x="285" y="180" width="190" height="125" rx="22" />
    <rect className="construct-sensor" x="332" y="134" width="96" height="38" rx="10" />
    <circle className="construct-lidar" cx="380" cy="150" r="72" /><circle className="construct-lidar" cx="380" cy="150" r="118" />
    <path className="construct-fov" d="M345 148L88 70V228Z" />
    <text className="construct-callout" x="74" y="54">D455 CAMERA ENVELOPE</text>
    <text className="construct-callout" x="435" y="83">360° LIDAR</text>
    <g transform="translate(106 270)"><rect className="construct-target" x="0" y="0" width="95" height="48" rx="12" /><text x="20" y="30">HAMMER</text></g>
    <g transform="translate(530 252)"><circle className="construct-target" cx="35" cy="35" r="35" /><text x="11" y="40">BALL</text></g>
    <g transform="translate(590 330)"><path className="construct-target" d="M10 50L38 0L66 50Z" /><text x="4" y="74">CONE</text></g>
    <path className="construct-arrow" d="M380 315V382M366 368L380 382L394 368" /><text className="construct-callout" x="407" y="374">BOUNDED VELOCITY REQUEST</text>
  </svg>;
}

function PowerDiagram() {
  const blocks = [
    [70, 105, 140, 64, '24 V · 20 Ah', 'LiFePO4'],
    [260, 105, 120, 64, '60 A', 'MASTER FUSE'],
    [430, 105, 145, 64, 'CONTACTOR', '+ E-STOP'],
    [610, 105, 100, 64, 'DRIVE', 'BUS'],
    [430, 270, 145, 64, 'DC / DC', 'LOGIC RAILS'],
    [610, 270, 100, 64, 'TEENSY', '+ JETSON'],
  ] as const;
  return <svg viewBox="0 0 760 430" role="img" aria-label="Protected rover power distribution and emergency stop schematic">
    <path className="construct-grid" d="M40 80H720M40 160H720M40 240H720M40 320H720M120 40V390M240 40V390M360 40V390M480 40V390M600 40V390" />
    {blocks.map(([x,y,w,h,a,b]) => <g key={`${x}-${y}`}><rect className="construct-block" x={x} y={y} width={w} height={h} rx="14" /><text x={x + 16} y={y + 27}>{a}</text><text className="construct-callout" x={x + 16} y={y + 47}>{b}</text></g>)}
    <path className="construct-power" d="M210 137H260M380 137H430M575 137H610" />
    <path className="construct-power" d="M502 169V270M575 302H610" />
    <path className="construct-arrow" d="M694 205V232M680 218L694 232L708 218" /><text className="construct-callout" x="590" y="204">3 × MDDS30 → 6 MOTORS</text>
    <circle className="construct-stop" cx="502" cy="214" r="28" /><text x="483" y="220">STOP</text>
    <text className="construct-callout" x="74" y="70">PROTECTED ENERGY PATH · HARDWARE FAIL-STOP</text>
    <text className="construct-callout" x="426" y="363">LOGIC POWER IS SEPARATED FROM MOTOR POWER</text>
  </svg>;
}

function MechanismDiagram({ id }: { id: MechanismId }) {
  if (id === 'mobility') return <MobilityDiagram />;
  if (id === 'perception') return <PerceptionDiagram />;
  if (id === 'power') return <PowerDiagram />;
  return <PayloadDiagram />;
}

export function RoverMechanismExplorer() {
  const [active, setActive] = useState<MechanismId>('payload');
  const selected = mechanisms.find((mechanism) => mechanism.id === active) ?? mechanisms[0];

  return <section className="mechanism-explorer" aria-label="Interactive Cars4Mars rover mechanism explorer">
    <div className="mechanism-heading">
      <div><span className="eyebrow">ROVER MECHANISMS · INTERACTIVE</span><h2>See how the design moves the mission.</h2></div>
      <p>Switch layers to inspect payload transport, mobility, perception and protected power without mixing design intent with physical build evidence.</p>
    </div>
    <div className="mechanism-shell">
      <div className="mechanism-tabs" role="tablist" aria-label="Rover mechanism layers">
        {mechanisms.map((mechanism) => <button key={mechanism.id} type="button" role="tab" aria-selected={active === mechanism.id} className={active === mechanism.id ? 'active' : ''} onClick={() => setActive(mechanism.id)}><span>{mechanism.index}</span><strong>{mechanism.label}</strong></button>)}
      </div>
      <div className="mechanism-stage">
        <AnimatePresence mode="wait">
          <motion.div key={active} className="mechanism-diagram" initial={{ opacity: 0, scale: 0.985, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.985, y: -8 }} transition={{ duration: 0.24 }}>
            <MechanismDiagram id={active} />
          </motion.div>
        </AnimatePresence>
        <div className="mechanism-copy"><span>{selected.index} · DESIGN LAYER</span><h3>{selected.label}</h3><p>{selected.summary}</p><div>{selected.facts.map((fact) => <b key={fact}>{fact}</b>)}</div></div>
      </div>
    </div>
  </section>;
}
