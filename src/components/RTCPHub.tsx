import { Float, Line } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import * as THREE from 'three';
import { council, routeRtcpIntent, rtcpDomains, type RtcpRoute } from '../rtcpRuntime';
import { useExperienceProfile } from '../useExperienceProfile';
import './rtcp-hub.css';

const seatPositions = council.map((_, index) => {
  const angle = (index / council.length) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(angle) * 2.25, Math.sin(angle) * .72, Math.sin(angle) * 1.35] as [number, number, number];
});

const seatColors = ['#ffd28a', '#ffad8c', '#82dccb', '#bf9cff', '#ff9fc8', '#7bd8ff', '#ffc56d', '#ff8d78', '#9eb6c4', '#d4efff'] as const;

function SeatGeometry({ index }: { index: number }) {
  switch (index) {
    case 0: return <icosahedronGeometry args={[.16, 1]} />;
    case 1: return <octahedronGeometry args={[.17, 0]} />;
    case 2: return <boxGeometry args={[.25, .25, .25]} />;
    case 3: return <dodecahedronGeometry args={[.16, 0]} />;
    case 4: return <torusGeometry args={[.14, .045, 8, 24]} />;
    case 5: return <coneGeometry args={[.16, .3, 6]} />;
    case 6: return <tetrahedronGeometry args={[.19, 0]} />;
    case 7: return <cylinderGeometry args={[.13, .17, .26, 8]} />;
    case 8: return <torusKnotGeometry args={[.105, .035, 32, 6, 2, 3]} />;
    default: return <sphereGeometry args={[.15, 18, 18]} />;
  }
}

function CouncilIdentity({ index, active, animate }: { index: number; active: boolean; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const color = seatColors[index % seatColors.length];

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetScale = active ? 1.26 : 1;
    const nextScale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 5.2, delta);
    group.current.scale.setScalar(nextScale);
    if (animate) {
      group.current.rotation.y += delta * (active ? .7 : .12);
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * .55 + index) * (active ? .12 : .035);
    }
  });

  return <group ref={group}>
    <mesh castShadow>
      <SeatGeometry index={index} />
      <meshStandardMaterial
        color={active ? color : '#5f7c89'}
        emissive={active ? color : '#13242d'}
        emissiveIntensity={active ? .42 : .12}
        metalness={active ? .58 : .34}
        roughness={active ? .28 : .46}
      />
    </mesh>
    {active && <>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.45}>
        <torusGeometry args={[.16, .012, 6, 28]} />
        <meshBasicMaterial color={color} transparent opacity={.52} />
      </mesh>
      <pointLight color={color} intensity={1.9} distance={1.35} />
    </>}
  </group>;
}

function CouncilWorld({ activeIds, animate }: { activeIds: Set<string>; animate: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!animate || !group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * .12, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * .05, 4, delta);
  });

  return <group ref={group}>
    <ambientLight intensity={1.15} color="#ffe6c7" />
    <directionalLight position={[4, 5, 5]} intensity={3.2} color="#ffd09a" />
    <pointLight position={[0, 0, 2]} intensity={10} distance={8} color="#63d5ff" />

    <Float speed={animate ? .55 : 0} floatIntensity={animate ? .1 : 0}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.28, 1.28, .16, 48]} />
        <meshStandardMaterial color="#172a34" metalness={.42} roughness={.52} />
      </mesh>
      <mesh position={[0, .11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.98, .035, 12, 64]} />
        <meshStandardMaterial color="#e8b266" emissive="#5a3517" emissiveIntensity={.5} metalness={.7} roughness={.28} />
      </mesh>
      <mesh position={[0, .17, 0]}>
        <sphereGeometry args={[.24, 24, 24]} />
        <meshStandardMaterial color="#f4c879" emissive="#6b4518" emissiveIntensity={.62} metalness={.5} roughness={.28} />
      </mesh>
    </Float>

    {council.map((member, index) => <Float key={member.id} speed={animate ? .45 + index * .025 : 0} floatIntensity={animate ? .08 : 0}>
      <group position={seatPositions[index]}>
        <CouncilIdentity index={index} active={activeIds.has(member.id)} animate={animate} />
      </group>
    </Float>)}

    <Line points={[...seatPositions, seatPositions[0]]} color="#7fa9b9" transparent opacity={.18} lineWidth={.7} />
  </group>;
}

function LiteCouncil({ activeIds }: { activeIds: Set<string> }) {
  return <div className="rtcp-lite" aria-hidden="true">
    <div className="rtcp-lite-table"><span>RTC</span></div>
    {council.map((member, index) => <i
      key={member.id}
      className={activeIds.has(member.id) ? 'active' : ''}
      style={{ '--seat-angle': `${index * 36}deg` } as CSSProperties}
    />)}
  </div>;
}

function domainHref(host: string) {
  return host.startsWith('http') ? host : `https://${host}`;
}

export function RTCPHub({ compact = false }: { compact?: boolean }) {
  const profile = useExperienceProfile();
  const [intent, setIntent] = useState('');
  const [route, setRoute] = useState<RtcpRoute | null>(null);
  const [running, setRunning] = useState(false);
  const activeIds = useMemo(() => new Set(route?.council.map(member => member.id) ?? ['kc', 'khelos', 'antigravity']), [route]);
  const useLite = profile.tier === 'lite' || profile.saveData || profile.reducedMotion;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setRunning(true);
    const next = await routeRtcpIntent(intent);
    setRoute(next);
    setRunning(false);
  };

  const selectedDomain = route?.domain ?? rtcpDomains[0];
  const connected = route?.receipt.adapterId === 'kpgs.rtcp.vercel.route';
  const transportMessage = !route
    ? 'Ready for one request'
    : connected
      ? 'Hub connected · council route confirmed'
      : 'Local council map · Hub transport is not reachable yet';

  return <section className={`rtcp-hub ${compact ? 'compact' : ''}`} aria-label="Round Table Council operating hub">
    <div className="rtcp-copy">
      <span className="eyebrow">KOPANO SOVEREIGN HUB · ROUND TABLE</span>
      <h2>One request. One council. The right system wakes up.</h2>
      <p>You should not have to know which AI, app or department to talk to. Tell Kopano what you need. The council routes the work and keeps each product in its own lane.</p>

      <form className="rtcp-intent" onSubmit={submit}>
        <label htmlFor="rtcp-intent">What do you need?</label>
        <div>
          <input id="rtcp-intent" value={intent} onChange={(event) => setIntent(event.target.value)} placeholder="Find work, review a rover decision, help a learner, check a system…" />
          <button type="submit" disabled={running}>{running ? 'Council routing…' : 'Ask the council →'}</button>
        </div>
      </form>

      <div className="rtcp-suggestions" aria-label="Example council requests">
        {['I need work near me', 'Review our rover architecture', 'Help scale the company AI', 'Check a crisis report'].map(example =>
          <button key={example} type="button" onClick={() => setIntent(example)}>{example}</button>)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selectedDomain.id} className="rtcp-return" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <div>
            <span>{route ? 'COUNCIL ROUTE' : 'READY'}</span>
            <strong>{selectedDomain.label}</strong>
            <small>{selectedDomain.host} · {selectedDomain.state}</small>
          </div>
          <div className="rtcp-return-actions">
            <b>{selectedDomain.integration === 'ADAPT_EXISTING' ? 'Existing system preserved' : selectedDomain.integration}</b>
            {route && <a href={domainHref(selectedDomain.host)} target="_blank" rel="noreferrer">Open system ↗</a>}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

    <div className="rtcp-stage">
      {useLite ? <LiteCouncil activeIds={activeIds} /> : <Canvas dpr={profile.tier === 'full' ? [1, 1.35] : 1} camera={{ position: [0, .45, 5.6], fov: 46 }} gl={{ alpha: true, antialias: profile.tier !== 'lite' }}>
        <CouncilWorld activeIds={activeIds} animate={!profile.reducedMotion && !profile.saveData} />
      </Canvas>}

      <div className="rtcp-stage-label">
        <span>ROUND TABLE COUNCIL</span>
        <strong>{route ? `${route.council.length} seats active` : 'Standing council'}</strong>
        <small>{transportMessage}{route ? ' · external AI provider not attached' : ''}</small>
      </div>
    </div>

    <div className="rtcp-seat-strip" aria-label="Round Table Council members">
      {council.map((member, index) => <motion.article
        key={member.id}
        className={activeIds.has(member.id) ? 'active' : ''}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(index * .035, .24) }}
      >
        <span>{String(member.seat).padStart(2, '0')}</span>
        <div><strong>{member.name}</strong><small>{member.title}</small></div>
      </motion.article>)}
    </div>

    <details className="rtcp-details">
      <summary>How this works</summary>
      <div className="rtcp-details-grid">
        <article><span>1</span><strong>One ingress</strong><p>Your request enters the Hub once instead of being copied across ten agents.</p></article>
        <article><span>2</span><strong>Council route</strong><p>RTCP selects only the identities needed for the decision and the correct domain lane.</p></article>
        <article><span>3</span><strong>Adapt, don’t rebuild</strong><p>The target PWA keeps its state, UX and local agents. The Hub adds governance around it.</p></article>
        <article><span>4</span><strong>Receipt before claim</strong><p>A route is not model execution. Provider, domain and evidence receipts close that gap.</p></article>
      </div>
    </details>
  </section>;
}
