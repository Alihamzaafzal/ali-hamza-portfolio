import { useRef, useEffect, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE } from './constants';

const MAX_TILT = THREE.MathUtils.degToRad(GLOBE.maxTiltDeg);

export default function GlobeRig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const earth = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      target.current.x = THREE.MathUtils.clamp(ny * MAX_TILT, -MAX_TILT, MAX_TILT);
      target.current.y = THREE.MathUtils.clamp(nx * MAX_TILT, -MAX_TILT, MAX_TILT);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    current.current.x += (target.current.x - current.current.x) * 0.06;
    current.current.y += (target.current.y - current.current.y) * 0.06;

    if (group.current) {
      group.current.rotation.x = current.current.x;
      group.current.rotation.y = current.current.y;
    }
    if (earth.current) {
      earth.current.rotation.y += delta * GLOBE.rotationSpeed;
    }
  });

  return (
    <group ref={group} position={[GLOBE.groupOffsetX, 0, 0]}>
      <group ref={earth}>{children}</group>
    </group>
  );
}

export function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.12, GLOBE.cameraDistance);
    if ('fov' in camera) {
      (camera as THREE.PerspectiveCamera).fov = GLOBE.cameraFov;
      camera.updateProjectionMatrix();
    }
  }, [camera]);
  return null;
}
