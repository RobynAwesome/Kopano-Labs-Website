import { Line, OrbitControls, Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { getExperienceProfile } from '../experienceRuntime';

type DriveInput = {
  throttle: -1 | 0 | 1;
  steer: -1 | 0 | 1;
  reset: number;
};

type Telemetry = {
  speed: number;
  heading: number;
  suspension: number;
};

const wheelOffsets = [
  [-0.86, -0.82], [0.86, -0.82],
  [-0.86, 0], [0.86, 0],
  [-0.86, 0.82], [0.86, 0.82],
] as const;

function terrainHeight(x: number, z: number) {
  return Math.sin(x * 0.84) * 0.075 + Math.cos(z * 0.72) * 0.055 + Math.sin((x + z) * 1.55) * 0.026;
}

function MarsTerrain({ lite }: { lite: boolean }) {
  const geometry = useMemo(() => {
    const segments = lite ? 18 : 36;
    const next = new THREE.PlaneGeometry(9.5, 9.5, segments, segments);
    next.rotateX(-Math.PI / 2);
    const position = next.attributes.position as THREE.BufferAttribute;
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index);
      const z = position.getZ(index);
      position.setY(index, terrainHeight(x, z));
    }
    position.needsUpdate = true;
    next.computeVertexNormals();
    return next;
  }, [lite]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const rocks = useMemo(() => Array.from({ length: lite ? 9 : 18 }, (_, index) => {
    const angle = index * 2.17;
    const radius = 2.3 + (index % 5) * 0.42;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return {
      position: [x, terrainHeight(x, z) + 0.08, z] as [number, number, number],
      scale: 0.11 + (index % 4) * 0.055,
      rotation: [index * 0.31, index * 0.19, index * 0.13] as [number, number, number],
    };
  }), [lite]);

  return <group>
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#4a1d13" roughness={0.97} metalness={0.02} />
    </mesh>
    <mesh position={[0, -0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[4.6, lite ? 40 : 80]} />
      <meshBasicMaterial color="#d76a39" transparent opacity={0.055} />
    </mesh>
    {rocks.map((rock, index) => <mesh key={index} position={rock.position} rotation={rock.rotation} scale={rock.scale} castShadow={!lite}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={index % 3 === 0 ? '#7b3422' : '#59251a'} roughness={0.92} />
    </mesh>)}
  </group>;
}

function RoverRig({ controls, lite, animate, onTelemetry }: {
  controls: { current: DriveInput };
  lite: boolean;
  animate: boolean;
  onTelemetry: (next: Telemetry) => void;
}) {
  const rover = useRef<THREE.Group>(null);
  const wheelRefs = useRef<(THREE.Group | null)[]>([]);
  const stateRef = useRef({ x: 0, z: 0, yaw: -0.28, speed: 0, wheelSpin: 0, lastReset: -1 });
  const lastTelemetry = useRef(0);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return target.matches('input, textarea, select, [contenteditable="true"]');
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp') controls.current.throttle = 1;
      if (event.key === 's' || event.key === 'S' || event.key === 'ArrowDown') controls.current.throttle = -1;
      if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') controls.current.steer = -1;
      if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') controls.current.steer = 1;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp' || event.key === 's' || event.key === 'S' || event.key === 'ArrowDown') controls.current.throttle = 0;
      if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft' || event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') controls.current.steer = 0;
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [controls]);

  useFrame((renderState, rawDelta) => {
    const group = rover.current;
    if (!group) return;
    const dynamic = stateRef.current;
    const delta = Math.min(rawDelta, 1 / 24);

    if (dynamic.lastReset !== controls.current.reset) {
      dynamic.x = 0;
      dynamic.z = 0;
      dynamic.yaw = -0.28;
      dynamic.speed = 0;
      dynamic.wheelSpin = 0;
      dynamic.lastReset = controls.current.reset;
    }

    const targetSpeed = animate ? controls.current.throttle * 1.45 : 0;
    const acceleration = controls.current.throttle === 0 ? 5.4 : 2.45;
    dynamic.speed = THREE.MathUtils.damp(dynamic.speed, targetSpeed, acceleration, delta);

    const steeringAuthority = 0.42 + Math.min(Math.abs(dynamic.speed), 1.25) * 0.54;
    dynamic.yaw += controls.current.steer * steeringAuthority * delta * (dynamic.speed < -0.05 ? -1 : 1);

    const nextX = dynamic.x + Math.sin(dynamic.yaw) * dynamic.speed * delta;
    const nextZ = dynamic.z + Math.cos(dynamic.yaw) * dynamic.speed * delta;
    if (Math.abs(nextX) < 3.05 && Math.abs(nextZ) < 3.05) {
      dynamic.x = nextX;
      dynamic.z = nextZ;
    } else {
      dynamic.speed *= -0.16;
    }

    dynamic.wheelSpin += dynamic.speed * delta / 0.26;

    const wheelWorldHeights = wheelOffsets.map(([localX, localZ]) => {
      const sin = Math.sin(dynamic.yaw);
      const cos = Math.cos(dynamic.yaw);
      const worldX = dynamic.x + localX * cos + localZ * sin;
      const worldZ = dynamic.z - localX * sin + localZ * cos;
      return terrainHeight(worldX, worldZ);
    });

    const averageHeight = wheelWorldHeights.reduce((sum, value) => sum + value, 0) / wheelWorldHeights.length;
    const frontAverage = (wheelWorldHeights[0] + wheelWorldHeights[1]) / 2;
    const rearAverage = (wheelWorldHeights[4] + wheelWorldHeights[5]) / 2;
    const leftAverage = (wheelWorldHeights[0] + wheelWorldHeights[2] + wheelWorldHeights[4]) / 3;
    const rightAverage = (wheelWorldHeights[1] + wheelWorldHeights[3] + wheelWorldHeights[5]) / 3;
    const pitch = Math.atan2(frontAverage - rearAverage, 1.64) * 0.72;
    const roll = Math.atan2(leftAverage - rightAverage, 1.72) * 0.72;
    const bodyY = averageHeight + 0.57;

    group.position.set(dynamic.x, bodyY, dynamic.z);
    group.rotation.set(pitch, dynamic.yaw, roll, 'YXZ');

    wheelRefs.current.forEach((wheel, index) => {
      if (!wheel) return;
      wheel.position.y = wheelWorldHeights[index] - bodyY + 0.285;
      wheel.rotation.x = dynamic.wheelSpin;
    });

    if (renderState.clock.elapsedTime - lastTelemetry.current > 0.16) {
      lastTelemetry.current = renderState.clock.elapsedTime;
      const suspensionTravel = Math.max(...wheelWorldHeights) - Math.min(...wheelWorldHeights);
      onTelemetry({
        speed: Math.abs(dynamic.speed) * 3.6,
        heading: (THREE.MathUtils.radToDeg(dynamic.yaw) + 360) % 360,
        suspension: suspensionTravel * 1000,
      });
    }
  });

  return <group ref={rover}>
    <group position={[0, 0, 0]}>
      <mesh castShadow={!lite} position={[0, 0.13, 0]}>
        <boxGeometry args={[1.62, 0.3, 1.78]} />
        <meshStandardMaterial color="#d6a84c" metalness={0.55} roughness={0.36} />
      </mesh>
      <mesh castShadow={!lite} position={[0, -0.09, 0.05]}>
        <boxGeometry args={[1.2, 0.22, 1.24]} />
        <meshStandardMaterial color="#172434" metalness={0.38} roughness={0.46} />
      </mesh>
      <mesh castShadow={!lite} position={[0, 0.36, -0.05]}>
        <boxGeometry args={[1.22, 0.07, 1.08]} />
        <meshStandardMaterial color="#5f7383" metalness={0.7} roughness={0.3} />
      </mesh>
      <Line points={[[-0.57, 0.42, -0.51], [0.57, 0.42, -0.51], [0.57, 0.42, 0.48], [-0.57, 0.42, 0.48], [-0.57, 0.42, -0.51]]} color="#ffb05f" lineWidth={1.4} />
      <mesh position={[0, 0.57, 0.04]} castShadow={!lite}>
        <boxGeometry args={[0.54, 0.24, 0.46]} />
        <meshStandardMaterial color="#f0c16c" metalness={0.25} roughness={0.5} />
      </mesh>
      <Line points={[[0, 0.7, 0.04], [0, 1.2, 0.04]]} color="#bcd0db" lineWidth={2} />
      <mesh position={[0, 1.28, 0.04]} castShadow={!lite}>
        <boxGeometry args={[0.5, 0.22, 0.22]} />
        <meshStandardMaterial color="#263644" metalness={0.62} roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.43, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.27, 0.025, 8, lite ? 36 : 72]} />
        <meshStandardMaterial color="#67c9ff" emissive="#164c6c" emissiveIntensity={0.55} metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh position={[-0.16, 1.28, -0.12]}>
        <sphereGeometry args={[0.045, lite ? 8 : 16, lite ? 8 : 16]} />
        <meshBasicMaterial color="#7edcff" />
      </mesh>
      <mesh position={[0.16, 1.28, -0.12]}>
        <sphereGeometry args={[0.045, lite ? 8 : 16, lite ? 8 : 16]} />
        <meshBasicMaterial color="#7edcff" />
      </mesh>
      <Line points={[[-0.86, -0.03, -0.82], [-0.86, 0.08, 0], [-0.86, -0.03, 0.82]]} color="#5f85a0" lineWidth={2.1} />
      <Line points={[[0.86, -0.03, -0.82], [0.86, 0.08, 0], [0.86, -0.03, 0.82]]} color="#5f85a0" lineWidth={2.1} />
      {wheelOffsets.map(([x, z], index) => <group key={`${x}-${z}`} ref={(node) => { wheelRefs.current[index] = node; }} position={[x, -0.28, z]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow={!lite}>
          <cylinderGeometry args={[0.26, 0.26, 0.18, lite ? 12 : 24]} />
          <meshStandardMaterial color="#10171d" roughness={0.84} metalness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.19, lite ? 10 : 18]} />
          <meshStandardMaterial color="#5b7282" metalness={0.72} roughness={0.3} />
        </mesh>
      </group>)}
    </group>
  </group>;
}

export function MarsRoverScene() {
  const profile = useMemo(() => getExperienceProfile(), []);
  const lite = profile.tier === 'lite';
  const animate = !profile.reducedMotion && !profile.saveData;
  const controls = useRef<DriveInput>({ throttle: 0, steer: 0, reset: 0 });
  const [telemetry, setTelemetry] = useState<Telemetry>({ speed: 0, heading: 344, suspension: 0 });
  const dpr: number | [number, number] = profile.tier === 'full' ? [1, 1.5] : profile.tier === 'balanced' ? [1, 1.2] : 1;

  const updateTelemetry = useCallback((next: Telemetry) => setTelemetry(next), []);
  const setAxis = (axis: 'throttle' | 'steer', value: -1 | 0 | 1) => {
    controls.current[axis] = value;
  };
  const reset = () => {
    controls.current.throttle = 0;
    controls.current.steer = 0;
    controls.current.reset += 1;
  };

  return <div className="mars-rover-scene" aria-label="Interactive browser simulation of the Cars4Mars rover">
    <Canvas
      dpr={dpr}
      shadows={!lite}
      frameloop={profile.reducedMotion || profile.saveData ? 'demand' : 'always'}
      camera={{ position: [4.8, 3.25, 6.35], fov: 42, near: 0.1, far: 40 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: profile.tier === 'full' ? 'high-performance' : 'default' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <fog attach="fog" args={['#230d09', 7, 17]} />
      <hemisphereLight intensity={1.2} color="#ffe2bb" groundColor="#32120b" />
      <directionalLight position={[4.5, 7, 3]} intensity={3.4} color="#ffd39b" castShadow={!lite} />
      <pointLight position={[-4, 2.5, 1]} intensity={10} distance={11} color="#63d5ff" />
      <MarsTerrain lite={lite} />
      <RoverRig controls={controls} lite={lite} animate={animate} onTelemetry={updateTelemetry} />
      {animate && <Sparkles count={profile.tier === 'full' ? 42 : 18} scale={[9, 3.8, 9]} size={0.9} speed={0.16} color="#ffbd82" />}
      <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4.2} maxDistance={9.2} minPolarAngle={Math.PI * 0.18} maxPolarAngle={Math.PI * 0.48} target={[0, 0.45, 0]} rotateSpeed={0.38} zoomSpeed={0.55} />
    </Canvas>

    <div className="mars-sim-badge"><span>INTERACTIVE ROVER</span><b>DRIVE + INSPECT</b></div>
    <div className="mars-sim-telemetry" aria-live="polite">
      <span><b>{telemetry.speed.toFixed(1)}</b> km/h SIM</span>
      <span><b>{Math.round(telemetry.heading).toString().padStart(3, '0')}°</b> heading</span>
      <span><b>{Math.round(telemetry.suspension)}</b> mm terrain delta</span>
    </div>
    <div className="mars-sim-controls" aria-label="Rover simulation controls">
      <div className="mars-control-hint">WASD / arrows · drag to orbit · scroll to zoom</div>
      <div className="mars-drive-pad">
        <button type="button" aria-label="Turn rover left" onPointerDown={() => setAxis('steer', -1)} onPointerUp={() => setAxis('steer', 0)} onPointerCancel={() => setAxis('steer', 0)}>↶</button>
        <button type="button" aria-label="Drive rover forward" onPointerDown={() => setAxis('throttle', 1)} onPointerUp={() => setAxis('throttle', 0)} onPointerCancel={() => setAxis('throttle', 0)}>↑</button>
        <button type="button" aria-label="Turn rover right" onPointerDown={() => setAxis('steer', 1)} onPointerUp={() => setAxis('steer', 0)} onPointerCancel={() => setAxis('steer', 0)}>↷</button>
        <button type="button" aria-label="Drive rover backward" onPointerDown={() => setAxis('throttle', -1)} onPointerUp={() => setAxis('throttle', 0)} onPointerCancel={() => setAxis('throttle', 0)}>↓</button>
        <button type="button" className="reset" onClick={reset}>RESET</button>
      </div>
    </div>
    <div className="mars-sim-proof-note">Browser dynamics model · interaction aid only · not physical validation evidence.</div>
  </div>;
}
