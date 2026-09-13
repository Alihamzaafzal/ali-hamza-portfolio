import * as THREE from 'three';
import { GLOBE } from './constants';

/** Simplified continent silhouettes — procedural, no texture assets. */
const LANDMASSES = [
  { lat: 48, lon: -98, dLat: 24, dLon: 48 }, // North America
  { lat: -12, lon: -58, dLat: 32, dLon: 26 }, // South America
  { lat: 54, lon: 12, dLat: 18, dLon: 28 }, // Europe
  { lat: 4, lon: 18, dLat: 34, dLon: 38 }, // Africa
  { lat: 38, lon: 92, dLat: 28, dLon: 58 }, // Asia
  { lat: -22, lon: 134, dLat: 16, dLon: 28 }, // Australia
  { lat: 72, lon: -42, dLat: 8, dLon: 35 }, // Greenland / Arctic
  { lat: -78, lon: 0, dLat: 10, dLon: 80 }, // Antarctica fringe
];

function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(lat: number, lon: number) {
  const x = lat * 0.08;
  const y = lon * 0.08;
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(a, b, ux),
    THREE.MathUtils.lerp(c, d, ux),
    uy,
  );
}

export function isProceduralLand(lat: number, lon: number): boolean {
  let landScore = 0;
  for (const m of LANDMASSES) {
    const dLat = (lat - m.lat) / m.dLat;
    const dLon = (lon - m.lon) / m.dLon;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < 1) {
      landScore = Math.max(landScore, 1 - dist);
    }
  }
  const n = valueNoise(lat, lon) * 0.35 + valueNoise(lat * 2.1, lon * 2.1) * 0.2;
  return landScore + n > 0.42;
}

export function latLonToVec3(lat: number, lon: number, radius: number = GLOBE.radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function sampleProceduralLand(
  count: number,
  radius: number,
): { positions: Float32Array; sizes: Float32Array; land: Float32Array } {
  const positions: number[] = [];
  const sizes: number[] = [];
  const land: number[] = [];
  let tries = 0;

  while (positions.length / 3 < count && tries < count * 80) {
    tries += 1;
    const lon = Math.random() * 360 - 180;
    const lat = Math.random() * 180 - 90;
    const isLand = isProceduralLand(lat, lon);
    const p = latLonToVec3(lat, lon, radius + (isLand ? 0.012 : 0.006));

    if (isLand) {
      positions.push(p.x, p.y, p.z);
      sizes.push(0.012 + Math.random() * 0.018);
      land.push(0.85 + Math.random() * 0.15);
    } else if (Math.random() > 0.92) {
      positions.push(p.x, p.y, p.z);
      sizes.push(0.006 + Math.random() * 0.008);
      land.push(0.08);
    }
  }

  return {
    positions: new Float32Array(positions),
    sizes: new Float32Array(sizes),
    land: new Float32Array(land),
  };
}

export function sampleLandFromMap(
  texture: THREE.Texture,
  count: number,
  radius: number,
): { positions: Float32Array; sizes: Float32Array; land: Float32Array } {
  const img = texture.image as CanvasImageSource | undefined;
  const positions: number[] = [];
  const sizes: number[] = [];
  const land: number[] = [];

  if (!img) {
    return {
      positions: new Float32Array(0),
      sizes: new Float32Array(0),
      land: new Float32Array(0),
    };
  }

  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return {
      positions: new Float32Array(0),
      sizes: new Float32Array(0),
      land: new Float32Array(0),
    };
  }

  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  let tries = 0;

  while (positions.length / 3 < count && tries < count * 60) {
    tries += 1;
    const u = Math.random();
    const v = Math.random();
    const x = Math.min(w - 1, Math.floor(u * w));
    const y = Math.min(h - 1, Math.floor(v * h));
    const i = (y * w + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (r + g + b) / 3;
    const isWater = b > r + 16 && b > g + 6 && lum < 145;
    const isLand = !isWater && lum > 24;

    const lon = u * 360 - 180;
    const lat = 90 - v * 180;
    const p = latLonToVec3(lat, lon, radius + (isLand ? 0.012 : 0.006));

    if (isLand) {
      positions.push(p.x, p.y, p.z);
      sizes.push(0.012 + Math.random() * 0.018);
      land.push(0.85 + Math.random() * 0.15);
    } else if (Math.random() > 0.92) {
      positions.push(p.x, p.y, p.z);
      sizes.push(0.006 + Math.random() * 0.008);
      land.push(0.08);
    }
  }

  return {
    positions: new Float32Array(positions),
    sizes: new Float32Array(sizes),
    land: new Float32Array(land),
  };
}

export function buildLatLongGrid(radius: number) {
  const positions: number[] = [];
  const push = (a: THREE.Vector3, b: THREE.Vector3) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
  };

  for (let lat = -75; lat <= 75; lat += 12) {
    let prev: THREE.Vector3 | null = null;
    for (let lon = -180; lon <= 180; lon += 3) {
      const cur = latLonToVec3(lat, lon, radius);
      if (prev) push(prev, cur);
      prev = cur;
    }
  }

  for (let lon = -180; lon < 180; lon += 18) {
    let prev: THREE.Vector3 | null = null;
    for (let lat = -85; lat <= 85; lat += 3) {
      const cur = latLonToVec3(lat, lon, radius);
      if (prev) push(prev, cur);
      prev = cur;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

export function buildArcGeometry(a: THREE.Vector3, b: THREE.Vector3, segments = 72) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().lerpVectors(a, b, t).normalize();
    const lift = 1 + 0.22 * Math.sin(Math.PI * t);
    points.push(p.multiplyScalar(GLOBE.radius * lift));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}
