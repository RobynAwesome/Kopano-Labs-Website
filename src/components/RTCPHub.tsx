import { Float, Line } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import * as THREE from 'three';
import { companionGreeting, companionTurnForRoute } from '../companionRuntime';
import { council, routeRtcpIntent, rtcpDomains, type RtcpRoute } from '../rtcpRuntime';
import { useExperienceProfile } from '../useExperienceProfile';
import { CompanionSecurityGraph } from './CompanionSecurityGraph';
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
    <div className="rtcp-lite-table"><span>KC</span></div>
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
  const [submittedIntent, setSubmittedIntent] = useState('');
  const [route, setRoute] = useState<RtcpRoute | null>(null);
  const [running, setRunning] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const activeIds = useMemo(() => new Set(route?.council.map(member => member.id) ?? ['kc', 'khelos', 'antigravity']), [route]);
  const useLite = profile.tier === 'lite' || profile.saveData || profile.reducedMotion;
  const turn = route ? companionTurnForRoute(submittedIntent, route) : companionGreeting;

  const runIntent = async (nextIntent: string) => {
    const clean = nextIntent.trim();
    if (!clean) return;
    setRunning(true);
    setShowWhy(false);
    setSubmittedIntent(clean);
    const next = await routeRtcpIntent(clean);
    setRoute(next);
    setRunning(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await runIntent(intent);
  };

  const selectedDomain = route?.domain ?? rtcpDomains[0];
  const connected = route?.receipt.adapterId === 'kpgs.rtcp.vercel.route';
  const transportMessage = !route
    ? 'Your companion is ready'
    : connected
      ? 'Route confirmed by the Hub'
      : 'Safe local route · no external model execution claimed';

  return <section className={`rtcp-hub companion-mode ${compact ? 'compact' : ''}`} aria-label="Kopano companion and Round Table Council">
    <div className="rtcp-copy">
      <div className="companion-intro">
        <motion.img
          src="/assets/companion/companion-orb.svg"
          alt=""
          className="companion-avatar"
          animate={profile.reducedMotion ? undefined : { y: [0, -5, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div>
          <span className="eyebrow">KOPANO COMPANION</span>
          <h2>Tell me what you're trying to do. I'll walk with you.</h2>
        </div>
      </div>
      <p>Talk normally. You do not need to know which app, AI or council seat handles the work.</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${route?.requestId ?? 'hello'}-${running}`}
          className={`companion-turn ${running ? 'is-running' : ''}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          aria-live="polite"
        >
          <span>{running ? 'COMPANION' : turn.speaker.toUpperCase()}</span>
          <strong>{running ? 'I’m checking the right lane…' : turn.message}</strong>
          {!running && route && <small>{turn.proofLine}</small>}
        </motion.div>
      </AnimatePresence>

      <form className="rtcp-intent" onSubmit={submit}>
        <label htmlFor="rtcp-intent">Talk to Kopano</label>
        <div>
          <input id="rtcp-intent" value={intent} onChange={(event) => setIntent(event.target.value)} placeholder="I need work near me… Help me with the rover…" />
          <button type="submit" disabled={running || !intent.trim()}>{running ? 'Checking…' : 'Let’s go →'}</button>
        </div>
      </form>

      <div className="rtcp-suggestions" aria-label="Things you can ask the companion">
        {['I need work near me', 'Show me the rover mission', 'Help me learn something', 'Check a crisis report'].map(example =>
          <button key={example} type="button" onClick={() => { setIntent(example); void runIntent(example); }}>{example}</button>)}
      </div>

      {route && <div className="companion-actions" aria-label="Companion next actions">
        <a href={domainHref(selectedDomain.host)} target="_blank" rel="noreferrer">{turn.actions[0]?.label ?? 'Open system'} ↗</a>
        <button type="button" onClick={() => setShowWhy(value => !value)}>{showWhy ? 'Hide why' : 'Why this route?'}</button>
        <button type="button" onClick={() => { setRoute(null); setSubmittedIntent(''); setIntent(''); setShowWhy(false); }}>Ask something else</button>
      </div>}

      <AnimatePresence>
        {route && showWhy && <motion.div className="companion-why" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <span>WHY I CHOSE THIS</span>
          <strong>{turn.routeSummary}</strong>
          <p>Goal I understood: {turn.goalSummary}. The council selected only the seats attached to this lane. This is {turn.executionClaim === 'ROUTE_ONLY' ? 'routing guidance, not a claim that an external AI or protected tool already acted.' : 'backed by the execution state shown in the receipt.'}</p>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div key={selectedDomain.id} className="rtcp-return companion-route" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <div>
            <span>{route ? 'WHERE I’M TAKING YOU' : 'FIRST LANE'}</span>
            <strong>{selectedDomain.label}</strong>
            <small>{route ? selectedDomain.state : 'I’ll choose after you tell me what you need.'}</small>
          </div>
          <div className="rtcp-return-actions">
            <b>{transportMessage}</b>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

    <div className="rtcp-stage">
      {useLite ? <LiteCouncil activeIds={activeIds} /> : <Canvas dpr={profile.tier === 'full' ? [1, 1.35] : 1} camera={{ position: [0, .45, 5.6], fov: 46 }} gl={{ alpha: true, antialias: profile.tier !== 'lite' }}>
        <CouncilWorld activeIds={activeIds} animate={!profile.reducedMotion && !profile.saveData} />
      </Canvas>}

      <div className="rtcp-stage-label companion-stage-label">
        <span>{route ? 'THE RIGHT SPECIALISTS WOKE UP' : 'YOUR COMPANION TRAVELS WITH YOU'}</span>
        <strong>{route ? `${route.council.length} specialists active behind the scene` : 'One companion in front · council behind'}</strong>
        <small>{transportMessage}</small>
      </div>
    </div>

    <CompanionSecurityGraph />

    <details className="rtcp-details operator-details">
      <summary>Operator view · council and receipt details</summary>
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
      <div className="rtcp-details-grid">
        <article><span>1</span><strong>One request</strong><p>The companion receives the user's goal once.</p></article>
        <article><span>2</span><strong>Guarded route</strong><p>RTCP selects the required domain and council seats without granting new authority.</p></article>
        <article><span>3</span><strong>Existing system</strong><p>The target product keeps its state, UX and local agents.</p></article>
        <article><span>4</span><strong>Receipt before claim</strong><p>A route is not model/tool execution. The receipt must say what actually happened.</p></article>
      </div>
      {route && <p className="operator-receipt">Receipt: {route.receipt.adapterId} · {route.receipt.outcome} · {route.execution.mode}</p>}
    </details>
  </section>;
}
