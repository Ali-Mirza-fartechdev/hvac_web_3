import { useWebGL } from './useWebGL'

const V = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`
const F = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform vec3 uColor; uniform float uAlpha;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.02+7.1; a*=.5; } return v; }
void main(){
  vec2 p = vUv; p.x *= uRes.x / uRes.y;
  vec2 m = uMouse; m.x *= uRes.x / uRes.y;
  float d = length(p - m);
  p += normalize(p - m + 1e-4) * exp(-d * 3.2) * .09;          // field bends around the cursor
  float f = fbm(p * 1.6 + vec2(uTime * .018, -uTime * .012));
  f += fbm(p * 3.1 - uTime * .01) * .25;
  float v = f * 11.;
  float w = fwidth(v);
  float line = 1. - smoothstep(0., w * 1.6, abs(fract(v - .5) - .5));
  float major = 1. - smoothstep(0., w * 2.2, abs(fract(v / 4. - .5) - .5) * 4.);
  float a = (line * .22 + major * .28) * uAlpha;
  a *= smoothstep(1.2, .2, length(vUv - .5) * 1.4);
  gl_FragColor = vec4(uColor, a);
}`

function build({ THREE, pointer }, { color, alpha }) {
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const mat = new THREE.ShaderMaterial({
    vertexShader: V, fragmentShader: F, transparent: true,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(.5, .5) },
      uColor: { value: new THREE.Color(color) }, uAlpha: { value: alpha },
    },
  })
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat))
  const m = new THREE.Vector2()
  return {
    scene, camera,
    resize(w, h) { mat.uniforms.uRes.value.set(w, h) },
    update(t) {
      mat.uniforms.uTime.value = t
      m.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5)
      mat.uniforms.uMouse.value.lerp(m, 0.2)
    },
  }
}

/** Isoline "pressure map" — decorative, pointer-reactive background for dark sections. */
export default function ContourField({ color = '#fdb78e', alpha = 1, className = '' }) {
  const host = useWebGL((ctx) => build(ctx, { color, alpha }), [color, alpha], { alpha: true, tone: false, noAA: true })
  return <div ref={host} className={`contour ${className}`} aria-hidden="true" />
}
