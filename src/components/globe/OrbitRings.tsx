import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, RING_CONFIG } from './constants';
import { ringFragment, ringVertex } from './shaders';

function OrbitRing({ config }: { config: (typeof RING_CONFIG)[number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }, delta) => {
    if (meshRef.current) meshRef.current.rotation.z += delta * config.speed;
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} rotation={config.tilt}>
      <torusGeometry args={[config.radius, config.tube, 16, 200]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={ringVertex}
        fragmentShader={ringFragment}
        uniforms={{
          uTime: { value: 0 },
          uPurple: { value: new THREE.Color(COLORS.purple) },
          uPink: { value: new THREE.Color(COLORS.pink) },
          uOpacity: { value: config.opacity },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function OrbitRings() {
  return (
    <group>
      {RING_CONFIG.map((cfg, i) => (
        <OrbitRing key={i} config={cfg} />
      ))}
    </group>
  );
}
