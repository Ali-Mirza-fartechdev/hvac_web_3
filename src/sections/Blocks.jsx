import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReduced } from '../lib/motion'
import { site } from '../data/site'
import Icon from '../components/Icon'
import ContourField from '../webgl/ContourField'
import { TLink, Button, ArrowLink, Eyebrow, Card, Telemetry } from '../components/UI'

/* ---------- headings ---------- */
export function SectionHead({ eyebrow, title, lead, tone = 'light', center = false, children }) {
  return (
    <header className={`shead ${center ? 'shead--center' : ''} shead--${tone}`}>
      {eyebrow && <Eyebrow tone={tone === 'dark' ? 'peach' : 'muted'}>{eyebrow}</Eyebrow>}
      <h2 className="h2" data-split="mask">{title}</h2>
      {lead && <p className="lead" data-split="fade">{lead}</p>}
      {children}
    </header>
  )
}

/* ---------- inner-page hero ---------- */
export function PageIntro({ crumb, tag, eyebrow, title, lead, actions, children, media, tone = 'cream', className = '' }) {
  return (
    <section className={`intro intro--${tone} ${className}`} data-hero>
      <div className="wrap">
        <div className="intro__bar">
          <nav className="crumbs" aria-label="Breadcrumb">
            <TLink to="/">Home</TLink><i>/</i><span>{crumb}</span>
          </nav>
          {tag && <span className="tag-mono">{tag}</span>}
        </div>
        <div className="intro__grid">
          <div className="intro__copy">
            {eyebrow && <p className="eyebrow eyebrow--terracotta eyebrow--bare" data-reveal>{eyebrow}</p>}
            <h1 className="h1" data-split="mask">{title}</h1>
            <p className="lead lead--lg" data-split="fade" data-delay="0.2">{lead}</p>
            {actions && <div className="intro__actions" data-reveal data-delay="0.35">{actions}</div>}
            {children}
          </div>
          {media && <div className="intro__media">{media}</div>}
        </div>
      </div>
    </section>
  )
}

/* ---------- metrics ---------- */
export function MetricStrip({ items, tone = 'stone' }) {
  return (
    <section className={`metrics metrics--${tone}`}>
      <div className="wrap">
        <div className="metrics__grid" data-stagger="0.1">
          {items.map((m) => (
            <div className="metric" key={m.title}>
              <div className="metric__top">
                {m.count ? (
                  <span className="metric__n" data-count={m.count.n} data-suffix={m.count.suffix || ''} data-prefix={m.count.prefix || ''} data-decimals={m.count.dec || 0}>{m.value}</span>
                ) : (
                  <span className="metric__n">{m.value}</span>
                )}
                {m.k && <span className="metric__k">{m.k}</span>}
              </div>
              <h3 className="metric__t">{m.title}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
        <i className="hair" data-line />
      </div>
    </section>
  )
}

/* ---------- generic card grid ---------- */
export function CardGrid({ items, cols = 3, tone = 'light' }) {
  return (
    <div className={`cgrid cgrid--${cols} cgrid--${tone}`} data-stagger="0.08">
      {items.map((it) => (
        <Card key={it.title} className={`ccard ${it.wide ? 'ccard--wide' : ''}`}>
          <div className="ccard__top">
            <span className={`kicker ${it.accent ? 'kicker--accent' : ''}`}>{it.kicker}</span>
            {it.meta && <span className="mono meta">{it.meta}</span>}
          </div>
          <h3 className="h3">{it.title}</h3>
          <p>{it.text}</p>
          {it.bullets && <ul className="ticks">{it.bullets.map((b) => <li key={b}><Icon name="check" size={13} />{b}</li>)}</ul>}
          {it.tags && <ul className="tags">{it.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
          {it.link && <div className="ccard__foot"><ArrowLink to={it.link[0]}>{it.link[1]}</ArrowLink></div>}
        </Card>
      ))}
    </div>
  )
}

/* ---------- dark pillars w/ spotlight + scramble ---------- */
export function Pillars({ items }) {
  return (
    <div className="pillars" data-stagger="0.1">
      {items.map((p) => (
        <Card key={p.title} className="pillar">
          <span className="pillar__ico"><Icon name={p.icon} size={18} /></span>
          <p className="kicker kicker--peach">{p.kicker}</p>
          <h3 className="h3">{p.title}</h3>
          <p>{p.text}</p>
          <Telemetry>{p.telemetry}</Telemetry>
        </Card>
      ))}
    </div>
  )
}

/* ---------- process: steps with scrubbed rail ---------- */
export function Steps({ items, tone = 'light', rail = true }) {
  return (
    <ol className={`steps steps--${tone} steps--${items.length}`}>
      {rail && <span className="steps__rail"><i data-scrub-fill="x" /></span>}
      {items.map((s, i) => (
        <li className="step" key={s.title} data-reveal data-delay={i * 0.08}>
          <span className="step__dot" />
          <p className="kicker">{s.kicker}</p>
          <h3 className="h3">{s.title}</h3>
          <p>{s.text}</p>
          {s.note && <p className="step__note mono">{s.note}</p>}
        </li>
      ))}
    </ol>
  )
}

/* ---------- FAQ accordion (animated height) ---------- */
export function Faq({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq" data-stagger="0.07">
      {items.map((f, i) => (
        <FaqItem key={f.q} f={f} i={i} open={open === i} toggle={() => setOpen(open === i ? -1 : i)} />
      ))}
    </div>
  )
}
function FaqItem({ f, i, open, toggle }) {
  const body = useRef(null)
  const first = useRef(true)
  useEffect(() => {
    const el = body.current
    if (first.current) { first.current = false; gsap.set(el, { height: open ? 'auto' : 0 }); return }
    if (prefersReduced()) return void gsap.set(el, { height: open ? 'auto' : 0 })
    gsap.to(el, { height: open ? 'auto' : 0, duration: 0.7, ease: 'vd' })
  }, [open])
  return (
    <div className={`faq__item ${open ? 'is-open' : ''}`}>
      <button className="faq__q" onClick={toggle} aria-expanded={open} type="button">
        <span className="mono">{String(i + 1).padStart(2, '0')}</span>
        <span className="faq__qt">{f.q}</span>
        <span className="faq__plus"><i /><i /></span>
      </button>
      <div className="faq__a" ref={body}><p>{f.a}</p></div>
    </div>
  )
}

/* ---------- testimonials ---------- */
export function Quotes({ items }) {
  return (
    <div className="quotes" data-stagger="0.12">
      {items.map((q) => (
        <figure className="quote" key={q.who}>
          <span className="quote__mark" aria-hidden="true">“</span>
          <blockquote>{q.text}</blockquote>
          <figcaption><b>{q.who}</b><span>{q.where}</span></figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---------- CTA band with isoline field ---------- */
export function Cta({ badge = 'Architectural Standards Guarantee', title = 'Let’s make your home more comfortable.', text, fine = 'Licensed & Insured • Background-Checked Technicians • Clear Written Estimates', primary = 'Schedule In-Home Evaluation' }) {
  return (
    <section className="cta" id="cta">
      <ContourField />
      <div className="wrap cta__in">
        <p className="cta__badge" data-reveal><Icon name="badge" size={14} />{badge}</p>
        <h2 className="h2 h2--light" data-split="mask">{title}</h2>
        <p className="lead lead--light" data-split="fade">{text}</p>
        <div className="cta__btns" data-reveal data-delay="0.15">
          <Button to="/#schedule" variant="light">{primary}</Button>
          <Button href={`tel:${site.tel}`} variant="ghost-light" icon="phone">Call direct: {site.phone}</Button>
        </div>
        <p className="cta__fine" data-reveal data-delay="0.25">{fine}</p>
      </div>
    </section>
  )
}

/* ---------- quote / pull-quote block ---------- */
export function Pull({ children, left, right }) {
  return (
    <blockquote className="pull" data-reveal>
      <p>“{children}”</p>
      <footer><span>{left}</span>{right && <span>{right}</span>}</footer>
    </blockquote>
  )
}

/* ---------- two-up stat row ---------- */
export function Stat({ n, label, count }) {
  return (
    <div className="stat">
      <b data-count={count?.n} data-suffix={count?.suffix || ''} data-decimals={count?.dec || 0}>{n}</b>
      <span>{label}</span>
    </div>
  )
}
