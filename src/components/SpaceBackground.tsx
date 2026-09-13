import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [colorMap, bumpMap] = useTexture([
    '/earth-blue-marble.jpg',
    '/earth-topology.png',
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.045;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.055;
  });

  return (
    <group position={[1.2, -0.15, 0]} scale={1.15}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      <mesh ref={cloudsRef} scale={1.015}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshStandardMaterial
          color="#bae6fd"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function MovingStars() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.012;
      group.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <group ref={group}>
      <Stars
        radius={120}
        depth={60}
        count={4500}
        factor={3.5}
        saturation={0}
        fade
        speed={0.6}
      />
      <Stars
        radius={80}
        depth={40}
        count={1800}
        factor={2.2}
        saturation={0.2}
        fade
        speed={1.2}
      />
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#0a0909']} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[5, 2, 4]} intensity={1.45} color="#fff5f5" />
      <directionalLight position={[-4, -1, -2]} intensity={0.35} color="#7DD3FC" />
      <pointLight position={[3, 1, 2]} intensity={0.9} color="#38BDF8" distance={12} />
      <MovingStars />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </>
  );
}

function CssStarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="css-star absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      <div className="earth-photo absolute top-1/2 right-[-8%] h-[70vmin] w-[70vmin] -translate-y-1/2 md:right-[2%]">
        <img
          src="/earth-blue-marble.jpg"
          alt=""
          className="h-full w-full rounded-full object-cover opacity-80 shadow-[0_0_90px_rgba(56,189,248,0.45)]"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-l from-transparent via-transparent to-ink" />
        <div className="absolute inset-0 animate-spin-slow rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(186,230,253,0.18),transparent_45%)]" />
      </div>
    </div>
  );
}

export default function SpaceBackground() {
  const [use3d, setUse3d] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setReducedMotion(mq.matches);
      setUse3d(!mq.matches && !narrow.matches);
    };
    update();
    mq.addEventListener('change', update);
    narrow.addEventListener('change', update);
    return () => {
      mq.removeEventListener('change', update);
      narrow.removeEventListener('change', update);
    };
  }, []);

  if (reducedMotion || !use3d) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-ink">
        <CssStarField />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(56,189,248,0.16),transparent_55%)]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-ink">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(56,189,248,0.14),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
    </div>
  );
}
