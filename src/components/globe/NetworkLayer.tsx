import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, CITIES, ROUTES, GLOBE } from './constants';
import { buildArcGeometry, latLonToVec3 } from './utils';

export default function NetworkLayer() {
  const pulseRefs = useRef<THREE.Mesh[]>([]);

  const cityPos = useMemo(
    () => CITIES.map((c) => latLonToVec3(c.lat, c.lon, GLOBE.radius + 0.02)),
    [],
  );

  const arcs = useMemo(
    () =>
      ROUTES.map(([a, b]) => {
        const geo = buildArcGeometry(cityPos[a], cityPos[b]);
        const mat = new THREE.LineBasicMaterial({
          color: COLORS.cyan,
          transparent: true,
          opacity: 0.42,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        return { line: new THREE.Line(geo, mat), a: cityPos[a], b: cityPos[b] };
      }),
    [cityPos],
  );

  useEffect(
    () => () => {
      arcs.forEach(({ line }) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
    },
    [arcs],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const arc = arcs[i];
      if (!arc) return;
      const speed = 0.14 + (i % 5) * 0.025;
      const u = (t * speed + i * 0.09) % 1;
      const p = new THREE.Vector3().lerpVectors(arc.a, arc.b, u).normalize();
      const lift = 1 + 0.22 * Math.sin(Math.PI * u);
      mesh.position.copy(p.multiplyScalar(GLOBE.radius * lift));
      const s = 0.65 + Math.sin(t * 5 + i) * 0.35;
      mesh.scale.setScalar(s);
    });
  });

  return (
    <group>
      {arcs.map((arc, i) => (
        <primitive key={`arc-${i}`} object={arc.line} />
      ))}
      {arcs.map((_, i) => (
        <mesh
          key={`pulse-${i}`}
          ref={(el) => {
            if (el) pulseRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshBasicMaterial
            color={COLORS.cyan}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {cityPos.map((pos, i) => (
        <mesh key={`city-${i}`} position={pos}>
          <sphereGeometry args={['hot' in CITIES[i] && CITIES[i].hot ? 0.028 : 0.016, 12, 12]} />
          <meshBasicMaterial
            color={'hot' in CITIES[i] && CITIES[i].hot ? COLORS.cyan : COLORS.blue}
            transparent
            opacity={0.92}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
