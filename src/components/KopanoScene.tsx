import { Float, Line, OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { createKPGSSceneContract, emitKPGSReceipt, type KPGSSceneContract } from '../kpgsSceneContract';
import type { View } from '../routeRegistry';
import { useExperienceProfile } from '../useExperienceProfile';
import { useKPGSVisibility } from '../useKPGSVisibility';

const defaultSceneLabels: [string, string, string] = ['Explore what we are building', 'Move through the work', 'Open a path to see the proof'];

const sceneLabels: Partial<Record<View, [string, string, string]>> = {
  home: ['Explore what we are building', 'Drag to look around', 'Open a path to see the proof'],
  labs: ['Experiments becoming products', 'Built for real constraints', 'Open a project to see the evidence'],
  systems: ['Systems that connect the work', 'Tap a system to explore', 'Live products, field tools and R&D'],
  foc: ['Real work, not claims', 'Follow the evidence', 'Source → state → artifact'],
  proof: ['See what backs the work', 'Trace the source', 'Evidence before explanation'],
  content: ['Find the work quickly', 'Projects, systems and evidence', 'Choose what you came to see'],
};

const nodes = [
  { position: [-2.15, .9, .1] as [number, number, number], label: 'Community systems' },
  { position: [-1.75, -.8, .45] as [number, number, number], label: 'Field work' },
  { position: [-.55, 1.35, -.25] as [number, number, number], label: 'Applied AI' },
  { position: [.1, -1.15, .3] as [number, number, number], label: 'Public evidence' },
  { position: [2.45, 1.05, -.3] as [number, number, number], label: 'Physical builds' },
  { position: [1.7, -1.2, .2] as [number, number, number], label: 'Interactive labs' },
] as const;

const nodePoints = nodes.map((node) => node.position);

function TopologyNode({
  position,
  index,
  animate,
  lite,
  onFocus,
}: {
  position: [number, number, number];
  index: number;
  animate: boolean;
  lite: boolean;
  onFocus: (index: number | null) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!mesh.current) return;
    const pulse = animate ? 1 + Math.sin(state.clock.elapsedTime * 1.3 + index) * .08 : 1;
    const target = hovered ? 1.65 : pulse;
    const scale = THREE.MathUtils.lerp(mesh.current.scale.x, target, .12);
    mesh.current.scale.setScalar(scale);
  });

  return <Float speed={animate ? .5 + index * .06 : 0} floatIntensity={animate ? .12 : 0}>
    <mesh
      ref={mesh}
      position={position}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHovered(true);
        onFocus(index);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onFocus(null);
      }}
    >
      <sphereGeometry args={[.085, lite ? 8 : 14, lite ? 8 : 14]} />
      <meshBasicMaterial color={index % 2 ? '#63d5ff' : '#00e676'} />
    </mesh>
  </Float>;
}

function World({ contract, onFocus }: { contract: KPGSSceneContract; onFocus: (index: number | null) => void }) {
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
    {nodes.map((node, index) => <TopologyNode
      key={node.label}
      position={node.position}
      index={index}
      animate={animate}
      lite={lite}
      onFocus={onFocus}
    />)}
    <Line points={nodePoints} color="#63d5ff" transparent opacity={.2} lineWidth={.65} />
    <mesh rotation={[Math.PI * .58, 0, -.25]}>
      <torusGeometry args={[2.35, .012, 8, lite ? 90 : 180]} />
      <meshBasicMaterial color="#63d5ff" transparent opacity={.34} />
    </mesh>
    {contract.budget.particleCount > 0 && <Stars radius={18} depth={12} count={contract.budget.particleCount} factor={1.4} saturation={0} fade speed={animate ? .15 : 0} />}
    {contract.budget.sparkles > 0 && <Sparkles count={contract.budget.sparkles} scale={[7, 4, 4]} size={1.2} speed={animate ? .18 : 0} color="#9fdcff" />}
  </group>;
}

export function KopanoScene({ view = 'home' }: { view?: View }) {
  const profile = useExperienceProfile();
  const contract = useMemo(() => createKPGSSceneContract(view, profile, 'home'), [profile, view]);
  const visible = useKPGSVisibility();
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    emitKPGSReceipt(contract, 'scene_mounted', { particle_count: contract.budget.particleCount });
  }, [contract]);

  const labels = sceneLabels[view] ?? defaultSceneLabels;
  const focusLabel = focusIndex === null ? labels[1] : nodes[focusIndex]?.label;

  return <div
    className="kopano-scene"
    data-kpgs-scene={contract.scene.id}
    data-kpgs-tier={contract.runtime.tier}
    aria-label={labels[0] + ' interactive spatial surface'}
  >
    <Canvas
      dpr={contract.budget.dpr}
      frameloop={contract.runtime.animate && visible ? 'always' : 'demand'}
      camera={{ position: [0, .35, 6.5], fov: 48 }}
      gl={{ antialias: contract.runtime.tier !== 'lite', alpha: true, powerPreference: contract.runtime.tier === 'full' ? 'high-performance' : 'default' }}
    >
      <World contract={contract} onFocus={setFocusIndex} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={contract.behavior.pointerResponse !== 'off'} minPolarAngle={Math.PI * .36} maxPolarAngle={Math.PI * .64} rotateSpeed={.25} />
    </Canvas>
    <div className="scene-label scene-label-a">{labels[0]}</div>
    <div className="scene-label scene-label-b">{focusLabel}</div>
    <div className="scene-label scene-label-c">{labels[2]}</div>
  </div>;
}
