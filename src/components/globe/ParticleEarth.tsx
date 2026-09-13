import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, GLOBE } from './constants';
import { sampleProceduralLand } from './utils';
import { particleFragment, particleVertex } from './shaders';

export default function ParticleEarth() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const { positions, sizes, land } = sampleProceduralLand(GLOBE.landParticles, GLOBE.radius);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aLand', new THREE.BufferAttribute(land, 1));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={{
          uTime: { value: 0 },
          uPurple: { value: new THREE.Color(COLORS.purple) },
          uPink: { value: new THREE.Color(COLORS.pink) },
          uBlue: { value: new THREE.Color(COLORS.blue) },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
