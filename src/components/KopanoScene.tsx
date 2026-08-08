import { Float, Line, OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const nodes: [number, number, number][] = [
  [-2.15, .9, .1], [-1.75, -.8, .45], [-.55, 1.35, -.25],
  [.1, -1.15, .3], [2.45, 1.05, -.3], [1.7, -1.2, .2],
];

function World() {
  const mesh = useRef<THREE.Group>(null);
  const mars = useRef<THREE.Mesh>(null);
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const saveData = useMemo(() => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData), []);

  useFrame((state, delta) => {
    if (reduced || saveData) return;
    if (mars.current) mars.current.rotation.y += delta * .11;
    if (mesh.current) {
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, state.pointer.x * .18, .035);
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -state.pointer.y * .1, .035);
    }
  });

  return <group ref={mesh}>
    <ambientLight intensity={.8} color="#83a8c7" />
    <directionalLight position={[4, 3, 5]} intensity={3.2} color="#ffc37a" />
    <pointLight position={[-3, -1.5, 2.5]} intensity={16} distance={9} color="#00e676" />
    <Float speed={reduced ? 0 : .75} rotationIntensity={.08} floatIntensity={.22}>
      <mesh ref={mars} position={[1.15, .25, 0]}>
        <sphereGeometry args={[1.28, saveData ? 24 : 64, saveData ? 24 : 64]} />
        <meshStandardMaterial color="#c74627" roughness={.84} metalness={.04} emissive="#2b0804" emissiveIntensity={.35} />
      </mesh>
    </Float>
    <mesh position={[-1.1, -.15, -.5]} rotation={[.1, .2, 0]}>
      <icosahedronGeometry args={[2.2, saveData ? 1 : 2]} />
      <meshBasicMaterial color="#f5a623" wireframe transparent opacity={.12} />
    </mesh>
    {nodes.map((p, i) => <Float key={i} speed={.5 + i * .06} floatIntensity={.12}>
      <mesh position={p}><sphereGeometry args={[.075, 14, 14]} /><meshBasicMaterial color={i % 2 ? '#63d5ff' : '#00e676'} /></mesh>
    </Float>)}
    <Line points={nodes} color="#63d5ff" transparent opacity={.2} lineWidth={.65} />
    <mesh rotation={[Math.PI * .58, 0, -.25]}>
      <torusGeometry args={[2.35, .012, 8, 180]} /><meshBasicMaterial color="#63d5ff" transparent opacity={.34} />
    </mesh>
    {!saveData && <><Stars radius={18} depth={12} count={420} factor={1.4} saturation={0} fade speed={.15} /><Sparkles count={42} scale={[7,4,4]} size={1.2} speed={.18} color="#9fdcff" /></>}
  </group>;
}

export function KopanoScene() {
  return <div className="kopano-scene" aria-label="Interactive Kopano spatial systems map">
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, .35, 6.5], fov: 48 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
      <World />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI * .36} maxPolarAngle={Math.PI * .64} rotateSpeed={.25} />
    </Canvas>
    <div className="scene-label scene-label-a">KOPANO MESH · LIVE</div>
    <div className="scene-label scene-label-b">CARS4MARS · BUILD</div>
    <div className="scene-label scene-label-c">REALITY → PROOF</div>
  </div>;
}
