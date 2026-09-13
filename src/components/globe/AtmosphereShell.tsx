import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, GLOBE } from './constants';
import { atmosphereFragment, atmosphereVertex } from './shaders';

export default function AtmosphereShell() {
  const innerRef = useRef<THREE.ShaderMaterial>(null);
  const outerRef = useRef<THREE.ShaderMaterial>(null);

  const innerMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uTime: { value: 0 },
          uPurple: { value: new THREE.Color(COLORS.purple) },
          uPink: { value: new THREE.Color(COLORS.pink) },
          uBlue: { value: new THREE.Color(COLORS.blue) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    [],
  );

  const outerMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uTime: { value: 0 },
          uPurple: { value: new THREE.Color(COLORS.purple) },
          uPink: { value: new THREE.Color(COLORS.pink) },
          uBlue: { value: new THREE.Color(COLORS.blue) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (innerRef.current) innerRef.current.uniforms.uTime.value = t;
    if (outerRef.current) outerRef.current.uniforms.uTime.value = t;
  });

  return (
    <group>
      <mesh scale={1.08}>
        <sphereGeometry args={[GLOBE.radius, 64, 64]} />
        <primitive ref={innerRef} object={innerMat} attach="material" />
      </mesh>
      <mesh scale={1.18}>
        <sphereGeometry args={[GLOBE.radius, 48, 48]} />
        <primitive ref={outerRef} object={outerMat} attach="material" />
      </mesh>
      <mesh scale={1.28}>
        <sphereGeometry args={[GLOBE.radius, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.blue}
          transparent
          opacity={0.025}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
