import { useRef } from 'react'
import { useWebGL, usePhoto } from './useWebGL'

const V = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`
const F = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uOn;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.03; a*=.5; } return v; }
float sdBox(vec2 p, vec2 b){ vec2 d=abs(p)-b; return length(max(d,0.))+min(max(d.x,d.y),0.); }
float sdCap(vec2 p, vec2 a, vec2 b, float r){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
float fill(float d){ return smoothstep(.012, -.012, d); }

float heat(vec2 uv){
  vec2 p = uv - .5; p.x *= uRes.x / uRes.y;
  float h = .1;
  // furnace cabinet + burner core
  h += fill(sdBox(p - vec2(-.16,-.04), vec2(.17,.31))) * .30;
  h += exp(-pow(length((p - vec2(-.16,.1)) * vec2(1.,1.5)) * 5.2, 2.)) * .62;
  h += fill(sdBox(p - vec2(-.16,-.2), vec2(.12,.05))) * .12;
  // supply / return copper lines
  h += fill(sdBox(p - vec2(-.46,.04), vec2(.014,.42))) * .34;
  h += fill(sdBox(p - vec2(-.41,.04), vec2(.011,.42))) * .5;
  h += fill(sdBox(p - vec2(-.16,.37), vec2(.22,.012))) * .28;
  // technician (kneeling) — head, torso, arm, thigh
  h += fill(length(p - vec2(.24,.17)) - .052) * .66;
  h += fill(sdCap(p, vec2(.24,.115), vec2(.23,-.07), .07)) * .55;
  h += fill(sdCap(p, vec2(.22,.08), vec2(.03,-.01), .024)) * .6;
  h += fill(sdCap(p, vec2(.23,-.07), vec2(.3,-.22), .058)) * .46;
  // water heater, right back
  h += fill(sdBox(p - vec2(.42,.02), vec2(.07,.26))) * .22;
  // convective shimmer + sensor noise
  float n = fbm(uv * vec2(7., 12.) + vec2(0., -uTime * .18));
  h += (n - .5) * .16 * (.3 + h);
  // cursor spot
  vec2 m = uMouse - .5; m.x *= uRes.x / uRes.y;
  h += exp(-pow(length(p - m) * 7., 2.)) * .55 * uOn;
  return clamp(h, 0., 1.);
}
vec3 iron(float t){
  vec3 c0=vec3(.02,0.,.07), c1=vec3(.22,0.,.42), c2=vec3(.72,.08,.3), c3=vec3(.98,.33,.08), c4=vec3(1.,.78,.18), c5=vec3(1.,.97,.86);
  if(t<.2) return mix(c0,c1,t/.2);
  if(t<.45) return mix(c1,c2,(t-.2)/.25);
  if(t<.65) return mix(c2,c3,(t-.45)/.2);
  if(t<.85) return mix(c3,c4,(t-.65)/.2);
  return mix(c4,c5,(t-.85)/.15);
}
void main(){
  // coarse "sensor" pixels
  vec2 cells = floor(uRes / 5.);
  vec2 uv = (floor(vUv * cells) + .5) / cells;
  float h = heat(uv);
  vec3 col = iron(h);
  // scanlines, vignette, faint grid ticks
  col *= .9 + .1 * sin(vUv.y * uRes.y * 1.1);
  col *= smoothstep(1.15, .35, length(vUv - .5) * 1.5);
  vec2 g = abs(fract(vUv * vec2(12., 8.)) - .5);
  col += vec3(.04) * step(.485, max(g.x, g.y)) ;
  gl_FragColor = vec4(col, 1.);
}`

function build({ THREE, renderer, pointer }, ui) {
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const mat = new THREE.ShaderMaterial({
    vertexShader: V, fragmentShader: F,
    uniforms: { uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(.5, .5) }, uOn: { value: 0 } },
  })
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat))
  let on = 0
  const px = new THREE.Vector2()
  return {
    scene, camera,
    resize(w, h) { const pr = renderer.getPixelRatio(); mat.uniforms.uRes.value.set(w * pr, h * pr) },
    update(t) {
      mat.uniforms.uTime.value = t
      on += ((pointer.active ? 1 : 0) - on) * 0.08
      mat.uniforms.uOn.value = on
      px.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5)
      mat.uniforms.uMouse.value.lerp(px, 0.5)
      if (ui.cross) {
        const w = ui.cross.parentElement.clientWidth, h = ui.cross.parentElement.clientHeight
        ui.cross.style.transform = `translate3d(${px.x * w}px, ${(1 - px.y) * h}px, 0)`
        ui.cross.style.opacity = on
        // approximate readout from the same hot-spots the shader draws
        const x = px.x - 0.5, y = px.y - 0.5
        const core = Math.exp(-Math.pow(Math.hypot(x * 1.0 + 0.16 / (w / h), (y - 0.1) * 1.5) * 5.2 * (w / h), 2))
        const tech = Math.exp(-Math.pow(Math.hypot(x - 0.24 / (w / h), y - 0.02) * 4.5, 2))
        const f = 68 + core * 122 + tech * 32 + Math.sin(t * 2) * 0.4
        ui.read.textContent = `${f.toFixed(1)} °F`
      }
    },
  }
}

export default function ThermalField({ badge = 'NATE-Certified • Master Licensee', className = '', lines = ['IR THERMAL SCAN', 'Δ-T 18.2 °F', 'ΔP 0.43 in.wc'], photo }) {
  const cross = useRef(null), read = useRef(null)
  const hasPhoto = usePhoto(photo)
  const host = useWebGL((ctx) => build(ctx, { cross: cross.current, read: read.current }), [hasPhoto], { tone: false, noAA: true, disabled: hasPhoto })
  return (
    <figure className={`stage stage--thermal ${className}`} data-reveal="clip">
      <div className="stage__frame" data-clip-inner>
        {hasPhoto ? (
          <img className="stage__img" src={photo} alt="Technician measuring a furnace" />
        ) : (
          <>
            <div ref={host} className="gl-host" role="img" aria-label="Thermal imaging scan of a furnace room with a technician measuring airflow" />
            <div className="thermal-hud" aria-hidden="true">
              {lines.map((l) => <span key={l}>{l}</span>)}
            </div>
            <span ref={cross} className="crosshair" aria-hidden="true"><i /><b ref={read}>— °F</b></span>
          </>
        )}
        <span className="badge-dark">{badge}</span>
      </div>
    </figure>
  )
}
