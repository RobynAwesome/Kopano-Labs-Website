import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { PlayerProfile } from '../AdaptivePlayerApp';

const sceneConfig = {
  mobile: { dpr: [1, 1.15] as [number, number], detail: 1, nodes: 6, lights: 1, power: 'low-power' as const },
  enhanced: { dpr: [1, 1.35] as [number, number], detail: 2, nodes: 10, lights: 2, power: 'default' as const },
  immersive: { dpr: [1, 1.55] as [number, number], detail: 3, nodes: 16, lights: 3, power: 'high-performance' as const },
};

type ThreeProfile = Exclude<PlayerProfile, 'lite'>;

function World({ profile, animate }: { profile: ThreeProfile; animate: boolean }) {
  const config = sceneConfig[profile];
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const nodes = useMemo(() => Array.from({ length: config.nodes }, (_, index) => {
    const angle = (index / config.nodes) * Math.PI * 2;
    const radius = 1.85 + (index % 3) * .16;
    const y = ((index % 5) - 2) * .24;
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as const;
  }), [config.nodes]);

  useFrame((state, delta) => {
    if (!animate) return;
    if (root.current) root.current.rotation.y += delta * (profile === 'mobile' ? .07 : .11);
    if (core.current) {
      core.current.rotation.x += delta * .09;
      core.current.rotation.z += delta * .06;
    }
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, .25 + Math.sin(state.clock.elapsedTime * .25) * .06, .025);
  });

  return (
    <group ref={root}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, config.detail]} />
        <meshStandardMaterial color="#159bd7" roughness={.28} metalness={.38} emissive="#0a2e34" emissiveIntensity={.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.62, .018, 8, profile === 'mobile' ? 48 : 96]} />
        <meshBasicMaterial color="#32e29b" transparent opacity={.45} />
      </mesh>
      <mesh rotation={[Math.PI / 3, .2, 0]}>
        <torusGeometry args={[2.12, .012, 8, profile === 'mobile' ? 48 : 96]} />
        <meshBasicMaterial color="#6f2bd9" transparent opacity={.34} />
      </mesh>
      {nodes.map((position, index) => (
        <group key={index} position={position}>
          <mesh>
            <sphereGeometry args={[index % 4 === 0 ? .12 : .075, 12, 12]} />
            <meshStandardMaterial color={index % 3 === 0 ? '#32e29b' : index % 3 === 1 ? '#159bd7' : '#8f5be5'} emissive="#061a19" emissiveIntensity={.6} />
          </mesh>
          <mesh rotation={[0, 0, Math.atan2(position[1], Math.hypot(position[0], position[2]))]}>
            <cylinderGeometry args={[.008, .008, 1.15, 5]} />
            <meshBasicMaterial color="#82bfb1" transparent opacity={.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function AdaptivePlayerScene({ profile, animate }: { profile: ThreeProfile; animate: boolean }) {
  const config = sceneConfig[profile];
  return (
    <div className="adaptive-player-canvas" aria-label={`${profile} Three.js player scene`}>
      <Canvas
        dpr={config.dpr}
        frameloop={animate ? 'always' : 'demand'}
        camera={{ position: [0, .25, 5.5], fov: 43, near: .1, far: 30 }}
        gl={{ antialias: profile !== 'mobile', alpha: true, powerPreference: config.power }}
      >
        <ambientLight intensity={profile === 'mobile' ? .75 : .9} />
        <directionalLight position={[3, 4, 5]} intensity={1.5} color="#d9fff0" />
        {config.lights >= 2 && <pointLight position={[-3, -1, 2]} intensity={12} distance={8} color="#6f2bd9" />}
        {config.lights >= 3 && <pointLight position={[3, 1, -2]} intensity={10} distance={8} color="#32e29b" />}
        <World profile={profile} animate={animate} />
        <OrbitControls
          enablePan={false}
          enableZoom
          enableDamping={animate}
          dampingFactor={.08}
          minDistance={3.6}
          maxDistance={7.2}
          autoRotate={false}
          touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
        />
      </Canvas>
    </div>
  );
}
