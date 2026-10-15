import { useEffect, useRef, useState } from 'react'
import { SplitText, gsap, ScrollTrigger, prefersReduced } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import { site, footerCols, footerAreas, openStatus } from '../data/site'
import Icon from './Icon'
import { TLink, Button } from './UI'

export default function Footer() {
  const root = useRef(null)
  const mark = useRef(null)
  const ring = useRef(null)
  const [status, setStatus] = useState(() => openStatus())

  useEffect(() => {
    const id = setInterval(() => setStatus(openStatus()), 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el || prefersReduced()) return
    let ctx
    document.fonts.ready.then(() => {
      ctx = gsap.context(() => {
        const split = SplitText.create(mark.current, { type: 'chars' })
        gsap.from(split.chars, {
          yPercent: 115, duration: 1.3, ease: 'vd', stagger: 0.04,
          scrollTrigger: { trigger: mark.current, start: 'top 98%', once: true },
        })
        gsap.fromTo(el.querySelectorAll('.ft__col'), { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 1, ease: 'vd', stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
        // back-to-top ring fills with page progress
        ScrollTrigger.create({
          start: 0, end: 'max',
          onUpdate: (s) => ring.current && (ring.current.style.strokeDashoffset = 126 * (1 - s.progress)),
        })
      }, el)
    })
    return () => ctx && ctx.revert()
  }, [])

  return (
    <footer className="ft" ref={root}>
      <div className="wrap">
        <div className="ft__grid">
          <div className="ft__col ft__brand">
            <p className="ft__logo">VERDANT &amp; CO.</p>
            <p className="ft__tag">Heating &amp; Cooling Authority</p>
            <p className="ft__about">Environmental comfort conceived as an integrated architectural element. Delivering silent operation, zoned thermal precision, and balanced residential air systems.</p>
            <div className="ft__comp">
              <p className="ft__h2">Compliance</p>
              <p className="mono">{site.license}</p>
            </div>
          </div>

          {footerCols.map((c) => (
            <div className="ft__col" key={c.title}>
              <h3 className="ft__h">{c.title}</h3>
              <ul>
                {c.links.map(([t, to]) => (
                  <li key={t}>
                    <TLink to={to} className="ft__link"><span>{t}</span></TLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="ft__col">
            <h3 className="ft__h">Direct Inquiries &amp; Office</h3>
            <p className="ft__addr">{site.address.join(' ')}</p>
            <p className="ft__h2">Business hours</p>
            <p className="ft__small">Mon–Fri: 7:00 AM – 6:00 PM<br />Sat: 8:00 AM – 2:00 PM</p>
            <p className="ft__h2">Emergency service line</p>
            <a className="ft__phone" href={`tel:${site.tel}`}>{site.phone}</a>
            <p className={`ft__status ${status.open ? 'is-open' : ''}`}><i />{status.label}</p>
            <Button to="/#schedule" variant="light" className="ft__btn">Book Dispatch Online</Button>
          </div>
        </div>

        <div className="ft__areas">
          <b>Verified service areas:</b>
          <ul>{footerAreas.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>

        <div className="ft__legal">
          <p>© {new Date().getFullYear()} Verdant &amp; Co. Heating &amp; Cooling. Template 03: Designed by FAR Tech &amp; Developers.</p>
          <p><a href="#privacy">Privacy Policy</a><i /><a href="#terms">Terms of Service</a></p>
        </div>
      </div>

      <div className="ft__mark-wrap" aria-hidden="true">
        <p ref={mark} className="ft__mark">Verdant &amp; Co.</p>
      </div>

      <button className="totop" onClick={() => scrollToTarget(0, { duration: 1.8 })} aria-label="Back to top" type="button">
        <svg viewBox="0 0 44 44" width="44" height="44"><circle cx="22" cy="22" r="20" className="totop__bg" /><circle ref={ring} cx="22" cy="22" r="20" className="totop__ring" strokeDasharray="126" strokeDashoffset="126" /></svg>
        <Icon name="arrowUp" size={16} />
      </button>
    </footer>
  )
}
