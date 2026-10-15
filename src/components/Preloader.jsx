import { useEffect } from 'react'
import { gsap, prefersReduced } from '../lib/motion'

const ready = () => {
  window.__vdReady = true
  window.dispatchEvent(new Event('vd:ready'))
}

export default function Preloader() {
  useEffect(() => {
    const boot = document.getElementById('boot')
    if (!boot || prefersReduced()) {
      boot && boot.remove()
      ready()
      return
    }
    const seen = sessionStorage.getItem('vd-seen')
    sessionStorage.setItem('vd-seen', '1')
    boot.querySelector('i')?.remove()
    const bar = document.createElement('i')
    boot.appendChild(bar)
    const label = boot.querySelector('span')
    const minTime = seen ? 0.5 : 1.3
    const fontsReady = document.fonts.ready
    const tl = gsap.timeline({ paused: true })
    tl.fromTo(label, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'vd' }, 0)
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: minTime, ease: 'vdInOut' }, 0)
      .to(label, { y: -18, opacity: 0, duration: 0.5, ease: 'power2.in' }, '>0.1')
      .to(boot, { yPercent: -100, duration: 1, ease: 'vdInOut', onStart: () => setTimeout(ready, 350) }, '<0.1')
      .add(() => boot.remove())
    Promise.all([fontsReady, new Promise((r) => setTimeout(r, 120))]).then(() => tl.play())
    return () => tl.kill()
  }, [])
  return null
}
