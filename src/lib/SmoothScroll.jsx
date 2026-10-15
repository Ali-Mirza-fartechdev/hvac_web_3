import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReduced } from './motion'
import { emitScroll, state } from './scroll'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Native fallback (reduced motion): still broadcast scroll for header / footer logic
    if (prefersReduced()) {
      let last = window.scrollY
      const h = () => {
        const y = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        emitScroll({ y, dir: y >= last ? 1 : -1, velocity: y - last, progress: max > 0 ? y / max : 0 })
        last = y
      }
      window.addEventListener('scroll', h, { passive: true })
      return () => window.removeEventListener('scroll', h)
    }

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true })
    state.lenis = lenis
    lenis.on('scroll', (e) => {
      ScrollTrigger.update()
      emitScroll({ y: e.scroll, dir: e.direction || 1, velocity: e.velocity, progress: e.progress })
    })
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      state.lenis = null
    }
  }, [])

  return children
}
