import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS, GLOBE } from './constants';
import { buildLatLongGrid } from './utils';

export default function DigitalShell() {
  const gridGeo = useMemo(() => buildLatLongGrid(GLOBE.radius + 0.008), []);

  return (
    <group>
      {/* Semi-transparent ocean shell */}
      <mesh>
        <sphereGeometry args={[GLOBE.radius - 0.01, 64, 64]} />
        <meshStandardMaterial
          color={COLORS.space}
          transparent
          opacity={0.35}
          roughness={0.9}
          metalness={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe hex-ish mesh */}
      <mesh>
        <icosahedronGeometry args={[GLOBE.radius + 0.004, 4]} />
        <meshBasicMaterial
          color={COLORS.blue}
          wireframe
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Lat / long grid */}
      <lineSegments geometry={gridGeo}>
        <lineBasicMaterial
          color={COLORS.blue}
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Neon edge ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GLOBE.radius + 0.002, 0.003, 8, 180]} />
        <meshBasicMaterial
          color={COLORS.blue}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
