import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import * as THREE from 'three';

const ChromaticShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    amount: { value: 0.0012 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    void main() {
      vec2 dir = (vUv - 0.5) * amount;
      float r = texture2D(tDiffuse, vUv + dir).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - dir).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
};

type Props = {
  transparent?: boolean;
};

/** Full post stack only for opaque scenes — bloom on transparent hero causes white blowout. */
export default function PostFX({ transparent = false }: Props) {
  const { gl, scene, camera, size } = useThree();

  useEffect(() => {
    gl.setClearColor(0x000000, transparent ? 0 : 1);
  }, [gl, transparent]);

  const composer = useMemo(() => {
    if (transparent) return null;

    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.85, 0.42, 0.22));
    c.addPass(new ShaderPass(ChromaticShader));

    const vignette = new ShaderPass(VignetteShader);
    vignette.uniforms.offset.value = 0.35;
    vignette.uniforms.darkness.value = 0.65;
    c.addPass(vignette);
    c.addPass(new FilmPass(0.25, false));

    return c;
  }, [gl, scene, camera, size.width, size.height, transparent]);

  useEffect(() => {
    composer?.setSize(size.width, size.height);
  }, [composer, size.width, size.height]);

  useEffect(() => () => composer?.dispose(), [composer]);

  useFrame(() => {
    if (composer) composer.render();
  }, transparent ? 0 : 1);

  return null;
}
