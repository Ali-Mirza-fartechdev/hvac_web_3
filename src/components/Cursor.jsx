import { useEffect, useRef } from 'react'
import { gsap, isFinePointer, prefersReduced } from '../lib/motion'

/** Precision ring cursor — grows on interactive elements, shows a label on [data-cursor] */
export default function Cursor() {
  const ring = useRef(null)
  const dot = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return
    document.documentElement.classList.add('has-cursor')
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08 })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08 })
    const move = (e) => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY) }
    const over = (e) => {
      if (!e.target.closest) return
      const t = e.target.closest('a, button, input, [data-cursor]')
      const txt = e.target.closest('[data-cursor]')?.dataset.cursor
      ring.current.classList.toggle('is-link', !!t)
      ring.current.classList.toggle('is-label', !!txt)
      label.current.textContent = txt || ''
    }
    const down = () => ring.current.classList.add('is-down')
    const up = () => ring.current.classList.remove('is-down')
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor" aria-hidden="true"><span ref={label} /></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
