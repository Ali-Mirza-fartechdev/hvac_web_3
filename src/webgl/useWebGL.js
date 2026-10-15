import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap, prefersReduced } from '../lib/motion'

/**
 * Mounts a WebGL renderer in a host element and drives a scene built by `setup`.
 *  - renders only while on screen and the tab is visible (battery friendly)
 *  - eases a normalised pointer (-1..1) relative to the host
 *  - caps pixel ratio, disposes everything on unmount
 *
 * setup({ THREE, renderer, el, pointer, size }) must return
 *   { scene, camera, update?(t, dt), resize?(w, h), dispose?() }
 */
export function useWebGL(setup, deps = [], opts = {}) {
  const host = useRef(null)

  useEffect(() => {
    const el = host.current
    if (!el || opts.disabled) return
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !opts.noAA,
        alpha: !!opts.alpha,
        powerPreference: 'high-performance',
      })
    } catch (e) {
      el.classList.add('webgl-fail')
      return
    }
    const dprMax = window.innerWidth < 768 ? 1.25 : 1.75
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    if (opts.tone !== false) renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = opts.exposure ?? 1
    renderer.domElement.className = 'gl-canvas'
    el.appendChild(renderer.domElement)

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false }
    const size = { w: 1, h: 1 }
    const api = setup({ THREE, renderer, el, pointer, size })

    const resize = () => {
      const r = el.getBoundingClientRect()
      size.w = Math.max(1, r.width)
      size.h = Math.max(1, r.height)
      renderer.setSize(size.w, size.h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      api.resize && api.resize(size.w, size.h)
      if (api.camera && api.camera.isPerspectiveCamera) {
        api.camera.aspect = size.w / size.h
        api.camera.updateProjectionMatrix()
      }
      if (reduced || !running) renderer.render(api.scene, api.camera)
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      pointer.tx = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1.3, 1.3)
      pointer.ty = THREE.MathUtils.clamp(-(((e.clientY - r.top) / r.height) * 2 - 1), -1.3, 1.3)
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      pointer.active = inside
    }

    const clock = new THREE.Clock()
    let running = false
    let visible = true
    const reduced = prefersReduced()

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06
      api.update && api.update(t, dt)
      renderer.render(api.scene, api.camera)
    }
    const start = () => {
      if (running || reduced) return
      running = true
      clock.getDelta()
      gsap.ticker.add(frame)
    }
    const stop = () => {
      if (!running) return
      running = false
      gsap.ticker.remove(frame)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(el)
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        visible && !document.hidden ? start() : stop()
      },
      { rootMargin: '120px' }
    )
    io.observe(el)
    const onVis = () => (visible && !document.hidden ? start() : stop())
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pointermove', onMove, { passive: true })

    resize()
    if (reduced) {
      api.update && api.update(2.0, 0.016)
      renderer.render(api.scene, api.camera)
    }

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      api.dispose && api.dispose()
      api.scene &&
        api.scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose()
          if (o.material) {
            const mats = Array.isArray(o.material) ? o.material : [o.material]
            mats.forEach((m) => {
              Object.values(m).forEach((v) => v && v.isTexture && v.dispose())
              m.dispose()
            })
          }
        })
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return host
}

// Run `cb` once the preloader has finished (or immediately if it already has)
export function whenReady(cb) {
  if (window.__vdReady) return cb()
  const h = () => cb()
  window.addEventListener('vd:ready', h, { once: true })
  return () => window.removeEventListener('vd:ready', h)
}

export const hexRGB = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Seeded PRNG so procedural textures are identical between renders
export function rng(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function radialTexture(THREE, inner = 'rgba(255,190,110,1)', outer = 'rgba(255,190,110,0)') {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, inner)
  gr.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.35)'))
  gr.addColorStop(1, outer)
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Resolves true if an optional photograph exists at `src` (checked via Image so an SPA
// rewrite that returns index.html for missing files can't give a false positive).
export function usePhoto(src) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    if (!src) return
    let alive = true
    const img = new Image()
    img.onload = () => alive && setOk(true)
    img.onerror = () => alive && setOk(false)
    img.src = src
    return () => { alive = false }
  }, [src])
  return ok
}
