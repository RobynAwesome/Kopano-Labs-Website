import { Float, Line, OrbitControls, Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { FivesArenaFeed } from './FivesArenaFeed';

export type SystemSceneId = 'context' | 'fives' | 'kasilink' | 'crisis' | 'starfall' | 'mars';

type SystemDefinition = {
  id: SystemSceneId;
  label: string;
  kicker: string;
  detail: string;
  href: string;
  state: string;
};

const systems: readonly SystemDefinition[] = [
  { id: 'context', label: 'Kopano Context', kicker: 'ORCHESTRATION', detail: 'Agent mesh, routing and proof-aware coordination.', href: 'https://kopanocontext.kopanolabs.com', state: 'RESERVED / OWNER GATE' },
  { id: 'fives', label: 'FiveS Arena', kicker: 'COMMUNITY INFRASTRUCTURE', detail: 'Live football, booking, fixtures and competition systems.', href: 'https://fivesarena.com', state: 'LIVE' },
  { id: 'kasilink', label: 'KasiLink', kicker: 'OPPORTUNITY NETWORK', detail: 'Township opportunity, service discovery and low-data routing.', href: 'https://kasilink.com', state: 'LIVE' },
  { id: 'crisis', label: 'CrisisConnect', kicker: 'FIELD INTELLIGENCE', detail: 'GPS-anchored reporting, telemetry and resilient field evidence.', href: 'https://crisisconnect.kopanolabs.com', state: 'PUBLIC LANE' },
  { id: 'starfall', label: 'Starfall Salvage', kicker: 'INTERACTIVE LAB', detail: 'Playable systems, telemetry and interface experimentation.', href: 'https://starfallsalvage.kopanolabs.com', state: 'LIVE / REWORK' },
  { id: 'mars', label: 'Cars4Mars', kicker: 'CYBER-PHYSICAL', detail: 'Rover architecture, build evidence and physical validation.', href: '/Cars4Mars/', state: 'BUILD' },
] as const;

function FootballField() {
  const ball = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ball.current) return;
    ball.current.position.x = Math.sin(state.clock.elapsedTime * .72) * 1.3;
    ball.current.position.z = Math.cos(state.clock.elapsedTime * .58) * .55;
    ball.current.rotation.x += .018;
    ball.current.rotation.z += .014;
  });
  const players = [[-1.5, -.6], [-.7, .55], [.25, -.45], [1.2, .55], [1.65, -.45], [-1.2, .4], [-.2, -.72], [.65, .68], [1.4, -.1], [.2, .18]] as const;
  return <group rotation={[-Math.PI / 2, 0, 0]}>
    <mesh receiveShadow><planeGeometry args={[5.8, 3.4]} /><meshStandardMaterial color="#0a6b3b" roughness={.92} /></mesh>
    <Line points={[[-2.7,-1.5,.02],[2.7,-1.5,.02],[2.7,1.5,.02],[-2.7,1.5,.02],[-2.7,-1.5,.02]]} color="#dffbe8" lineWidth={1.1}/>
    <Line points={[[0,-1.5,.02],[0,1.5,.02]]} color="#dffbe8" lineWidth={1}/>
    <mesh position={[0,0,.025]}><ringGeometry args={[.42,.44,48]}/><meshBasicMaterial color="#dffbe8" side={THREE.DoubleSide}/></mesh>
    {players.map(([x,y], index)=><Float key={index} speed={1 + index * .04} floatIntensity={.06}><mesh position={[x,y,.13]}><sphereGeometry args={[.105,16,16]}/><meshStandardMaterial color={index < 5 ? '#63d5ff' : '#f5a623'} roughness={.48}/></mesh></Float>)}
    <mesh ref={ball} position={[0,0,.16]}><sphereGeometry args={[.115,20,20]}/><meshStandardMaterial color="#ffffff" roughness={.58}/></mesh>
  </group>;
}

function ContextMesh() {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => [[-1.8,.7,0],[-.85,-.65,.5],[0,1.05,-.2],[.85,-.4,.45],[1.8,.72,-.1],[0,-1,.15]] as [number,number,number][], []);
  useFrame((state) => { if (group.current) group.current.rotation.y = state.clock.elapsedTime * .08; });
  return <group ref={group}>{points.map((point,index)=><Float key={index} speed={.7 + index * .06} floatIntensity={.15}><mesh position={point}><icosahedronGeometry args={[.22,1]}/><meshStandardMaterial color={index % 2 ? '#63d5ff' : '#00e676'} metalness={.45} roughness={.3}/></mesh></Float>)}<Line points={points} color="#8ee7ff" transparent opacity={.46} lineWidth={1}/></group>;
}

function KasiNetwork() {
  const nodes = [[-1.8,-.7,0],[-1.25,.65,.2],[-.3,-.15,.5],[.55,.8,.1],[1.4,-.65,.25],[1.9,.35,-.2]] as [number,number,number][];
  return <group>{nodes.map((point,index)=><group key={index} position={point}><mesh><boxGeometry args={[.38,.38,.38]}/><meshStandardMaterial color={index % 2 ? '#f5a623' : '#63d5ff'} roughness={.54}/></mesh><mesh position={[0,-.27,0]}><cylinderGeometry args={[.17,.24,.18,6]}/><meshStandardMaterial color="#182633"/></mesh></group>)}<Line points={nodes} color="#f5a623" transparent opacity={.52} lineWidth={1.2}/></group>;
}

function CrisisRadar() {
  const sweep = useRef<THREE.Group>(null);
  useFrame((_,delta)=>{ if (sweep.current) sweep.current.rotation.z -= delta * .38; });
  return <group rotation={[-.35,0,0]}><mesh><ringGeometry args={[.55,.57,64]}/><meshBasicMaterial color="#63d5ff" side={THREE.DoubleSide}/></mesh><mesh><ringGeometry args={[1.15,1.17,64]}/><meshBasicMaterial color="#63d5ff" transparent opacity={.42} side={THREE.DoubleSide}/></mesh><mesh><ringGeometry args={[1.75,1.77,64]}/><meshBasicMaterial color="#63d5ff" transparent opacity={.24} side={THREE.DoubleSide}/></mesh><group ref={sweep}><Line points={[[0,0,.02],[1.75,0,.02]]} color="#00e676" lineWidth={2}/><mesh position={[1.12,.18,.05]}><sphereGeometry args={[.12,16,16]}/><meshBasicMaterial color="#ff6b5f"/></mesh></group></group>;
}

function StarfallField() {
  const field = useRef<THREE.Group>(null);
  useFrame((state)=>{ if(field.current){field.current.rotation.y=state.clock.elapsedTime*.09;field.current.rotation.x=Math.sin(state.clock.elapsedTime*.2)*.08;} });
  const rocks = useMemo(()=>Array.from({length:14},(_,index)=>({p:[Math.sin(index*1.7)*2.1,Math.cos(index*.8)*1.2,Math.sin(index*.57)*.9] as [number,number,number],s:.12+(index%4)*.07})),[]);
  return <group ref={field}>{rocks.map((rock,index)=><mesh key={index} position={rock.p} rotation={[index*.3,index*.17,index*.11]}><dodecahedronGeometry args={[rock.s,0]}/><meshStandardMaterial color={index%3===0?'#c38cff':'#6a7f96'} metalness={.55} roughness={.4}/></mesh>)}<mesh><torusGeometry args={[1.35,.025,8,96]}/><meshBasicMaterial color="#c38cff" transparent opacity={.42}/></mesh></group>;
}

function MarsRig() {
  const rover = useRef<THREE.Group>(null);
  useFrame((state)=>{ if(rover.current) rover.current.rotation.y=Math.sin(state.clock.elapsedTime*.35)*.2; });
  return <group ref={rover} rotation={[0,-.35,0]}><mesh position={[0,.15,0]}><boxGeometry args={[1.65,.38,1]}/><meshStandardMaterial color="#d6a84c" metalness={.52} roughness={.4}/></mesh>{[-.72,0,.72].flatMap((x)=>[-.62,.62].map((z)=><mesh key={`${x}-${z}`} position={[x,-.12,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.22,.22,.15,18]}/><meshStandardMaterial color="#1c2228" roughness={.8}/></mesh>))}<mesh position={[0,.72,0]}><cylinderGeometry args={[.08,.08,.85,12]}/><meshStandardMaterial color="#b9c6ce" metalness={.72}/></mesh><mesh position={[0,1.15,0]}><boxGeometry args={[.48,.24,.18]}/><meshStandardMaterial color="#242f38" metalness={.58}/></mesh></group>;
}

function World({ id }: { id: SystemSceneId }) {
  return <><ambientLight intensity={1.05}/><directionalLight position={[4,5,5]} intensity={2.8} color="#ffd38b"/><pointLight position={[-4,-2,3]} intensity={13} distance={10} color="#63d5ff"/>{id === 'fives' && <FootballField/>}{id === 'context' && <ContextMesh/>}{id === 'kasilink' && <KasiNetwork/>}{id === 'crisis' && <CrisisRadar/>}{id === 'starfall' && <StarfallField/>}{id === 'mars' && <MarsRig/>}<Sparkles count={28} scale={[6,4,3]} size={1.1} speed={.16} color="#bfefff"/></>;
}

export function SystemAtlas({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<SystemSceneId>('fives');
  const selected = systems.find((system)=>system.id === active) ?? systems[0];
  return <section className={`system-atlas ${compact ? 'compact' : ''}`} aria-label="Interactive Kopano Labs systems atlas">
    <div className="atlas-heading"><div><span className="eyebrow">SPATIAL SYSTEMS ATLAS · INTERACTIVE</span><h2>Every system gets a world.</h2></div><p>Tap a live lane to change the scene. The visual form follows the product: pitch, network, radar, mesh, salvage field or rover.</p></div>
    <div className="atlas-shell"><div className="atlas-stage" data-system={active}><Canvas dpr={[1,1.45]} camera={{position:[0,.4,5.6],fov:47}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}}><World id={active}/><OrbitControls enablePan={false} enableZoom={false} rotateSpeed={.3} minPolarAngle={Math.PI*.28} maxPolarAngle={Math.PI*.72}/></Canvas><div className="atlas-stage-copy"><span>{selected.kicker}</span><h3>{selected.label}</h3><p>{selected.detail}</p><a href={selected.href} target={selected.href.startsWith('http')?'_blank':undefined} rel={selected.href.startsWith('http')?'noreferrer':undefined}>Open system ↗</a></div></div><div className="atlas-selector" role="list" aria-label="Choose a system scene">{systems.map((system,index)=><motion.button type="button" role="listitem" key={system.id} className={active===system.id?'active':''} onClick={()=>setActive(system.id)} whileHover={{x:4}}><span>{String(index+1).padStart(2,'0')}</span><div><strong>{system.label}</strong><small>{system.state}</small></div><b>↗</b></motion.button>)}</div></div>
    {active === 'fives' && <FivesArenaFeed/>}
  </section>;
}
