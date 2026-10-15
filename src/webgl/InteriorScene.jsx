import { useRef } from 'react'
import { useWebGL, rng, radialTexture, usePhoto } from './useWebGL'

function plankTexture(THREE) {
  const r = rng(21)
  const s = 512
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  const pw = s / 7
  for (let i = 0; i < 7; i++) {
    let y = -r() * 120
    while (y < s) {
      const h = 90 + r() * 160
      const k = 0.82 + r() * 0.3
      g.fillStyle = `rgb(${(196 * k) | 0},${(146 * k) | 0},${(96 * k) | 0})`
      g.fillRect(i * pw + 1, y + 1, pw - 2, h - 2)
      y += h
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(1.4, 2.2)
  t.anisotropy = 4
  return t
}

function forestWindow(THREE) {
  const r = rng(8)
  const w = 512, h = 640
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d')
  const gr = g.createLinearGradient(0, 0, 0, h)
  gr.addColorStop(0, '#f4f1e6'); gr.addColorStop(0.5, '#dfe6d6'); gr.addColorStop(1, '#a8b595')
  g.fillStyle = gr; g.fillRect(0, 0, w, h)
  for (let i = 0; i < 46; i++) {
    const x = r() * w
    g.fillStyle = `rgba(${40 + r() * 30},${70 + r() * 40},${45 + r() * 20},${0.25 + r() * 0.5})`
    g.fillRect(x, h * (0.1 + r() * 0.3), 5 + r() * 14, h)
    g.beginPath(); g.arc(x, h * (0.15 + r() * 0.4), 28 + r() * 60, 0, 7); g.fill()
  }
  g.strokeStyle = '#6b4a2b'; g.lineWidth = 10
  ;[0, w / 3, (2 * w) / 3, w].forEach((x) => { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke() })
  ;[0, h * 0.28, h].forEach((y) => { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke() })
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

const AIR_V = /* glsl */ `
uniform float uTime, uPix; attribute vec4 aSeed; varying float vA;
void main(){
  float side = aSeed.w > .5 ? 1. : -1.;
  float t = fract(aSeed.x + uTime * (.05 + aSeed.y * .04));
  vec3 p0 = vec3(side * 3.9, 3.1, -6. + aSeed.z * 12.);
  vec3 p1 = vec3(side * 1.4, 5.1, p0.z + sin(aSeed.y*9.) * .6);
  vec3 p2 = vec3(side * .15, 1.6 + aSeed.y * .5, p0.z + sin(aSeed.x*9.+uTime*.2) * 1.4);
  vec3 p = mix(mix(p0,p1,t), mix(p1,p2,t), t);
  p.z += sin(t * 6. + aSeed.z * 20. + uTime * .5) * .22;
  p.y += sin(t * 9. + aSeed.y * 20.) * .06;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (8. + aSeed.y * 8.) * (1. - t * .4) * (220. / -mv.z) * uPix;
  vA = sin(t * 3.14159) * (.18 + aSeed.y * .22);
}`
const AIR_F = /* glsl */ `
varying float vA;
void main(){ float d = length(gl_PointCoord - .5); gl_FragColor = vec4(.62,.8,.95, smoothstep(.5,.0,d) * vA); }`

function build({ THREE, renderer, pointer }, ui) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#e8dfce')
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80)
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra })
  const B = (w, h, d, m, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o }

  scene.add(new THREE.HemisphereLight('#fff3df', '#c8a67c', 1.35))
  const key = new THREE.DirectionalLight('#fff0d0', 2.1)
  key.position.set(1, 4, -9)
  scene.add(key)
  const warm = new THREE.PointLight('#ffc27a', 22, 12, 2)
  warm.position.set(0, 3.7, -1)
  scene.add(warm)

  const room = new THREE.Group()
  scene.add(room)

  // floor + rug
  const floorTex = plankTexture(THREE)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 14), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.55 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = -0.5
  room.add(floor)
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.2), new THREE.MeshStandardMaterial({ color: '#dcd3c2', roughness: 1 }))
  rug.rotation.x = -Math.PI / 2
  rug.position.set(0, 0.012, -2.7)
  room.add(rug)

  // walls
  const wall = std('#f1eadc')
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(14, 3.2), wall); wl.rotation.y = Math.PI / 2; wl.position.set(-4.5, 1.6, -0.5); room.add(wl)
  const wr = new THREE.Mesh(new THREE.PlaneGeometry(14, 3.2), wall); wr.rotation.y = -Math.PI / 2; wr.position.set(4.5, 1.6, -0.5); room.add(wr)
  const bw = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.2), wall); bw.position.set(0, 1.6, -7.5); room.add(bw)
  const tri = new THREE.Shape(); tri.moveTo(-4.5, 0); tri.lineTo(4.5, 0); tri.lineTo(0, 2.6)
  const gw = new THREE.Mesh(new THREE.ShapeGeometry(tri), wall); gw.position.set(0, 3.2, -7.5); room.add(gw)
  // back-wall windows (daylight forest)
  const fw = new THREE.MeshBasicMaterial({ map: forestWindow(THREE), toneMapped: false })
  const win = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 3.0), fw); win.position.set(0, 1.7, -7.46); room.add(win)
  const win2 = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.7), fw); win2.position.set(0, 4.0, -7.46); room.add(win2)

  // vaulted ceiling + exposed timber
  const ceil = new THREE.MeshStandardMaterial({ color: '#e0cfb0', roughness: 0.9, side: THREE.DoubleSide })
  const slope = Math.atan2(2.6, 4.5), L = Math.hypot(4.5, 2.6)
  ;[-1, 1].forEach((s) => {
    const geo = new THREE.PlaneGeometry(L, 14)
    geo.rotateX(-Math.PI / 2) // lie flat: x = slope length, z = room length
    const m = new THREE.Mesh(geo, ceil)
    m.position.set((s * 4.5) / 2, 4.5, -0.5)
    m.rotation.z = -s * slope
    room.add(m)
  })
  const beam = std('#a5733f')
  for (let z = -6.5; z <= 5.6; z += 2.4) {
    ;[-1, 1].forEach((s) => {
      const b = B(L, 0.2, 0.2, beam, (s * 4.5) / 2, 3.2 + 1.3 - 0.08, z)
      b.rotation.z = -s * slope
      room.add(b)
    })
    room.add(B(9, 0.18, 0.2, beam, 0, 3.25, z))
  }
  room.add(B(0.22, 0.22, 14, beam, 0, 5.78, -0.5))

  // linear slot diffusers
  const slotMat = new THREE.MeshStandardMaterial({ color: '#2a2c2c', roughness: 0.4, metalness: 0.5 })
  ;[-3.9, 3.9].forEach((x) => room.add(B(0.14, 0.05, 13.4, slotMat, x, 3.14, -0.5)))

  // fireplace
  const stone = std('#a59a88', { roughness: 1 })
  room.add(B(0.7, 3.0, 2.6, stone, 4.15, 1.5, -3.2))
  room.add(B(0.9, 0.2, 2.9, std('#8a806f'), 4.1, 0.1, -3.2))
  const fire = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), new THREE.MeshBasicMaterial({ color: '#ff9a4a', toneMapped: false }))
  fire.rotation.y = -Math.PI / 2; fire.position.set(3.78, 0.65, -3.2); room.add(fire)

  // furniture
  const fabric = std('#b8afa0', { roughness: 1 })
  room.add(B(2.9, 0.5, 1.1, fabric, -0.4, 0.45, -4.2))
  room.add(B(2.9, 0.65, 0.28, fabric, -0.4, 0.95, -4.65))
  room.add(B(0.28, 0.45, 1.1, fabric, -1.95, 0.7, -4.2)); room.add(B(0.28, 0.45, 1.1, fabric, 1.15, 0.7, -4.2))
  room.add(B(1.3, 0.34, 0.75, std('#c79c6a'), -0.4, 0.2, -2.8))
  const chairA = std('#9c6238'), chairB = std('#efe6d6', { roughness: 1 })
  room.add(B(0.9, 0.42, 0.9, chairA, 2.2, 0.35, -3.3)); room.add(B(0.9, 0.6, 0.2, chairA, 2.62, 0.8, -3.3))
  room.add(B(0.9, 0.42, 0.9, chairB, -2.6, 0.35, -2.6)); room.add(B(0.9, 0.6, 0.2, chairB, -3.02, 0.8, -2.6))
  // cabinetry back-left
  room.add(B(0.6, 2.4, 2.8, std('#8d6642'), -4.2, 1.2, -5.2))

  // chandelier
  const chand = new THREE.Group()
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.018, 8, 40), new THREE.MeshStandardMaterial({ color: '#14110f', roughness: 0.4, metalness: 0.7 }))
  ring.rotation.x = Math.PI / 2
  chand.add(ring)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.14, 6), new THREE.MeshBasicMaterial({ color: '#fff1c8', toneMapped: false }))
    cd.position.set(Math.cos(a) * 0.55, 0.09, Math.sin(a) * 0.55)
    chand.add(cd)
  }
  const chain = B(0.012, 1.8, 0.012, new THREE.MeshBasicMaterial({ color: '#1a1714' }), 0, 0.9, 0)
  chand.add(chain)
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture(THREE, 'rgba(255,214,150,0.9)', 'rgba(255,214,150,0)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
  halo.scale.set(3.4, 3.4, 1)
  chand.add(halo)
  chand.position.set(0, 3.7, -1.2)
  room.add(chand)

  // laminar airflow from the slot diffusers
  const N = 1400
  const sd = new Float32Array(N * 4)
  const r = rng(3)
  for (let i = 0; i < N * 4; i++) sd[i] = r()
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
  g.setAttribute('aSeed', new THREE.BufferAttribute(sd, 4))
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
  const airMat = new THREE.ShaderMaterial({
    vertexShader: AIR_V, fragmentShader: AIR_F, transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uPix: { value: renderer.getPixelRatio() } },
  })
  const air = new THREE.Points(g, airMat)
  air.frustumCulled = false
  room.add(air)

  const look = new THREE.Vector3(0, 2.3, -4)
  let lastDba = 0
  return {
    scene, camera,
    resize(w, h) { camera.fov = w / h < 1 ? 52 : 42; camera.updateProjectionMatrix() },
    update(t) {
      airMat.uniforms.uTime.value = t
      warm.intensity = 22 + Math.sin(t * 2.3) * 1.2
      camera.position.set(pointer.x * 0.9, 2.5 + pointer.y * 0.35 + Math.sin(t * 0.4) * 0.03, 10.2 - Math.abs(pointer.x) * 0.2)
      look.set(pointer.x * -0.4, 2.35, -4)
      camera.lookAt(look)
      if (ui.dba && t - lastDba > 0.6) {
        lastDba = t
        ui.dba.textContent = `< ${(23 + Math.sin(t * 1.7) * 0.9).toFixed(1)} dBA`
      }
    },
  }
}

export default function InteriorScene({ left = 'Discrete linear air diffusers', right = 'Sound rating', className = '', photo }) {
  const dba = useRef(null)
  const hasPhoto = usePhoto(photo)
  const host = useWebGL((ctx) => build(ctx, { dba: dba.current }), [hasPhoto], { disabled: hasPhoto })
  return (
    <figure className={`stage stage--interior ${className}`} data-reveal="clip">
      <div className="stage__frame" data-clip-inner>
        {hasPhoto ? <img className="stage__img" src={photo} alt="Vaulted living room with concealed linear air diffusers" /> : <div ref={host} className="gl-host" role="img" aria-label="Vaulted living room with concealed linear air diffusers" />}
      </div>
      <figcaption className="stage__caption stage__caption--light">
        <span className="stage__caption-l">{left}</span>
        <span className="stage__caption-r">
          {right}: <b ref={dba}>&lt; 24 dBA</b>
        </span>
      </figcaption>
    </figure>
  )
}
