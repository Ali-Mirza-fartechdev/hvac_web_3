import { useState } from 'react'
import { Button } from '../components/UI'
import Icon from '../components/Icon'
import CoverageRadar from '../webgl/CoverageRadar'
import { communities, directory, checkCoverage } from '../data/communities'
import { site } from '../data/site'
import { PageIntro, SectionHead, CardGrid, Faq, Pull } from '../sections/Blocks'
import ContourField from '../webgl/ContourField'

const regional = [
  { kicker: 'Regional engineering', title: 'AC Repair & Precision Diagnostics', text: 'Diagnostic airflow measurement, refrigerant enthalpy verification, and component-level electronics debugging for inverter and conventional systems.', meta: 'Priority dispatch' },
  { kicker: 'Regional engineering', title: 'AC Installation & Variable Systems', text: 'Quiet inverter heat pumps and variable-capacity condensers integrated with custom linear slot diffusers and acoustic silencer baffles.', meta: 'Proposal visit' },
  { kicker: 'Regional engineering', title: 'Heating & Modulating Furnaces', text: 'Up to 98% AFUE modulating gas furnaces and hybrid heat pump heating with precision static pressure calibration to eliminate cold draft cycles.', meta: 'Priority dispatch' },
  { kicker: 'Regional engineering', title: 'Indoor Air Quality & Enthalpy ERV', text: 'Continuous fresh air exchange, MERV 16 filtration suites, and active whole-home relative humidity balancing tailored to microclimates.', meta: 'Scheduled' },
  { kicker: 'Regional engineering', title: 'Preservation & Annual Maintenance Agreements', text: 'Seasonal inspection checklists with contract privileges including priority dispatch and documented system history.', meta: 'Annual' },
]
const realities = [
  { kicker: 'Sensible vs. latent split optimization', title: 'High Summer Heat Loads & Humidity Variance', text: 'Regional heat spikes demand extensive sensible heat extraction, yet conventional systems frequently short-cycle, leaving indoor relative humidity uncomfortably elevated. Our variable-inverter setups maintain sustained, low-velocity coil runtimes to continuously extract moisture while operating at mere decibels.' },
  { kicker: 'Sanctuary integrity & wall preservation', title: 'Historic & Custom Residential Architecture', text: 'In neighborhoods like Pemberton Heights and River Oaks, cutting into historic plaster, coffered ceilings, or custom white-oak millwork is unacceptable. We utilize high-static slim-duct air handlers and custom-routed architectural chase solutions that remain utterly concealed within the envelope.' },
  { kicker: 'Airtight envelopes & ERV balancing', title: 'Modern High-Performance Building Envelopes', text: 'Contemporary luxury construction with spray-foam airtight envelopes demands dedicated mechanical ventilation to avoid stagnant indoor air and pressure imbalances. We configure balanced Enthalpy Recovery Ventilators (ERVs) synchronized with central zoning dampers.' },
]
const faqs = [
  { q: 'Do you charge a trip fee for any neighborhood in your territory?', a: 'Baseline assessments are standard across the territory. Any fee is quoted in writing before we dispatch, never added afterwards.' },
  { q: 'What if my address sits just outside the listed communities?', a: 'Call the dispatch desk. We will confirm whether your address can be served without compromising our boundary policy of dedicated time on every visit.' },
  { q: 'How does same-day priority work?', a: 'Communities marked priority are anchored closest to our dispatch studio, so we can usually place a senior technician at your door within two hours of confirmation.' },
  { q: 'Are the technicians who arrive employees of Verdant & Co.?', a: 'Yes—salaried, uniformed and background-checked. We do not subcontract diagnostics.' },
]
const states = [
  ['Arrival window', 'Guaranteed 2-hour slot'],
  ['Diagnostic fee', 'Standard baseline assessment'],
  ['Emergency dispatch', 'Same-day priority validated'],
]

function Checker() {
  const [q, setQ] = useState('')
  const [res, setRes] = useState({ state: 'idle' })
  const run = (e) => {
    e.preventDefault()
    const r = checkCoverage(q)
    setRes(r)
    window.dispatchEvent(new CustomEvent('community:hover', { detail: r.id || null }))
  }
  return (
    <div className="checker" data-reveal data-delay="0.3">
      <div className="checker__top"><b>Regional address verification</b><span className="mono">GIS v4.2 ref</span></div>
      <form onSubmit={run} className="checker__form" role="search">
        <label className="checker__field">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter ZIP code or municipality (e.g. 78701 or Westlake)" aria-label="ZIP code or municipality" />
        </label>
        <button className="btn btn--dark" type="submit"><span className="btn__fill" /><span className="btn__roll"><span>Check service area</span><span aria-hidden="true">Check service area</span></span></button>
      </form>
      <div className={`checker__res is-${res.state}`} aria-live="polite">
        {res.state === 'idle' && <p><Icon name="shield" size={13} /> Prompt dispatch confirmation. No high-pressure sales contact required.</p>}
        {res.state === 'covered' && (
          <p><Icon name="badge" size={15} /> <b>{res.name}</b> is within our territory — {res.priority ? 'same-day priority' : 'active route'}, typical arrival {res.time}.</p>
        )}
        {res.state === 'outside' && <p><Icon name="pin" size={15} /> <b>{res.name}</b> sits outside our listed territory. Call <a href={`tel:${site.tel}`}>{site.phone}</a> and we’ll confirm what’s possible.</p>}
        {res.state === 'unknown' && <p><Icon name="pin" size={15} /> We couldn’t match “{res.name}”. Try a 5-digit ZIP or call the dispatch desk.</p>}
      </div>
    </div>
  )
}

export default function ServiceAreas() {
  return (
    <>
      <PageIntro
        tone="sand" crumb="Service Areas" tag="Dispatch scope // Regional coverage matrix"
        eyebrow="Architectural climate engineering"
        title="Local service. Thoughtful home comfort."
        lead="Verdant & Co. dispatches non-commissioned, salaried technical advisors across the metropolitan area and surrounding residential communities. We uphold unhurried diagnostic discipline, strict sanctuary etiquette inside private residences, and factory-calibrated climate balance engineered for distinct home geometries."
        media={
          <div className="stack">
            <CoverageRadar />
            <Pull left="— Verdant & Co. Engineering Directorate">True climate engineering respects both the architectural vernacular and the resident’s demand for total acoustic serenity.</Pull>
          </div>
        }
      >
        <Checker />
        <div className="facts" data-stagger="0.1">
          <div><small>Field staff</small><b>100% Salaried</b></div>
          <div><small>Primary radius</small><b>35-Mile Core</b></div>
          <div><small>Dispatch time</small><b>&lt; 2h Priority</b></div>
        </div>
      </PageIntro>

      <section className="statestrip">
        <div className="wrap statestrip__grid" data-stagger="0.1">
          {states.map(([k, v]) => (
            <div key={k}><span className="mono">{k}</span><b>{v}</b></div>
          ))}
        </div>
      </section>

      <section className="services">
        <div className="wrap">
          <SectionHead eyebrow="Communities served" title="Neighborhoods we visit every week." />
          <div className="table" role="table" aria-label="Communities served">
            <div className="table__head" role="row"><span>Community</span><span>ZIP</span><span>Architecture</span><span>Typical arrival</span><span>Status</span></div>
            {directory.map((d) => {
              const id = communities.find((c) => c.name === d.name)?.id
              return (
                <div
                  className="table__row" role="row" key={d.name} tabIndex={0}
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent('community:hover', { detail: id || null }))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent('community:hover', { detail: null }))}
                  data-reveal
                >
                  <b role="cell">{d.name}</b><span role="cell" className="mono">{d.zip}</span><span role="cell">{d.arch}</span><span role="cell">{d.time}</span>
                  <span role="cell" className={`pill ${d.status.includes('priority') ? 'pill--p' : ''}`}>{d.status}</span>
                </div>
              )
            })}
          </div>
          <p className="disclaimer">* Don’t see your specific neighborhood listed? Use the instant ZIP verification widget above, or consult our Engineering Dispatch desk directly at {site.phone}.</p>
        </div>
      </section>

      <section className="dark standard">
        <div className="wrap">
          <SectionHead tone="dark" eyebrow="Comprehensive regional engineering" title="Services deployed across all territories." lead="Regardless of your municipal quadrant, our field teams arrive in unified technical vehicles equipped with complete factory calibration equipment and airflow diagnostic apparatus." />
          <i className="hair hair--dark" data-line />
          <CardGrid items={regional} cols={3} tone="dark" />
        </div>
      </section>

      <section className="services">
        <div className="wrap">
          <SectionHead eyebrow="Thermodynamics in context" title="Local architectural & climate realities." lead="Mechanical engineering cannot be divorced from envelope architecture. We engineer specifically for regional envelope physics, solar orientation, and material preservation." />
          <CardGrid items={realities} cols={3} />
        </div>
      </section>

      <section className="boundary">
        <div className="wrap boundary__grid">
          <div>
            <p className="eyebrow eyebrow--peach"><span className="eyebrow__rule" data-line /><span>Boundary policy notice</span></p>
            <h2 className="h2 h2--light" data-split="mask">Strict boundary preservation.</h2>
          </div>
          <p className="lead lead--light" data-split="fade">Unlike volume-based HVAC contractors who over-extend routes and rush diagnostic calls, Verdant &amp; Co. enforces strict vehicle boundary limits. We guarantee that every field engineer has dedicated time to complete full airflow balancing and thermodynamic verification on every visit.</p>
        </div>
      </section>

      <section className="faqsec">
        <div className="wrap faqsec__grid">
          <SectionHead eyebrow="Frequently addressed inquiries" title="Coverage, plainly answered." />
          <Faq items={faqs} />
        </div>
      </section>

      <section className="cta" id="cta">
        <ContourField />
        <div className="wrap cta__in">
          <p className="cta__badge" data-reveal><Icon name="pin" size={14} />Dispatch readiness // Central Metro &amp; enclaves</p>
          <h2 className="h2 h2--light" data-split="mask">Prompt dispatch across our regional service territory.</h2>
          <p className="lead lead--light" data-split="fade">Sanctuary protocol commitment: protected floors, quiet communication, and a documented result on every visit.</p>
          <div className="cta__btns" data-reveal data-delay="0.15">
            <Button to="/#schedule" variant="light">Book dispatch online</Button>
            <Button href={`tel:${site.tel}`} variant="ghost-light" icon="phone">{site.phone}</Button>
          </div>
          <p className="cta__fine" data-reveal>Dispatch desk active • Mon–Sat</p>
        </div>
      </section>
    </>
  )
}
