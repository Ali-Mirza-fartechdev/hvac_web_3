import { useEffect, useRef, useState } from 'react'
import { useWebGL } from './useWebGL'
import { communities } from '../data/communities'

const DOT_V = /* glsl */ `
uniform float uTime, uSweep, uPix; attribute float aR; attribute float aA; varying float vB; varying float vR;
void main(){
  float diff = mod(uSweep - aA + 6.28318, 6.28318);
  float sweep = exp(-diff * 2.6) * step(diff, 3.2);
  float ring = 1. - smoothstep(0., .014, abs(fract(aR * 3.) - .5) - .47);
  vB = .16 + sweep * .85 + ring * .5 + smoothstep(1., .85, aR) * .0;
  vR = aR;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.7 + sweep * 2.2 + ring * 1.2) * uPix * (14. / -mv.z) ;
}`
const DOT_F = /* glsl */ `
varying float vB; varying float vR;
void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .1, d) * vB * (1. - smoothstep(.9, 1., vR));
  gl_FragColor = vec4(mix(vec3(.62,.8,.86), vec3(1.,.72,.5), clamp(vB - .4, 0., 1.)), a); }`

function build({ THREE, renderer, pointer }, ui, hoverRef) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  const R = 4.4
  const grid = new THREE.Group()
  scene.add(grid)

  // hex dot-matrix
  const sp = 0.13
  const pts = [], rs = [], as = []
  for (let j = -40; j <= 40; j++)
    for (let i = -40; i <= 40; i++) {
      const x = (i + (j & 1) * 0.5) * sp, z = j * sp * 0.866
      const r = Math.hypot(x, z) / R
      if (r > 1) continue
      pts.push(x, 0, z); rs.push(r); as.push(Math.atan2(-z, x) < 0 ? Math.atan2(-z, x) + Math.PI * 2 : Math.atan2(-z, x))
    }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  g.setAttribute('aR', new THREE.Float32BufferAttribute(rs, 1))
  g.setAttribute('aA', new THREE.Float32BufferAttribute(as, 1))
  const mat = new THREE.ShaderMaterial({
    vertexShader: DOT_V, fragmentShader: DOT_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSweep: { value: 0 }, uPix: { value: renderer.getPixelRatio() } },
  })
  grid.add(new THREE.Points(g, mat))

  // boundary ring
  const ringGeo = new THREE.RingGeometry(R * 0.995, R * 1.005, 160)
  ringGeo.rotateX(-Math.PI / 2)
  grid.add(new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: '#fdb78e', transparent: true, opacity: 0.5, side: THREE.DoubleSide })))

  // nodes
  const nodes = communities.map((c) => {
    const a = (c.radar.ang * Math.PI) / 180
    const x = Math.cos(a) * c.radar.r * R, z = -Math.sin(a) * c.radar.r * R
    const grp = new THREE.Group()
    grp.position.set(x, 0.02, z)
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), new THREE.MeshBasicMaterial({ color: c.tier === 'priority' ? '#fdb78e' : '#d6e3e6' }))
    grp.add(core)
    const pg = new THREE.RingGeometry(0.09, 0.105, 40); pg.rotateX(-Math.PI / 2)
    const pulse = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: c.tier === 'priority' ? '#fdb78e' : '#d6e3e6', transparent: true, opacity: 0.8, side: THREE.DoubleSide }))
    grp.add(pulse)
    grid.add(grp)
    return { c, grp, core, pulse, phase: Math.random() * 6, v: new THREE.Vector3() }
  })
  // HQ marker
  const hq = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), new THREE.MeshBasicMaterial({ color: '#ffffff' }))
  hq.position.y = 0.05
  grid.add(hq)

  const v = new THREE.Vector3()
  return {
    scene, camera,
    resize(w, h) { camera.fov = w / h < 1 ? 36 : 30; camera.updateProjectionMatrix() },
    update(t) {
      mat.uniforms.uTime.value = t
      mat.uniforms.uSweep.value = (t * 0.7) % (Math.PI * 2)
      grid.rotation.y = pointer.x * 0.22 + Math.sin(t * 0.1) * 0.05
      const tilt = 0.88 + pointer.y * 0.08
      camera.position.set(0, Math.sin(tilt) * 13.4, Math.cos(tilt) * 13.4)
      camera.lookAt(0, 0, 0)
      hq.rotation.y = t * 0.8
      nodes.forEach((n, i) => {
        const hot = hoverRef.current === n.c.id
        const k = (t * 0.55 + n.phase) % 1
        const s = 1 + k * (hot ? 5.5 : 3.2)
        n.pulse.scale.set(s, s, s)
        n.pulse.material.opacity = (1 - k) * (hot ? 1 : 0.55)
        n.core.scale.setScalar(hot ? 1.7 : 1)
        // project to DOM label
        const el = ui.labels[i]
        if (el) {
          n.grp.getWorldPosition(v)
          v.project(camera)
          el.style.transform = `translate3d(${(v.x * 0.5 + 0.5) * ui.size.w}px, ${(-v.y * 0.5 + 0.5) * ui.size.h}px, 0)`
        }
      })
      if (ui.hq) {
        hq.getWorldPosition(v); v.project(camera)
        ui.hq.style.transform = `translate3d(${(v.x * 0.5 + 0.5) * ui.size.w}px, ${(-v.y * 0.5 + 0.5) * ui.size.h}px, 0)`
      }
    },
  }
}

export default function CoverageRadar({ className = '' }) {
  const labels = useRef([])
  const hqRef = useRef(null)
  const hoverRef = useRef(null)
  const wrap = useRef(null)
  const [active, setActive] = useState(null)
  const sizeRef = useRef({ w: 1, h: 1 })

  const host = useWebGL(
    (ctx) => {
      sizeRef.current = ctx.size
      return build(ctx, { labels: labels.current, hq: hqRef.current, size: ctx.size }, hoverRef)
    },
    [],
    { alpha: false }
  )

  // sync with directory table hovers elsewhere on the page
  useEffect(() => {
    const h = (e) => {
      hoverRef.current = e.detail
      setActive(e.detail)
    }
    window.addEventListener('community:hover', h)
    return () => window.removeEventListener('community:hover', h)
  }, [])

  const set = (id) => {
    hoverRef.current = id
    setActive(id)
  }
  const act = communities.find((c) => c.id === active)

  return (
    <figure className={`stage stage--radar ${className}`} data-reveal="clip" ref={wrap}>
      <div className="stage__frame stage__frame--dark" data-clip-inner>
        <div ref={host} className="gl-host" role="img" aria-label="Regional coverage matrix: a 35-mile core service radius with eight dispatch zones" />
        <span ref={hqRef} className="radar-hq" aria-hidden="true"><b>Studio</b></span>
        {communities.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => (labels.current[i] = el)}
            className={`radar-node ${active === c.id ? 'is-on' : ''} ${c.tier === 'priority' ? 'is-priority' : ''}`}
            onMouseEnter={() => set(c.id)}
            onMouseLeave={() => set(null)}
            onFocus={() => set(c.id)}
            onBlur={() => set(null)}
            type="button"
          >
            <span>{c.name}</span>
          </button>
        ))}
        <span className="radar-scale mono">R = 35 MI · 3 RINGS</span>
      </div>
      <figcaption className="stage__caption">
        <span className="stage__caption-l">
          <b className="cap-strong">{act ? act.name : 'Regional coverage matrix'}</b>
          <span className="cap-sub">{act ? `${act.eta} · ${act.response}` : 'Hover a zone to read dispatch time'}</span>
        </span>
        <span className="chip">{act ? (act.tier === 'priority' ? 'Zone 01' : 'Zone 02') : 'Live'}</span>
      </figcaption>
    </figure>
  )
}
