import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReduced } from '../lib/motion'
import { state } from '../lib/scroll'
import { site } from '../data/site'
import Icon from './Icon'

const OPTIONS = ['AC Installation & Replacement', 'AC Repair & Diagnostics', 'Heating & Furnace', 'Indoor Air Quality', 'Maintenance Plan', 'Not sure yet']

/**
 * In-home consultation request. There is no backend on a static Vercel deploy, so the
 * form composes a mailto: — swap `submit()` for a Formspree / Resend / API route call when ready.
 */
export default function ScheduleDialog() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const root = useRef(null)
  const panel = useRef(null)

  useEffect(() => {
    const o = () => { setSent(false); setOpen(true) }
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('vd:schedule', o)
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('vd:schedule', o); window.removeEventListener('keydown', k) }
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    state.lenis && (open ? state.lenis.stop() : state.lenis.start())
    if (open) {
      gsap.set(el, { display: 'block' })
      if (prefersReduced()) return
      gsap.fromTo(el.querySelector('.dlg__scrim'), { opacity: 0 }, { opacity: 1, duration: 0.5 })
      gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: 'vd' })
      gsap.fromTo(el.querySelectorAll('[data-f]'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'vd', stagger: 0.05, delay: 0.25 })
      el.querySelector('input')?.focus({ preventScroll: true })
    } else if (!prefersReduced()) {
      gsap.to(panel.current, { xPercent: 100, duration: 0.6, ease: 'vdInOut' })
      gsap.to(el.querySelector('.dlg__scrim'), { opacity: 0, duration: 0.5, onComplete: () => gsap.set(el, { display: 'none' }) })
    } else gsap.set(el, { display: 'none' })
  }, [open])

  const submit = (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    const body = `Name: ${f.name}\nPhone: ${f.phone}\nZIP: ${f.zip}\nService: ${f.service}\n\n${f.note || ''}`
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('In-home evaluation request')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div ref={root} className="dlg" style={{ display: 'none' }} role="dialog" aria-modal="true" aria-label="Schedule an in-home evaluation">
      <div className="dlg__scrim" onClick={() => setOpen(false)} />
      <div ref={panel} className="dlg__panel">
        <button className="dlg__x" onClick={() => setOpen(false)} aria-label="Close" type="button"><Icon name="close" size={18} /></button>
        {sent ? (
          <div className="dlg__done">
            <Icon name="badge" size={34} />
            <h2>Request prepared.</h2>
            <p>Your email app should have opened with the details. Prefer to talk? Our dispatch desk is on <a href={`tel:${site.tel}`}>{site.phone}</a>.</p>
            <button className="btn btn--dark" onClick={() => setOpen(false)} type="button"><span className="btn__fill" /><span className="btn__roll"><span>Close</span><span aria-hidden="true">Close</span></span></button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="eyebrow eyebrow--terracotta" data-f><span className="eyebrow__rule" /><span>In-home evaluation</span></p>
            <h2 data-f>Tell us about your home.</h2>
            <p className="dlg__lead" data-f>A senior, non-commissioned technician will confirm a window within one business day. No sales pressure.</p>
            <label data-f><span>Full name</span><input name="name" required autoComplete="name" /></label>
            <div className="dlg__row" data-f>
              <label><span>Phone</span><input name="phone" type="tel" required autoComplete="tel" /></label>
              <label><span>ZIP code</span><input name="zip" inputMode="numeric" pattern="[0-9]{5}" required autoComplete="postal-code" /></label>
            </div>
            <label data-f><span>What do you need?</span>
              <select name="service" defaultValue={OPTIONS[0]}>{OPTIONS.map((o) => <option key={o}>{o}</option>)}</select>
            </label>
            <label data-f><span>Anything we should know? <em>(optional)</em></span><textarea name="note" rows="3" /></label>
            <button className="btn btn--dark dlg__submit" type="submit" data-f><span className="btn__fill" /><span className="btn__roll"><span>Request evaluation</span><span aria-hidden="true">Request evaluation</span></span></button>
          </form>
        )}
      </div>
    </div>
  )
}
