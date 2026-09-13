export const particleVertex = /* glsl */ `
  attribute float aSize;
  attribute float aLand;
  varying float vLand;
  varying float vDepth;
  uniform float uTime;

  void main() {
    vLand = aLand;
    vec3 pos = position;
    float pulse = sin(uTime * 2.0 + aLand * 12.0 + pos.x * 3.0) * 0.004;
    pos += normalize(pos) * pulse;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    gl_PointSize = aSize * (340.0 / max(vDepth, 0.1));
    gl_PointSize = clamp(gl_PointSize, 0.5, 64.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export const particleFragment = /* glsl */ `
  varying float vLand;
  varying float vDepth;
  uniform vec3 uPurple;
  uniform vec3 uPink;
  uniform vec3 uBlue;
  uniform float uTime;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.22, d);
    float halo = 1.0 - smoothstep(0.08, 0.5, d);
    float flicker = 0.85 + 0.15 * sin(uTime * 3.5 + vLand * 20.0);

    vec3 landCol = mix(uBlue, mix(uPurple, uPink, 0.35), 0.55);
    vec3 oceanCol = uBlue * 0.28;
    vec3 col = mix(oceanCol, landCol, smoothstep(0.2, 0.85, vLand));

    float alpha = (core * 0.95 + halo * 0.55) * mix(0.35, 1.0, vLand) * flicker;
    gl_FragColor = vec4(col * (core * 2.4 + halo * 0.85), alpha);
  }
`;

export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3 uPurple;
  uniform vec3 uPink;
  uniform vec3 uBlue;
  uniform float uTime;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.8);
    float pulse = 0.88 + 0.12 * sin(uTime * 0.8);
    vec3 col = mix(uBlue, mix(uPurple, uPink, 0.25), fresnel);
    float alpha = fresnel * 0.38 * pulse;
    gl_FragColor = vec4(col, alpha);
  }
`;

export const ringVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFade;
  uniform float uTime;
  void main() {
    vUv = uv;
    vFade = 0.75 + 0.25 * sin(uTime * 1.2 + position.x * 4.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ringFragment = /* glsl */ `
  varying vec2 vUv;
  varying float vFade;
  uniform vec3 uPurple;
  uniform vec3 uPink;
  uniform float uOpacity;

  void main() {
    float edge = smoothstep(0.0, 0.15, vUv.y) * (1.0 - smoothstep(0.85, 1.0, vUv.y));
    vec3 col = mix(uPurple, uPink, vUv.x);
    gl_FragColor = vec4(col, edge * uOpacity * vFade);
  }
`;
