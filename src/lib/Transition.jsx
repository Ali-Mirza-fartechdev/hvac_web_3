import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, prefersReduced } from './motion'
import { scrollToTarget, state } from './scroll'

const Ctx = createContext({ go: () => {} })
export const useGo = () => useContext(Ctx).go

export const ROUTE_LABELS = {
  '/': 'Home',
  '/services': 'Our Services',
  '/service-areas': 'Service Areas',
  '/maintenance-plans': 'Maintenance Plans',
  '/heating-furnace': 'Heating & Furnace',
  '/ac-repair': 'AC Repair & Diagnostics',
  '/ac-installation': 'AC Installation',
}
const ORDER = Object.keys(ROUTE_LABELS)

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()
  const root = useRef(null)
  const panel = useRef(null)
  const label = useRef(null)
  const busy = useRef(false)
  const pendingHash = useRef('')
  const first = useRef(true)

  const jumpHash = useCallback((h) => {
    if (!h) return
    setTimeout(() => scrollToTarget(h.startsWith('#') ? h : `#${h}`, { offset: -90 }), 60)
  }, [])

  const go = useCallback(
    (to) => {
      const [path, h] = to.split('#')
      if (h === 'schedule') {
        window.dispatchEvent(new Event('vd:schedule'))
        return
      }
      const target = path || pathname
      if (target === pathname) {
        h ? jumpHash(h) : scrollToTarget(0)
        return
      }
      if (busy.current) return
      pendingHash.current = h || ''
      if (prefersReduced()) {
        navigate(target)
        return
      }
      busy.current = true
      window.__vdNav = true
      const idx = ORDER.indexOf(target)
      label.current.textContent = `${String(Math.max(idx, 0) + 1).padStart(2, '0')} — ${ROUTE_LABELS[target] || 'Verdant & Co.'}`
      gsap
        .timeline({ onComplete: () => navigate(target) })
        .set(root.current, { display: 'block' })
        .fromTo(panel.current, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'vdInOut' })
        .fromTo(label.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'vd' }, '-=0.35')
    },
    [navigate, pathname, jumpHash]
  )

  // Play the reveal half after the new route has mounted
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    state.lenis ? state.lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0)
    if (!busy.current) {
      jumpHash(pendingHash.current || hash)
      pendingHash.current = ''
      return
    }
    gsap
      .timeline({
        delay: 0.25,
        onComplete: () => {
          busy.current = false
          gsap.set(root.current, { display: 'none' })
          jumpHash(pendingHash.current)
          pendingHash.current = ''
        },
      })
      .to(label.current, { opacity: 0, y: -24, duration: 0.45, ease: 'power2.in' })
      .to(panel.current, { yPercent: -100, duration: 0.85, ease: 'vdInOut' }, '-=0.15')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div ref={root} className="curtain" aria-hidden="true">
        <div ref={panel} className="curtain__panel">
          <span ref={label} className="curtain__label" />
        </div>
      </div>
    </Ctx.Provider>
  )
}
