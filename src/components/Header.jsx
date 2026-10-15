import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, prefersReduced } from '../lib/motion'
import { onScroll, state } from '../lib/scroll'
import { site, services, mainNav } from '../data/site'
import Icon, { LogoMark } from './Icon'
import { TLink, Button } from './UI'

export default function Header() {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [compact, setCompact] = useState(false)
  const [drop, setDrop] = useState(false)
  const [menu, setMenu] = useState(false)
  const bar = useRef(null)
  const dropRef = useRef(null)
  const menuRef = useRef(null)
  const closeT = useRef(null)

  // scroll behaviour: compact after 40px, hide on scroll down, show on scroll up, progress hairline
  useEffect(() => {
    return onScroll((s) => {
      setCompact(s.y > 40)
      if (s.y < 160) setHidden(false)
      else if (s.dir > 0 && s.velocity > 0.5) setHidden(true)
      else if (s.dir < 0 && s.velocity < -0.5) setHidden(false)
      if (bar.current) bar.current.style.transform = `scaleX(${s.progress || 0})`
    })
  }, [])

  useEffect(() => { setDrop(false); setMenu(false) }, [pathname])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && (setDrop(false), setMenu(false))
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  // dropdown choreography
  useEffect(() => {
    const el = dropRef.current
    if (!el || prefersReduced()) return
    if (drop) {
      gsap.set(el, { display: 'block' })
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'vd' })
      gsap.fromTo(el.querySelectorAll('[data-d]'), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'vd', stagger: 0.05, delay: 0.1 })
    } else {
      gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.4, ease: 'power3.in', onComplete: () => gsap.set(el, { display: 'none' }) })
    }
  }, [drop])

  // mobile menu choreography + scroll lock
  useEffect(() => {
    const el = menuRef.current
    document.documentElement.classList.toggle('menu-open', menu)
    state.lenis && (menu ? state.lenis.stop() : state.lenis.start())
    if (!el || prefersReduced()) return
    if (menu) {
      gsap.set(el, { display: 'flex' })
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.75, ease: 'vdInOut' })
      gsap.fromTo(el.querySelectorAll('[data-m]'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'vd', stagger: 0.06, delay: 0.3 })
    } else {
      gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'vdInOut', onComplete: () => gsap.set(el, { display: 'none' }) })
    }
  }, [menu])

  const openDrop = () => { clearTimeout(closeT.current); setDrop(true) }
  const closeDrop = () => { closeT.current = setTimeout(() => setDrop(false), 140) }

  return (
    <header className={`hdr ${hidden && !menu ? 'is-hidden' : ''} ${compact ? 'is-compact' : ''} ${menu ? 'is-menu' : ''}`}>
      <div className="hdr__util">
        <div className="wrap hdr__util-in">
          <p className="hdr__util-l">
            <span><Icon name="clock" size={12} /> {site.hoursLabel}</span>
            <i>/</i>
            <span className="hdr__area"><Icon name="pin" size={12} /> {site.areaLine}</span>
          </p>
          <a className="hdr__util-phone" href={`tel:${site.tel}`}><Icon name="phone" size={11} /> {site.phone}</a>
        </div>
      </div>

      <div className="hdr__main" onMouseLeave={closeDrop}>
        <div className="wrap hdr__main-in">
          <TLink to="/" className="logo" aria-label="Verdant & Co. — home">
            <LogoMark />
            <span className="logo__t">
              <span className="logo__name">VERDANT &amp; CO.</span>
              <span className="logo__sub">Architectural Heating &amp; Cooling</span>
            </span>
          </TLink>

          <nav className="nav" aria-label="Primary">
            {mainNav.map((n) => {
              const active = n.match && n.match.includes(pathname)
              return (
                <div key={n.label} className="nav__item" onMouseEnter={n.children ? openDrop : closeDrop}>
                  <TLink
                    to={n.to}
                    className={`nav__link ${active ? 'is-active' : ''}`}
                    aria-haspopup={n.children ? 'true' : undefined}
                    aria-expanded={n.children ? drop : undefined}
                    onFocus={n.children ? openDrop : undefined}
                  >
                    <span className="nav__roll"><span>{n.label}</span><span aria-hidden="true">{n.label}</span></span>
                    {n.children && <Icon name="chevron" size={12} className={`nav__chev ${drop ? 'is-open' : ''}`} />}
                  </TLink>
                </div>
              )
            })}
          </nav>

          <div className="hdr__right">
            <a className="hdr__line" href={`tel:${site.tel}`}>
              <small>Direct engineering line</small>
              <b>{site.phone}</b>
            </a>
            <Button to="/#schedule" variant="dark" className="hdr__cta">Schedule Service</Button>
            <button className="burger" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu((m) => !m)} type="button">
              <i /><i />
            </button>
          </div>
        </div>

        <div ref={dropRef} className="mega" style={{ display: 'none' }} onMouseEnter={openDrop} onMouseLeave={closeDrop}>
          <div className="wrap mega__in">
            <div className="mega__intro" data-d>
              <p className="eyebrow eyebrow--terracotta"><span className="eyebrow__rule" /><span>Five disciplines</span></p>
              <p className="mega__lede">One standard of quiet, measured craftsmanship.</p>
              <TLink to="/services" className="mega__all">All services <Icon name="arrow" size={13} /></TLink>
            </div>
            <ul className="mega__list">
              {services.map((s) => (
                <li key={s.to} data-d>
                  <TLink to={s.to} className="mega__item">
                    <span className="mega__no mono">{s.no}</span>
                    <span className="mega__tt">{s.title}</span>
                    <span className="mega__bl">{s.blurb}</span>
                    <Icon name="arrow" size={14} className="mega__ar" />
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div ref={bar} className="hdr__progress" />
      </div>

      <div ref={menuRef} className="mmenu" style={{ display: 'none' }}>
        <div className="mmenu__in">
          <nav aria-label="Mobile">
            {[['Home', '/'], ...services.map((s) => [s.title, s.to]), ['Maintenance Plans', '/maintenance-plans'], ['Service Areas', '/service-areas']]
              .filter((x, i, a) => a.findIndex((y) => y[1] === x[1]) === i)
              .map(([t, to], i) => (
                <div className="mmenu__row" key={to + t}>
                  <TLink to={to} data-m><span className="mono">{String(i + 1).padStart(2, '0')}</span>{t}</TLink>
                </div>
              ))}
          </nav>
          <div className="mmenu__foot">
            <a href={`tel:${site.tel}`} className="mmenu__phone">{site.phone}</a>
            <p>{site.hoursLabel.replaceAll('|', '·')}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
