import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/motion'
import { useWebGL, whenReady, hexRGB, rng, radialTexture, usePhoto } from './useWebGL'

/* ------------------------------------------------------------------ */
/*  Moods — one scene, three atmospheres                               */
/* ------------------------------------------------------------------ */
const MOODS = {
  dusk: {
    sky: ['#0b2749', '#36597f', '#f2a35a', '#6c3626'],
    sun: '#ffb27a', sunI: 2.1, fog: '#2a4262', fogNear: 22, fogFar: 62,
    ground: '#1b271c', hemi: ['#2c4f80', '#1a1912', 0.85],
    glow: 1, stars: 1, snow: 0, smoke: 0, exposure: 1.05,
    air: ['#79d0ff', '#ffb27a'], windows: 'warm',
  },
  winter: {
    sky: ['#15283e', '#4b6a8d', '#e8b995', '#8f9fb1'],
    sun: '#ffc79a', sunI: 1.6, fog: '#51687f', fogNear: 18, fogFar: 52,
    ground: '#d9e1e8', hemi: ['#7898bd', '#c7d1db', 1.1],
    glow: 1.15, stars: 0.5, snow: 1, smoke: 1, exposure: 1.0,
    air: ['#ffd09a', '#ff8a4d'], windows: 'warm',
  },
  day: {
    sky: ['#4c86c6', '#9cc3e8', '#d9e8f3', '#bcd3e6'],
    sun: '#fff0d4', sunI: 3.0, fog: '#bcd3e6', fogNear: 30, fogFar: 80,
    ground: '#5b7a4e', hemi: ['#c3dcf4', '#6b7d52', 1.2],
    glow: 0.25, stars: 0, snow: 0, smoke: 0, exposure: 1.0,
    air: ['#8fdcff', '#f4fbff'], windows: 'day',
  },
}

/* ------------------------------------------------------------------ */
/*  Procedural textures                                                */
/* ------------------------------------------------------------------ */
function glassTexture(THREE, cols, rows, kind = 'warm', seed = 3, size = 512) {
  const r = rng(seed)
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const g = c.getContext('2d')
  const gr = g.createLinearGradient(0, 0, 0, size)
  if (kind === 'day') {
    gr.addColorStop(0, '#b9d6ee')
    gr.addColorStop(1, '#6f8ea2')
  } else {
    gr.addColorStop(0, '#ffe0a8')
    gr.addColorStop(0.5, '#ffb35f')
    gr.addColorStop(1, '#d97530')
  }
  g.fillStyle = gr
  g.fillRect(0, 0, size, size)
  // interior silhouettes: beams, shelves, furniture
  for (let i = 0; i < 26; i++) {
    const w = size * (0.04 + r() * 0.16)
    const h = size * (0.03 + r() * 0.14)
    g.fillStyle = `rgba(${kind === 'day' ? '30,50,70' : '70,34,10'},${0.1 + r() * 0.3})`
    g.fillRect(r() * size, size * (0.25 + r() * 0.7), w, h)
  }
  // chandelier + pendants
  g.fillStyle = kind === 'day' ? 'rgba(255,255,255,.7)' : 'rgba(255,248,210,.95)'
  for (let i = 0; i < 6; i++) {
    g.beginPath()
    g.arc(size * (0.34 + r() * 0.32), size * (0.2 + r() * 0.12), size * 0.012, 0, 7)
    g.fill()
  }
  // mullions
  g.strokeStyle = '#120e0b'
  g.lineWidth = size / 46
  for (let i = 0; i <= cols; i++) {
    const x = Math.round((i * size) / cols)
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x, size); g.stroke()
  }
  for (let j = 0; j <= rows; j++) {
    const y = Math.round((j * size) / rows)
    g.beginPath(); g.moveTo(0, y); g.lineTo(size, y); g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function shingleTexture(THREE, hex, { rows = 18, cols = 9, vary = 0.22, seed = 7, repeat = [1, 1] } = {}) {
  const r = rng(seed)
  const [R, G, B] = hexRGB(hex)
  const s = 512
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  g.fillStyle = hex
  g.fillRect(0, 0, s, s)
  const rh = s / rows
  const cw = s / cols
  for (let j = 0; j < rows; j++) {
    const off = (j % 2) * cw * 0.5
    for (let i = -1; i < cols + 1; i++) {
      const k = 1 - vary / 2 + r() * vary
      g.fillStyle = `rgb(${Math.min(255, R * k) | 0},${Math.min(255, G * k) | 0},${Math.min(255, B * k) | 0})`
      g.fillRect(i * cw + off, j * rh, cw - 2, rh - 1.5)
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat[0], repeat[1])
  t.anisotropy = 4
  return t
}

function stoneTexture(THREE, seed = 11, repeat = [2, 1]) {
  const r = rng(seed)
  const s = 512
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  g.fillStyle = '#4a443c'
  g.fillRect(0, 0, s, s)
  let y = 0
  while (y < s) {
    const h = 34 + r() * 36
    let x = -r() * 60
    while (x < s) {
      const w = 60 + r() * 90
      const k = 0.7 + r() * 0.5
      g.fillStyle = `rgb(${(138 * k) | 0},${(126 * k) | 0},${(112 * k) | 0})`
      g.fillRect(x + 2, y + 2, w - 4, h - 4)
      x += w
    }
    y += h
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat[0], repeat[1])
  t.anisotropy = 4
  return t
}

/* ------------------------------------------------------------------ */
/*  Shaders                                                            */
/* ------------------------------------------------------------------ */
const SKY_VERT = /* glsl */ `
varying vec3 vP;
void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`
const SKY_FRAG = /* glsl */ `
varying vec3 vP;
uniform vec3 uTop, uMid, uHor, uBot, uSun; uniform float uStars;
void main(){
  float h = vP.y;
  vec3 col = mix(uMid, uTop, smoothstep(0.0, .62, h));
  col = mix(uHor, col, smoothstep(0.0, .3, h));
  col = mix(uHor, uBot, smoothstep(0.0, -.35, h)) * step(h, 0.0) + col * step(0.0, h);
  vec3 sd = normalize(vec3(.78,.1,-.55));
  float s = max(dot(vP, sd), 0.);
  col += uSun * (pow(s, 14.) * .85 + pow(s, 3.) * .16);
  vec3 g = floor(vP * 210.);
  float n = fract(sin(dot(g, vec3(12.9898,78.233,45.164))) * 43758.5453);
  col += vec3(step(.9987, n)) * uStars * smoothstep(.22, .7, h);
  gl_FragColor = vec4(col, 1.);
}`

const AIR_VERT = /* glsl */ `
uniform float uTime, uSize, uPix; uniform vec3 uA, uB, uFrom, uTo;
attribute vec4 aSeed; varying float vA; varying vec3 vC;
void main(){
  float t = fract(aSeed.x + uTime * aSeed.y * .07);
  float e = t*t*(3.-2.*t);
  vec3 from = uFrom + (aSeed.zwz - .5) * vec3(.5,.9,.5);
  vec3 to = uTo + (vec3(aSeed.w, aSeed.z, aSeed.x) - .5) * vec3(3.6,2.6,1.2);
  vec3 p = mix(from, to, e);
  float amp = sin(t*3.14159) * .9;
  p += amp * vec3(sin(aSeed.w*50.+uTime*.9+t*6.), cos(aSeed.z*40.+uTime*.7+t*5.)*.7, sin(aSeed.x*30.-uTime*.8+t*4.)) * .55;
  p.y += sin(t*3.14159) * 1.2;
  vec4 mv = modelViewMatrix * vec4(p,1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (.5 + aSeed.z) * (1. - t*.35) * (300. / -mv.z) * uPix;
  vA = sin(t*3.14159) * (.35 + aSeed.w*.65);
  vC = mix(uA, uB, smoothstep(.15,.85,t));
}`
const SOFT_FRAG = /* glsl */ `
varying float vA; varying vec3 vC;
void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d); gl_FragColor = vec4(vC, a * vA); }`

const SNOW_VERT = /* glsl */ `
uniform float uTime, uPix; attribute vec4 aSeed; varying float vA;
void main(){
  vec3 p = position;
  p.y = mod(p.y - uTime * (.6 + aSeed.x * .9), 15.);
  p.x += sin(uTime * .4 + aSeed.y * 30.) * .6;
  p.z += cos(uTime * .35 + aSeed.z * 30.) * .5;
  vec4 mv = modelViewMatrix * vec4(p,1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.2 + aSeed.w * 2.2) * (260. / -mv.z) * uPix;
  vA = .35 + aSeed.w * .5;
}`
const SNOW_FRAG = /* glsl */ `
varying float vA;
void main(){ float d = length(gl_PointCoord - .5); gl_FragColor = vec4(vec3(1.), smoothstep(.5, .1, d) * vA); }`
const SMOKE_VERT = /* glsl */ `
uniform float uTime, uPix; uniform vec3 uOrigin; attribute vec4 aSeed; varying float vA;
void main(){
  float t = fract(aSeed.x + uTime * .06);
  vec3 p = uOrigin + vec3(t * 2.6 + sin(t*6.+aSeed.y*20.) * .35, t * 5.5, cos(t*5.+aSeed.z*20.) * .3);
  vec4 mv = modelViewMatrix * vec4(p,1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (14. + t * 70.) * (.6 + aSeed.w * .5) * (60. / -mv.z) * uPix;
  vA = (1. - t) * smoothstep(0., .12, t) * .22;
}`
const SMOKE_FRAG = /* glsl */ `
varying float vA;
void main(){ float d = length(gl_PointCoord - .5); gl_FragColor = vec4(vec3(.78,.74,.7), smoothstep(.5,.05,d) * vA); }`

/* ------------------------------------------------------------------ */
/*  Geometry helpers                                                   */
/* ------------------------------------------------------------------ */
function makeHelpers(THREE) {
  const box = (w, h, d, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.position.set(x, y, z)
    return m
  }
  // Two roof slabs + triangular gable walls (front/back)
  const gable = (w, rise, depth, roofMat, wallMat, x, y, z, ov = 0.55) => {
    const grp = new THREE.Group()
    const half = w / 2 + ov
    const drop = (ov * rise) / (w / 2)
    const L = Math.hypot(half, rise + drop)
    const a = Math.atan2(rise + drop, half)
    ;[-1, 1].forEach((s) => {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(L, 0.2, depth + ov * 1.2), roofMat)
      slab.position.set((s * half) / 2, (rise - drop) / 2 + 0.05, 0)
      slab.rotation.z = -s * a
      grp.add(slab)
    })
    const tri = new THREE.Shape()
    tri.moveTo(-w / 2, 0); tri.lineTo(w / 2, 0); tri.lineTo(0, rise); tri.closePath()
    const wallGeo = new THREE.ShapeGeometry(tri)
    ;[1, -1].forEach((s) => {
      const f = new THREE.Mesh(wallGeo, wallMat)
      f.position.z = (s * depth) / 2
      if (s < 0) f.rotation.y = Math.PI
      grp.add(f)
    })
    grp.position.set(x, y, z)
    return grp
  }
  return { box, gable }
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */
function buildHouse({ THREE, renderer, size, pointer, el }, mood, ui) {
  const M = MOODS[mood]
  const { box, gable } = makeHelpers(THREE)
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(M.fog, M.fogNear, M.fogFar)
  renderer.toneMappingExposure = M.exposure

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200)
  const world = new THREE.Group()
  scene.add(world)

  /* sky */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: SKY_VERT, fragmentShader: SKY_FRAG,
    uniforms: {
      uTop: { value: new THREE.Color(M.sky[0]) }, uMid: { value: new THREE.Color(M.sky[1]) },
      uHor: { value: new THREE.Color(M.sky[2]) }, uBot: { value: new THREE.Color(M.sky[3]) },
      uSun: { value: new THREE.Color(M.sun) }, uStars: { value: M.stars },
    },
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 16), skyMat)
  scene.add(sky)

  /* lights */
  scene.add(new THREE.HemisphereLight(M.hemi[0], M.hemi[1], M.hemi[2]))
  const sun = new THREE.DirectionalLight(M.sun, M.sunI)
  sun.position.set(14, 6, -9)
  scene.add(sun)
  const fill = new THREE.DirectionalLight('#7da2d6', 0.35)
  fill.position.set(-10, 8, 14)
  scene.add(fill)

  /* ground */
  const groundMat = new THREE.MeshStandardMaterial({ color: M.ground, roughness: 1 })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(420, 320), groundMat)
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  /* materials */
  const timberTex = shingleTexture(THREE, '#5b3d2a', { rows: 22, cols: 6, vary: 0.28, seed: 5, repeat: [2, 1] })
  const timber = new THREE.MeshStandardMaterial({ map: timberTex, roughness: 0.9 })
  const gableTex = shingleTexture(THREE, '#5b3d2a', { rows: 22, cols: 6, vary: 0.28, seed: 6, repeat: [0.45, 0.45] })
  const gableWall = new THREE.MeshStandardMaterial({ map: gableTex, roughness: 0.9 })
  const roofTex = shingleTexture(THREE, '#2d3036', { rows: 16, cols: 12, vary: 0.2, seed: 9, repeat: [3, 2] })
  const roof = new THREE.MeshStandardMaterial({ map: roofTex, roughness: 0.85 })
  const stoneTex = stoneTexture(THREE, 12, [2, 1])
  const stone = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 1 })
  const dark = new THREE.MeshStandardMaterial({ color: '#16120f', roughness: 0.6 })
  const wood = new THREE.MeshStandardMaterial({ color: '#7a4a2a', roughness: 0.7 })
  const kind = M.windows
  const glass = (cols, rows, seed) =>
    new THREE.MeshBasicMaterial({ map: glassTexture(THREE, cols, rows, kind, seed), toneMapped: false })
  const glassMats = []

  const house = new THREE.Group()
  world.add(house)

  // foundation
  house.add(box(13.4, 0.9, 7.2, stone, 0, 0.45, 0.4))
  // central block + gable
  house.add(box(5.4, 3.8, 5, timber, 0, 2.8, -0.4))
  house.add(gable(5.4, 2.5, 5.2, roof, gableWall, 0, 4.7, -0.4))
  // left wing
  house.add(box(3.8, 2.8, 4.4, timber, -4.8, 2.3, 0.3))
  house.add(gable(3.8, 1.5, 4.6, roof, gableWall, -4.8, 3.7, 0.3, 0.5))
  // right wing
  house.add(box(3.8, 2.8, 4.4, timber, 4.9, 2.3, 0.3))
  house.add(gable(3.8, 1.5, 4.6, roof, gableWall, 4.9, 3.7, 0.3, 0.5))
  // chimney
  house.add(box(1.0, 3.4, 1.0, stone, 3.2, 6.9, -1.2))
  house.add(box(1.3, 0.18, 1.3, dark, 3.2, 8.68, -1.2))

  // stone flanks
  ;[-2.25, 2.25].forEach((x) => house.add(box(1.0, 3.8, 0.5, stone, x, 2.8, 2.25)))

  // great window
  const gw = glass(4, 5, 3)
  glassMats.push(gw)
  const bigGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.5), gw)
  bigGlass.position.set(0, 2.85, 2.13)
  house.add(bigGlass)
  house.add(box(3.7, 0.12, 0.3, dark, 0, 4.64, 2.2))
  house.add(box(3.7, 0.12, 0.3, dark, 0, 1.06, 2.2))
  // attic window in the gable wall
  const attic = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.0), glass(2, 2, 4))
  attic.position.set(0, 5.5, 2.24)
  house.add(attic)

  // wing windows
  const wingWins = [[-5.7, 2.5], [-3.9, 2.5], [4.0, 2.5], [5.8, 2.5]]
  wingWins.forEach(([x, y], i) => {
    const g = glass(2, 3, 20 + i)
    glassMats.push(g)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.4), g)
    m.position.set(x, y, 2.52)
    house.add(m)
    house.add(box(1.1, 0.08, 0.16, dark, x, y + 0.74, 2.54))
  })

  // entry porch
  house.add(gable(3.2, 1.2, 2.2, roof, gableWall, -3.0, 3.35, 3.4, 0.35))
  ;[-4.45, -1.55].forEach((x) => house.add(box(0.22, 2.5, 0.22, wood, x, 2.1, 4.4)))
  house.add(box(3.3, 0.18, 0.3, wood, -3.0, 3.38, 4.45))
  const door = box(0.95, 2.1, 0.1, wood, -3.0, 1.95, 2.55)
  house.add(door)
  const doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.2), new THREE.MeshBasicMaterial({ color: '#ffc27a', toneMapped: false }))
  doorGlow.position.set(-3.0, 2.2, 2.62)
  house.add(doorGlow)
  // steps
  for (let i = 0; i < 3; i++) house.add(box(2.3 - i * 0.12, 0.28, 0.55, stone, -3.0, 0.76 - i * 0.28, 4.35 + i * 0.5))

  // right-side outdoor room (warm glow + posts)
  const patio = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.8), new THREE.MeshBasicMaterial({ color: '#ff9f55', toneMapped: false, transparent: true, opacity: 0.55 }))
  patio.position.set(7.9, 1.7, 0.6)
  patio.rotation.y = -Math.PI / 2
  house.add(patio)

  // lanterns (+ real light)
  const lanternSpots = [[-1.15, 2.25, 2.5], [-4.9, 2.4, 2.58], [1.2, 2.25, 2.5]]
  const haloTex = radialTexture(THREE)
  const lights = []
  lanternSpots.forEach(([x, y, z]) => {
    const l = new THREE.PointLight('#ffb066', 14 * M.glow + 3, 9, 2)
    l.position.set(x, y, z + 0.5)
    house.add(l)
    lights.push(l)
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 * M.glow }))
    s.scale.set(1.8, 1.8, 1)
    s.position.set(x, y, z + 0.15)
    house.add(s)
    house.add(box(0.16, 0.3, 0.16, new THREE.MeshBasicMaterial({ color: '#ffe3b0', toneMapped: false }), x, y, z + 0.1))
  })
  // window halos
  const halos = []
  ;[[0, 2.85, 2.5, 6.2, 5.6], [-5.7, 2.5, 2.8, 2.6, 2.8], [-3.9, 2.5, 2.8, 2.6, 2.8], [4.0, 2.5, 2.8, 2.6, 2.8], [5.8, 2.5, 2.8, 2.6, 2.8]].forEach(([x, y, z, sw, sh]) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.42 * M.glow, color: '#ffa850' }))
    s.scale.set(sw, sh, 1)
    s.position.set(x, y, z)
    house.add(s)
    halos.push(s)
  })

  /* landscape — conifers, rounded trees */
  const leafMat = new THREE.MeshStandardMaterial({ color: mood === 'day' ? '#2f5a2f' : '#142a1d', roughness: 1, flatShading: true, emissive: mood === 'winter' ? '#0c1a14' : '#050d08' })
  const leafMat2 = new THREE.MeshStandardMaterial({ color: mood === 'day' ? '#4f7d3a' : '#1c3a26', roughness: 1, flatShading: true })
  const snowCap = mood === 'winter'
  const trunk = new THREE.MeshStandardMaterial({ color: '#2a1c14', roughness: 1 })
  const conifer = (x, z, h, s = 1) => {
    const g = new THREE.Group()
    g.add(box(0.3 * s, h * 0.25, 0.3 * s, trunk, 0, h * 0.125, 0))
    for (let i = 0; i < 4; i++) {
      const rr = (1.7 - i * 0.34) * s
      const cone = new THREE.Mesh(new THREE.ConeGeometry(rr, h * 0.34, 7), snowCap && i % 2 ? new THREE.MeshStandardMaterial({ color: '#dfe7ee', flatShading: true }) : leafMat)
      cone.position.y = h * 0.28 + i * h * 0.19
      g.add(cone)
    }
    g.position.set(x, 0, z)
    return g
  }
  const round = (x, z, h) => {
    const g = new THREE.Group()
    g.add(box(0.36, h * 0.5, 0.36, trunk, 0, h * 0.25, 0))
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(new THREE.IcosahedronGeometry(h * (0.28 - i * 0.025), 1), snowCap ? new THREE.MeshStandardMaterial({ color: '#8a96a0', flatShading: true }) : leafMat2)
      b.position.set((Math.sin(i * 2.1) * h) * 0.2, h * (0.55 + i * 0.1), (Math.cos(i * 1.7) * h) * 0.18)
      g.add(b)
    }
    g.position.set(x, 0, z)
    return g
  }
  ;[[-11, -3, 9.5], [-9.4, 1.8, 7.4], [-13, 4, 10.5], [11.5, -3.4, 9], [13, 2, 11.5], [-7, -7, 11], [6.6, -8, 10], [10, 7.5, 6.8]].forEach(([x, z, h]) => world.add(conifer(x, z, h, h / 8)))
  ;[[-8.6, 7.8, 6.8], [8.2, 9.5, 5.8], [-15, -6, 9]].forEach(([x, z, h]) => world.add(round(x, z, h)))

  // shrubs / hydrangea / grasses (instanced)
  const shrubGeo = new THREE.IcosahedronGeometry(0.5, 1)
  const shrubMat = new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true })
  const N = 150
  const shrubs = new THREE.InstancedMesh(shrubGeo, shrubMat, N)
  const rr = rng(77)
  const dummy = new THREE.Object3D()
  const col = new THREE.Color()
  for (let i = 0; i < N; i++) {
    const front = rr() > 0.35
    const x = front ? -9.5 + rr() * 19 : -12 + rr() * 24
    const z = front ? 3.6 + rr() * 2.4 : 5 + rr() * 9
    if (x > -4.2 && x < -1.7 && z < 6.5) { dummy.position.set(0, -10, 0) } else dummy.position.set(x, 0.18 + rr() * 0.12, z)
    const s = 0.4 + rr() * 0.8
    dummy.scale.set(s * (0.8 + rr() * 0.6), s * (0.5 + rr() * 0.4), s * (0.8 + rr() * 0.6))
    dummy.rotation.y = rr() * 6
    dummy.updateMatrix()
    shrubs.setMatrixAt(i, dummy.matrix)
    const k = rr()
    if (mood === 'winter') col.set(k > 0.5 ? '#e9eef2' : '#b8c4cc')
    else if (k > 0.86) col.set(mood === 'day' ? '#ecebe4' : '#cfd3c8')
    else col.setHSL(0.27 + rr() * 0.07, 0.38, (mood === 'day' ? 0.28 : 0.13) + rr() * 0.09)
    shrubs.setColorAt(i, col)
  }
  world.add(shrubs)

  // stepping-stone path
  const slabMat = new THREE.MeshStandardMaterial({ color: mood === 'winter' ? '#c9d2d8' : '#8d8579', roughness: 1 })
  for (let i = 0; i < 11; i++) {
    const t = i / 10
    const x = -3.0 + t * 1.5 + Math.sin(t * 5) * 0.35
    const z = 6 + t * 9.2
    const s = box(1.3 - t * 0.1, 0.07, 0.8 + t * 0.35, slabMat, x, 0.04, z)
    s.rotation.y = Math.sin(i * 7.3) * 0.18
    world.add(s)
  }

  /* heat pump condenser + labelled hotspot */
  const hp = new THREE.Group()
  hp.add(box(1.5, 1.0, 0.6, new THREE.MeshStandardMaterial({ color: '#cfccc4', roughness: 0.5, metalness: 0.2 }), 0, 0.5, 0))
  const fan = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32), new THREE.MeshStandardMaterial({ color: '#1a1b1c', roughness: 0.4 }))
  fan.position.set(0, 0.52, 0.31)
  hp.add(fan)
  const fanBlades = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.34, 3, 1), new THREE.MeshBasicMaterial({ color: '#40464a', side: THREE.DoubleSide }))
  fanBlades.position.set(0, 0.52, 0.32)
  hp.add(fanBlades)
  const led = box(0.07, 0.07, 0.03, new THREE.MeshBasicMaterial({ color: '#7dffb0', toneMapped: false }), 0.58, 0.88, 0.31)
  hp.add(led)
  hp.position.set(7.2, 0, 3.7)
  hp.rotation.y = -0.35
  world.add(hp)
  const hpPoint = new THREE.Vector3(7.0, 1.5, 3.8)

  /* airflow particles */
  const COUNT = 1500
  const seeds = new Float32Array(COUNT * 4)
  const pr = rng(5)
  for (let i = 0; i < COUNT * 4; i++) seeds[i] = pr()
  const airGeo = new THREE.BufferGeometry()
  airGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3))
  airGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  airGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
  const pix = renderer.getPixelRatio()
  const airMat = new THREE.ShaderMaterial({
    vertexShader: AIR_VERT, fragmentShader: SOFT_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uSize: { value: 11 }, uPix: { value: pix },
      uA: { value: new THREE.Color(M.air[0]) }, uB: { value: new THREE.Color(M.air[1]) },
      uFrom: { value: new THREE.Vector3(6.6, 0.8, 4.0) }, uTo: { value: new THREE.Vector3(0.4, 3.0, 3.0) },
    },
  })
  const air = new THREE.Points(airGeo, airMat)
  air.frustumCulled = false
  world.add(air)

  /* ambient: fireflies / snow / chimney smoke */
  let snow = null, smoke = null, flies = null
  if (M.snow) {
    const n = 900
    const pos = new Float32Array(n * 3), sd = new Float32Array(n * 4)
    const sr = rng(31)
    for (let i = 0; i < n; i++) { pos[i * 3] = -22 + sr() * 44; pos[i * 3 + 1] = sr() * 15; pos[i * 3 + 2] = -12 + sr() * 30; sd.set([sr(), sr(), sr(), sr()], i * 4) }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(sd, 4))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
    snow = new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: SNOW_VERT, fragmentShader: SNOW_FRAG, transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 }, uPix: { value: pix } } }))
    snow.frustumCulled = false
    world.add(snow)
  } else if (mood === 'dusk') {
    const n = 70
    const pos = new Float32Array(n * 3), sd = new Float32Array(n * 4)
    const fr = rng(41)
    for (let i = 0; i < n; i++) { pos[i * 3] = -9 + fr() * 18; pos[i * 3 + 1] = fr() * 2; pos[i * 3 + 2] = 3 + fr() * 9; sd.set([fr(), fr(), fr(), fr()], i * 4) }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(sd, 4))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
    flies = new THREE.Points(g, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPix: { value: pix } },
      vertexShader: `uniform float uTime,uPix; attribute vec4 aSeed; varying float vA; void main(){ vec3 p=position; p.x+=sin(uTime*.35+aSeed.x*20.)*1.4; p.y+=1.2+sin(uTime*.5+aSeed.y*20.)*.8; p.z+=cos(uTime*.3+aSeed.z*20.)*1.2; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=(3.5+aSeed.w*3.)*(260./-mv.z)*uPix; vA=.35+.65*sin(uTime*(1.+aSeed.w*2.)+aSeed.x*30.)*.5+.3; }`,
      fragmentShader: `varying float vA; void main(){ float d=length(gl_PointCoord-.5); gl_FragColor=vec4(1.,.86,.5,smoothstep(.5,0.,d)*vA); }`,
    }))
    flies.frustumCulled = false
    world.add(flies)
  }
  if (M.smoke) {
    const n = 90
    const sd = new Float32Array(n * 4)
    const sr = rng(55)
    for (let i = 0; i < n * 4; i++) sd[i] = sr()
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(sd, 4))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
    smoke = new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: SMOKE_VERT, fragmentShader: SMOKE_FRAG, transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 }, uPix: { value: pix }, uOrigin: { value: new THREE.Vector3(3.2, 8.9, -1.2) } } }))
    smoke.frustumCulled = false
    house.add(smoke)
  }

  /* camera rig: intro + scroll + pointer */
  const rig = { dist: 15.6, lift: 3.1, yaw: 0, scroll: 0, fov: 36 }
  const target = new THREE.Vector3(0, 3.4, 0)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced) {
    rig.dist = 27; rig.lift = 8; rig.yaw = -0.5
    whenReady(() => gsap.to(rig, { dist: 15.6, lift: 3.1, yaw: 0, duration: 3.2, ease: 'expo.out', delay: 0.1 }))
  }
  const st = ScrollTrigger.create({
    trigger: el.closest('[data-hero]') || el,
    start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (self) => (rig.scroll = self.progress),
  })

  const v = new THREE.Vector3()
  const flicker = (t) => 0.92 + Math.sin(t * 7.1) * 0.025 + Math.sin(t * 13.7 + 1.3) * 0.02

  return {
    scene, camera,
    resize(w, h) {
      // keep the house framed on narrow canvases
      rig.fov = w / h < 0.9 ? 50 : w / h < 1.25 ? 42 : 36
      camera.fov = rig.fov
      camera.updateProjectionMatrix()
    },
    update(t) {
      airMat.uniforms.uTime.value = t
      if (snow) snow.material.uniforms.uTime.value = t
      if (flies) flies.material.uniforms.uTime.value = t
      if (smoke) smoke.material.uniforms.uTime.value = t
      fanBlades.rotation.z = -t * 14
      const f = flicker(t)
      lights.forEach((l, i) => (l.intensity = (14 * M.glow + 3) * (f + Math.sin(t * 3 + i) * 0.03)))
      halos.forEach((h, i) => (h.material.opacity = (0.42 * M.glow) * (f + Math.sin(t * 2 + i * 2) * 0.04)))
      led.material.color.set(Math.sin(t * 3) > 0 ? '#7dffb0' : '#2f8f5b')

      const px = pointer.x, py = pointer.y
      const s = rig.scroll
      const d = rig.dist - s * 4.4
      const ang = rig.yaw + px * 0.14 - s * 0.18
      camera.position.set(Math.sin(ang) * d + px * 0.4, rig.lift + py * 0.45 + s * 1.5, Math.cos(ang) * d)
      target.set(px * 0.3 - s * 0.6, 3.4 + s * 0.9, 0)
      camera.lookAt(target)

      // heat-pump hotspot label follows the 3D position
      if (ui.label) {
        v.copy(hpPoint).applyMatrix4(world.matrixWorld).project(camera)
        const x = (v.x * 0.5 + 0.5) * size.w
        const y = (-v.y * 0.5 + 0.5) * size.h
        ui.label.style.transform = `translate3d(${x}px, ${y}px, 0)`
        ui.label.style.opacity = v.z < 1 && x > 0 && x < size.w - 20 ? 1 : 0
      }
    },
    dispose() {
      st.kill()
    },
  }
}

/* ------------------------------------------------------------------ */
/*  React component                                                    */
/* ------------------------------------------------------------------ */
export default function HouseScene({
  mood = 'dusk',
  caption = 'Craftsman Residence — Hydronic & Multi-Zone Heat Pump Installation',
  tag = 'Verified Blueprint',
  hotspot = 'Inverter heat pump · 24 dBA',
  className = '',
  photo,
}) {
  const label = useRef(null)
  const hasPhoto = usePhoto(photo)
  const host = useWebGL((ctx) => buildHouse(ctx, mood, { label: label.current }), [mood, hasPhoto], { disabled: hasPhoto })

  return (
    <figure className={`stage stage--house ${className}`} data-reveal="clip">
      <div className="stage__frame" data-clip-inner>
        {hasPhoto ? (
          <img className="stage__img" src={photo} alt={caption} />
        ) : (
          <>
            <div ref={host} className="gl-host" role="img" aria-label={caption} />
            <span ref={label} className="hotspot" aria-hidden="true">
              <i />
              <b>{hotspot}</b>
            </span>
          </>
        )}
      </div>
      <figcaption className="stage__caption">
        <span className="stage__caption-l">
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M4.5 1 1 13M4.5 1 8 13M2.5 8h4" /></svg>
          {caption}
        </span>
        <span className="chip">{tag}</span>
      </figcaption>
    </figure>
  )
}
