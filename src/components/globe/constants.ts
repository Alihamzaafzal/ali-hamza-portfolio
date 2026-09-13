import * as THREE from 'three';

export const COLORS = {
  bg: '#050505',
  space: '#090B12',
  purple: '#2563EB',
  pink: '#38BDF8',
  blue: '#32C5FF',
  cyan: '#67E8F9',
  deep: '#1D4ED8',
  white: '#FFFFFF',
} as const;

export const GLOBE = {
  radius: 1.55,
  rotationSpeed: (Math.PI * 2) / 30,
  landParticles: 16000,
  dustParticles: 2400,
  cameraFov: 35,
  cameraDistance: 4.5,
  maxTiltDeg: 8,
  groupOffsetX: 0.15,
} as const;

export const CITIES = [
  { lat: 40.7, lon: -74, hot: true },
  { lat: 51.5, lon: -0.1, hot: true },
  { lat: 35.7, lon: 139.7, hot: true },
  { lat: 25.2, lon: 55.3, hot: true },
  { lat: 37.8, lon: -122.4, hot: true },
  { lat: 19.1, lon: 72.9, hot: true },
  { lat: -33.9, lon: 151.2 },
  { lat: 1.35, lon: 103.8 },
] as const;

export const ROUTES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 4], [4, 2], [5, 3], [6, 2], [7, 4], [1, 7],
];

export const RING_CONFIG = [
  { radius: 2.05, tube: 0.007, tilt: [0.35, 0.15, 0.08] as THREE.EulerTuple, speed: 0.12, opacity: 0.55 },
  { radius: 2.22, tube: 0.006, tilt: [-0.55, 0.55, 0.18] as THREE.EulerTuple, speed: -0.09, opacity: 0.48 },
  { radius: 2.38, tube: 0.005, tilt: [0.12, -0.85, 0.35] as THREE.EulerTuple, speed: 0.07, opacity: 0.38 },
  { radius: 2.52, tube: 0.004, tilt: [1.05, 0.25, -0.15] as THREE.EulerTuple, speed: -0.14, opacity: 0.42 },
];
