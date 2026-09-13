import { Suspense } from 'react';
import { Stars } from '@react-three/drei';
import { COLORS } from './constants';
import GlobeRig, { CameraRig } from './GlobeRig';
import ParticleEarth from './ParticleEarth';
import DigitalShell from './DigitalShell';
import OrbitRings from './OrbitRings';
import NetworkLayer from './NetworkLayer';
import AtmosphereShell from './AtmosphereShell';
import SpaceDust from './SpaceDust';
import PostFX from './PostFX';

type Props = {
  transparent?: boolean;
};

export default function GlobeScene({ transparent = true }: Props) {
  return (
    <>
      <CameraRig />
      {!transparent && <color attach="background" args={[COLORS.bg]} />}
      {!transparent && <fog attach="fog" args={[COLORS.space, 6, 18]} />}

      <ambientLight intensity={0.18} color="#93c5fd" />
      <directionalLight position={[5, 3, 4]} intensity={1.05} color="#e0f2fe" />
      <directionalLight position={[-4, -2, -3]} intensity={0.28} color={COLORS.blue} />
      <pointLight position={[3, 1.5, 2]} intensity={1.1} color={COLORS.blue} distance={14} />
      <pointLight position={[-2, -1, 3]} intensity={0.75} color={COLORS.cyan} distance={12} />

      <Stars
        radius={100}
        depth={50}
        count={transparent ? 900 : 2200}
        factor={transparent ? 1.6 : 2.8}
        saturation={0.35}
        fade
        speed={0.35}
      />

      <GlobeRig>
        <Suspense fallback={null}>
          <DigitalShell />
          <ParticleEarth />
          <NetworkLayer />
          <AtmosphereShell />
        </Suspense>
        <OrbitRings />
        <SpaceDust />
      </GlobeRig>

      <PostFX transparent={transparent} />
    </>
  );
}
