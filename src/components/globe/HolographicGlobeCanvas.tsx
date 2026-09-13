import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE } from './constants';
import GlobeScene from './GlobeScene';

type Props = {
  transparent?: boolean;
};

export default function HolographicGlobeCanvas({ transparent = true }: Props) {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0.12, GLOBE.cameraDistance], fov: GLOBE.cameraFov, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <GlobeScene transparent={transparent} />
      </Suspense>
    </Canvas>
  );
}
