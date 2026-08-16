import { Float, Line, OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createKPGSSceneContract, emitKPGSReceipt, type KPGSSceneContract } from '../kpgsSceneContract';
import { getExperienceProfile } from '../experienceRuntime';
import type { View } from '../routeRegistry';
import { useKPGSVisibility } from '../useKPGSVisibility';

const nodes: [number, number, number][] = [
  [-2.15, .9, .1], [-1.75, -.8, .45], [-.55, 1.35, -.25],
  [.1, -1.15, .3], [2.45, 1.05, -.3], [1.7, -1.2, .2],
];

function World({ contract }: { contract: KPGSSceneContract }) {
  const mesh = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!contract.runtime.animate || contract.behavior.pointerResponse === 'off') return;
    if (core.current) core.current.rotation.y += delta * .11;
    if (mesh.current) {
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, state.pointer.x * .18, .035);
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -state.pointer.y * .1, .035);
    }
  });

  const animate = contract.runtime.animate;
  const lite = contract.runtime.tier === 'lite';

  return <group ref={mesh}>
    <ambientLight intensity={.8} color="#83a8c7" />
    <directionalLight position={[4, 3, 5]} intensity={3.2} color="#ffc37a" />
    <pointLight position={[-3, -1.5, 2.5]} intensity={lite ? 8 : 16} distance={9} color="#00e676" />
    <Float speed={animate ? .75 : 0} rotationIntensity={.08} floatIntensity={animate ? .22 : 0}>
      <mesh ref={core} position={[1.15, .25, 0]}>
        <icosahedronGeometry args={[1.18, lite ? 1 : 3]} />
        <meshStandardMaterial color="#173b50" roughness={.48} metalness={.42} emissive="#062b32" emissiveIntensity={.46} />
      </mesh>
    </Float>
    <mesh position={[-1.1, -.15, -.5]} rotation={[.1, .2, 0]}>
      <icosahedronGeometry args={[2.2, lite ? 1 : 2]} />
      <meshBasicMaterial color="#f5a623" wireframe transparent opacity={.12} />
    </mesh>
    {nodes.map((p, i) => <Float key={i} speed={animate ? .5 + i * .06 : 0} floatIntensity={animate ? .12 : 0}>
      <mesh position={p}><sphereGeometry args={[.075, lite ? 8 : 14, lite ? 8 : 14]} /><meshBasicMaterial color={i % 2 ? '#63d5ff' : '#00e676'} /></mesh>
    </Float>)}
    <Line points={nodes} color="#63d5ff" transparent opacity={.2} lineWidth={.65} />
    <mesh rotation={[Math.PI * .58, 0, -.25]}>
      <torusGeometry args={[2.35, .012, 8, lite ? 90 : 180]} /><meshBasicMaterial color="#63d5ff" transparent opacity={.34} />
    </mesh>
    {contract.budget.particleCount > 0 && <Stars radius={18} depth={12} count={contract.budget.particleCount} factor={1.4} saturation={0} fade speed={animate ? .15 : 0} />}
    {contract.budget.sparkles > 0 && <Sparkles count={contract.budget.sparkles} scale={[7,4,4]} size={1.2} speed={animate ? .18 : 0} color="#9fdcff" />}
  </group>;
}

export function KopanoScene({ view = 'home' }: { view?: View }) {
  const profile = useMemo(() => getExperienceProfile(), []);
  const contract = useMemo(() => createKPGSSceneContract(view, profile, 'home'), [profile, view]);
  const visible = useKPGSVisibility();

  useEffect(() => {
    emitKPGSReceipt(contract, 'scene_mounted', { particle_count: contract.budget.particleCount });
  }, [contract]);

  return <div className="kopano-scene" data-kpgs-scene={contract.scene.id} data-kpgs-tier={contract.runtime.tier} aria-label="Interactive Kopano spatial systems map">
    <Canvas dpr={contract.budget.dpr} frameloop={contract.runtime.animate && visible ? 'always' : 'demand'} camera={{ position: [0, .35, 6.5], fov: 48 }} gl={{ antialias: !contract.runtime.tier.startsWith('lite'), alpha: true, powerPreference: contract.runtime.tier === 'full' ? 'high-performance' : 'default' }}>
      <World contract={contract} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={contract.behavior.pointerResponse !== 'off'} minPolarAngle={Math.PI * .36} maxPolarAngle={Math.PI * .64} rotateSpeed={.25} />
    </Canvas>
    <div className="scene-label scene-label-a">KOPANO MESH · {contract.runtime.tier.toUpperCase()}</div>
    <div className="scene-label scene-label-b">FIVES · KASILINK · CRISIS</div>
    <div className="scene-label scene-label-c">REALITY → PROOF</div>
  </div>;
}
