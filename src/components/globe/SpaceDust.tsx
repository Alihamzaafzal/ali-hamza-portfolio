import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, GLOBE } from './constants';

export default function SpaceDust() {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const count = GLOBE.dustParticles;
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 2.1 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi) * 0.55;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      spd[i] = 0.08 + Math.random() * 0.35;
    }
    return { positions: pos, speeds: spd };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < speeds.length; i++) {
      const ix = i * 3;
      const x = arr[ix];
      const z = arr[ix + 2];
      const ang = speeds[i] * delta;
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      arr[ix] = x * c - z * s;
      arr[ix + 2] = x * s + z * c;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={COLORS.blue}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
