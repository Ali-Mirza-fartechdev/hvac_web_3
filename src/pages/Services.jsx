import { Button, ArrowLink, Eyebrow, TLink } from '../components/UI'
import Icon from '../components/Icon'
import InteriorScene from '../webgl/InteriorScene'
import { PageIntro, MetricStrip, SectionHead, CardGrid, Steps, Faq, Cta, Stat } from '../sections/Blocks'

const ribbon = [
  { k: 'Acoustic benchmark', title: 'Acoustic benchmark', value: '< 24 dBA', text: 'Measured at the condenser, not the brochure.' },
  { k: 'Seasonal efficiency', title: 'Seasonal efficiency', value: 'Up to 24.5 SEER2', text: 'Variable-capacity inverter platforms.' },
  { k: 'Diagnostic standard', title: 'Diagnostic standard', value: '48-Point Metric', text: 'Documented on every visit.' },
  { k: 'Technician protocol', title: 'Technician protocol', value: '100% Salaried', text: 'No commissions, no quotas.' },
]

const directory = [
  { no: '01', title: 'AC Installation & Custom Variable Inverter Systems', to: '/ac-installation', text: 'High-efficiency inverter heat pumps and variable-capacity condensing units mapped directly to your home’s architectural heat envelope. We calculate every square foot using ACCA Manual J and D protocols, redesigning undersized plenums to eradicate hot spots and reduce decibel levels below human perception.', specs: [['Sound rating', '< 24 dBA'], ['Sizing protocol', 'ACCA Manual J / D'], ['Warranty tier', 'Extended parts & labor']], cta: 'Explore installation' },
  { no: '02', title: 'AC Repair & Precision Diagnostics', to: '/ac-repair', text: 'Methodical, instrumented troubleshooting for systems suffering from diminished thermal output, high amperage spikes, sensor drift, or coil leaks. Our technicians arrive with complete mobile testing laboratories—not parts-swapping guesses.', cta: 'View repair standards' },
  { no: '03', title: 'Heating & Modulating Furnace Systems', to: '/heating-furnace', text: 'Multi-stage gas combustion and dual-fuel hybrid heat pumps tailored for steady, draft-free baseline warmth. Each furnace installation includes stainless steel primary heat exchangers, zero-sound variable draft inducers, and precise combustion analysis.', cta: 'Explore heating' },
  { no: '04', id: 'air-quality', title: 'Indoor Air Quality & Enthalpy Ventilation (ERV)', to: '/services#air-quality', text: 'Modern tightly-sealed architectural homes require continuous mechanical ventilation to purge CO₂, VOCs, and particulate without thermal loss. We integrate Energy Recovery Ventilators (ERV), whole-home steam humidification, and whole-duct bipolar ionization to maintain pure air.', cta: 'Request an air audit', schedule: true },
  { no: '05', title: 'Preservation & Annual Maintenance Agreements', to: '/maintenance-plans', text: 'Proactive thermal audits, coil cleaning with pH-neutral agents, static balance checks, and priority emergency dispatch 365 days a year. We protect your equipment investment before efficiency deteriorates.', cta: 'View maintenance tiers' },
]

const standards = [
  { kicker: 'Standard 01', title: 'Static Pressure Testing', text: 'Verification of external static pressure across supply and return drops to ensure whisper-silent blower operation and motor longevity.' },
  { kicker: 'Standard 02', title: 'Airflow Balancing', text: 'Capture hood flow measurement (CFM) calibrated per room diffuser, eliminating secondary floor temperature gradients completely.' },
  { kicker: 'Standard 03', title: 'Manual J Load Calculation', text: 'Comprehensive computer heat gain/loss calculations considering window U-factors, ceiling heights, overhangs, and internal loads.' },
  { kicker: 'Standard 04', title: 'Envelope Assessment', text: 'Thermal imaging camera analysis to detect duct register leakage, attic bypasses, and infiltration pathways before sizing equipment.' },
]

const steps = [
  { kicker: 'Phase 01', title: 'Understand the Issue', text: 'We execute comprehensive diagnostic measurements rather than guessing: checking electrical draw across all compressor windings, static pressure, delta-T temperature split, and refrigerant subcooling curves.' },
  { kicker: 'Phase 02', title: 'Discuss the Options', text: 'Plain-English explanation of findings with itemized repair vs. replacement options. Transparent costs, efficiency impacts, and expected life cycle projections presented with zero sales pressure.' },
  { kicker: 'Phase 03', title: 'Complete Work Carefully', text: 'Meticulous execution by licensed technicians. Live load testing, electronic refrigerant recovery, nitrogen-purged brazing, and complete mechanical room cleanup before client sign-off.' },
]

const faqs = [
  { q: 'How do you decide between repairing and replacing a system?', a: 'We present both with itemized costs, the efficiency impact, and an expected remaining lifecycle. As a rule of thumb, repairs make sense when the system is under roughly 12 years old and the fix is a small fraction of replacement cost. Our technicians are salaried, so the recommendation is never tied to a commission.' },
  { q: 'Why do you run a Manual J load calculation before quoting?', a: 'Oversized equipment short-cycles, runs louder, and handles humidity poorly. Manual J accounts for your windows, insulation, orientation and occupancy so the system is sized to the house rather than to the old unit it replaces.' },
  { q: 'Will my technician protect my floors and furnishings?', a: 'Yes. Floor runners, boot covers, drop cloths and a documented post-service cleanup are standard on every visit—not an upgrade.' },
  { q: 'How quiet is a variable-capacity system, really?', a: 'Inverter condensers modulate between roughly 25% and 100% capacity, so they spend most of their life at a low, steady speed. We specify and measure the outdoor sound level at installation so you know the number, not just the brochure claim.' },
  { q: 'Do you provide written estimates before work begins?', a: 'Always. You receive a plain-English scope with itemized pricing and the diagnostic readings that support it before any mechanical work starts.' },
]

export default function Services() {
  return (
    <>
      <PageIntro
        crumb="Our Services" tag="Service Index // 5 Disciplines"
        eyebrow="Architectural climate engineering"
        title="A more considered approach to home comfort."
        lead="We design, balance, and maintain residential climate systems engineered for silent operation, architectural preservation, and surgical thermal accuracy. Rather than hurried equipment swaps, we evaluate the envelope, airflow dynamics, and sound profile of your sanctuary."
        actions={<><Button to="/#schedule">Request a consultation</Button><ArrowLink to="/service-areas">Check your area</ArrowLink></>}
        media={<InteriorScene className="stage--tall" left="Linear slot diffusers" right="Measured" />}
      />

      <MetricStrip items={ribbon.map((r) => ({ ...r, value: r.value }))} />

      <section className="directory">
        <div className="wrap">
          <SectionHead eyebrow="Services directory" title="Five disciplines, one standard." />
          <div className="dir">
            {directory.map((d) => (
              <article className="dir__row" key={d.no} id={d.id} data-reveal>
                <TLink to={d.to} className="dir__link" data-cursor="Open" aria-label={d.title} />
                <span className="serif-n dir__no">{d.no}</span>
                <div className="dir__main">
                  <h3 className="h3 dir__t">{d.title}</h3>
                  <p>{d.text}</p>
                  {d.specs && (
                    <dl className="specs">
                      {d.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                    </dl>
                  )}
                </div>
                <span className="dir__go">
                  {d.schedule ? <ArrowLink to="/#schedule">{d.cta}</ArrowLink> : <span className="arrow-link"><span className="arrow-link__t">{d.cta}</span><span className="arrow-link__a"><Icon name="arrow" size={13} stroke={1.6} /><Icon name="arrow" size={13} stroke={1.6} /></span></span>}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark standard" id="standard">
        <div className="wrap">
          <SectionHead tone="dark" eyebrow="The Verdant engineering standard" title="The right solution starts with the right diagnosis." lead="Zero commission pressure. Our service technicians receive salaried compensation focused exclusively on verified thermodynamic precision and client satisfaction." />
          <i className="hair hair--dark" data-line />
          <CardGrid items={standards} cols={4} tone="dark" />
        </div>
      </section>

      <section className="split">
        <div className="wrap decorum">
          <div>
            <Eyebrow>Sanctuary etiquette</Eyebrow>
            <h2 className="h2" data-split="mask">Professional workmanship, quiet communication, and complete respect for your sanctuary.</h2>
          </div>
          <div>
            <p className="lead" data-split="fade">We recognize that your residence is not a commercial jobsite. When our specialists enter your home, we operate with surgical neatness and quiet deference to your daily routine.</p>
            <div className="stats">
              <Stat n="100%" count={{ n: 100, suffix: '%' }} label="Background checked" />
              <Stat n="120+ Hrs" count={{ n: 120, suffix: '+ Hrs' }} label="Annual factory training" />
            </div>
          </div>
        </div>
      </section>

      <section className="process">
        <div className="wrap">
          <SectionHead eyebrow="Three-step service process" title="Methodical, never hurried." />
          <Steps items={steps} />
        </div>
      </section>

      <section className="faqsec">
        <div className="wrap faqsec__grid">
          <SectionHead eyebrow="Homeowner questions" title="Frequently asked, plainly answered." />
          <Faq items={faqs} />
        </div>
      </section>

      <Cta text="Speak with our direct dispatch desk, Monday–Friday 7am–6pm and Saturday 8am–2pm." />
    </>
  )
}
