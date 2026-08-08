import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function KopanoScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0.35, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const mars = new THREE.Mesh(
      new THREE.SphereGeometry(1.28, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0xc74627,
        roughness: 0.84,
        metalness: 0.04,
        emissive: new THREE.Color(0x2b0804),
        emissiveIntensity: 0.35,
      }),
    );
    mars.position.set(1.15, 0.25, 0);
    group.add(mars);

    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.2, 2)),
      new THREE.LineBasicMaterial({ color: 0xf5a623, transparent: true, opacity: 0.13 }),
    );
    wire.position.set(-1.1, -0.15, -0.5);
    group.add(wire);

    const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00e676 });
    const nodePositions = [
      [-2.15, 0.9, 0.1],
      [-1.75, -0.8, 0.45],
      [-0.55, 1.35, -0.25],
      [0.1, -1.15, 0.3],
      [2.45, 1.05, -0.3],
    ] as const;

    nodePositions.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, z);
      group.add(node);
    });

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.012, 8, 180),
      new THREE.MeshBasicMaterial({ color: 0x63d5ff, transparent: true, opacity: 0.36 }),
    );
    orbit.rotation.x = Math.PI * 0.58;
    orbit.rotation.z = -0.25;
    group.add(orbit);

    const key = new THREE.DirectionalLight(0xffc37a, 3.4);
    key.position.set(4, 3, 5);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0x7fa7c4, 1.05));
    const rim = new THREE.PointLight(0x00e676, 10, 8);
    rim.position.set(-3, -1.5, 2.5);
    scene.add(rim);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 220;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = -2 - Math.random() * 8;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: 0x9fdcff, size: 0.018, transparent: true, opacity: 0.65 }),
    );
    scene.add(stars);

    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.3;
    };
    mount.addEventListener('pointermove', onPointerMove);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      if (!reducedMotion) {
        mars.rotation.y = t * 0.09;
        wire.rotation.y = -t * 0.045;
        orbit.rotation.z = -0.25 + t * 0.035;
        group.rotation.y += (targetX - group.rotation.y) * 0.035;
        group.rotation.x += (-targetY - group.rotation.x) * 0.035;
        stars.rotation.y = t * 0.004;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mount.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      starsGeometry.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="kopano-scene" ref={mountRef} aria-hidden="true">
      <div className="scene-label scene-label-a">KOPANO MESH</div>
      <div className="scene-label scene-label-b">CARS4MARS · BUILD</div>
      <div className="scene-label scene-label-c">REALITY → PROOF</div>
    </div>
  );
}
