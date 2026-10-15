import { useState } from 'react'
import { Button, ArrowLink } from '../components/UI'
import Icon from '../components/Icon'
import ThermalField from '../webgl/ThermalField'
import { PageIntro, MetricStrip, SectionHead, CardGrid, Steps, Faq, Cta } from '../sections/Blocks'

const metrics = [
  { k: '01 / Philosophy', title: 'Preventative Over Reactive', text: 'Proactive component auditing scheduled well before peak seasonal cooling or sub-zero freezing loads stress your central equipment.' },
  { k: '02 / Calibration', title: 'Factory-Spec Tolerances', text: 'Total static pressure, delta-T temperature split, and compressor electrical draw measured rigorously against OEM design engineering curves.' },
  { k: '03 / Sanctuary', title: 'Zero Disruption Protocol', text: 'Sterile shoe covers, heavy floor runners, silent digital analyzers, and complete HEPA mechanical room restoration after every dispatch.' },
  { k: '04 / Integrity', title: '100% Salaried Advisors', text: 'Zero sales quotas, zero commission incentives, and zero manufactured panic. Transparent technical diagnostics documented in plain English.' },
]
const why = [
  { kicker: 'Mechanical', title: 'System Condition & Mechanical Fatigue', text: 'Careful electrical and mechanical diagnostics evaluate heavy-duty magnetic contactors, dual run capacitors, motor bearings, and compressor vibration dampers under actual operational load. Identifying microfarad degradation early prevents unexpected compressor locked-rotor shutdowns during severe heatwaves.' },
  { kicker: 'Aerodynamic', title: 'Airflow Dynamics & Static Pressure', text: 'Quiet comfort requires calibrated aerodynamics. We measure total external static pressure (TESP), inspect forward-curved blower wheel fin velocity, assess duct transition balance, and confirm clean filter resistance drops across architectural return grilles—ensuring soundless, evenly distributed airflow throughout every room.' },
  { kicker: 'Thermodynamic', title: 'Combustion Safety & Refrigerant Circuit', text: 'We verify flue draft ventilation, thermal heat exchanger integrity via high-resolution optical scanning, and exact refrigerant circuit thermodynamics. We benchmark liquid subcooling and suction superheat precisely against manufacturer saturation charts, preventing premature coil freezing and component breakdown.' },
  { kicker: 'Communication', title: 'Plain-Language Findings & Honest Counsel', text: 'Technical diagnostics without jargon or artificial panic. Following every visit, you receive documented photographic logs, clear component wear thresholds, and objective advice regarding which items need observation versus components operating perfectly within design parameters.' },
]
const cooling = [
  ['Condenser Coil Hydro-Inspection', 'Low-pressure rinse with pH-neutral agents; fin comb and clearance check.'],
  ['Refrigerant Charge Telemetry', 'Subcooling and superheat logged against the manufacturer’s charge chart.'],
  ['Compressor & Motor Electrical Diagnostics', 'Winding resistance, amperage draw and capacitor microfarad readings.'],
  ['Contactor & Switchgear Analysis', 'Pitting, voltage drop and terminal torque verified.'],
  ['Condensate Drainage & Safety Interlock', 'Drain line flushed; float switch function-tested.'],
  ['Indoor Evaporator Airflow Differential', 'Delta-T and coil pressure drop measured under live load.'],
]
const heating = [
  ['Heat Exchanger Integrity Scan', 'High-resolution optical inspection of primary and secondary exchangers.'],
  ['Calibrated Combustion Analysis', 'CO, O₂ and flue temperature measured with a calibrated analyzer.'],
  ['Flame Sensor & Igniter Telemetry', 'Microamp signal and igniter resistance recorded.'],
  ['Gas Manifold Pressure Tuning', 'Static and operating manifold pressure set to nameplate.'],
  ['Air Circulation & Blower Assembly', 'Wheel cleanliness, bearings and motor draw checked.'],
  ['Safety Interlocks & Inducer Verification', 'Pressure switches, limit controls and draft inducer verified.'],
]
const seasons = [
  { kicker: 'Spring', title: 'Spring Calibration', text: 'Scheduled prior to early summer temperature spikes. Ensures condenser heat dissipation, verified refrigerant charge, and unobstructed condensate drainage before sustained cooling cycles begin.' },
  { kicker: 'Autumn', title: 'Autumn Calibration', text: 'Conducted as ambient temperatures cool in autumn. Prioritizes combustion safety, heat exchanger integrity, burner assembly cleanliness, and draft venting ahead of freezing winter demands.' },
  { kicker: 'Always', title: 'Year-Round Monitoring', text: 'Quarterly filter cadence reviews, indoor relative humidity calibration (maintaining 35–50% optimal envelope target), and fresh air ERV/HRV core checks for whole-home thermal equilibrium.' },
]
const plans = [
  { name: 'Essential Preservation Plan', blurb: 'Fundamental annual stewardship for single-system homes with low operational intensity.', price: 'Priced after a brief equipment survey', freq: '1 seasonal visit per year', for: 'Single system' },
  { name: 'Complete Home Comfort Agreement', blurb: 'Full-spectrum pre-summer and pre-winter verification for complete mechanical resilience.', price: 'Priced after a brief equipment survey', freq: '2 seasonal visits: spring cooling + autumn heating', for: 'Heating + cooling', featured: true },
  { name: 'Architectural Estate Stewardship', blurb: 'Bespoke care for multi-unit zoned residences, high-end IAQ plants, and historical architecture.', price: 'Custom consultation', freq: 'Comprehensive multi-zone / quarterly cadence', for: 'Multi-zone estate' },
]
const after = [
  { kicker: 'Stage 01', title: 'Plain-Language Digital Report', text: 'Within hours of departure, you receive an illustrated digital summary detailing measured microfarads, delta-T temperature drops, combustion efficiency percentages, and photographic evidence of internal assemblies.' },
  { kicker: 'Stage 02', title: 'Objective Component Review', text: 'If normal mechanical fatigue is detected, your non-commissioned technician explains the exact remaining wear tolerance and timeline. You decide if and when to service parts—without high-pressure sales scripts.' },
  { kicker: 'Stage 03', title: 'Documented System History', text: 'Every audit is permanently archived into your home’s digital equipment registry. This documentation protects manufacturer warranty compliance and provides verified records should you ever choose to sell your property.' },
]
const faqs = [
  { q: 'Does a maintenance agreement void or protect my manufacturer warranty?', a: 'It protects it. Most manufacturers require documented annual maintenance, and every audit we perform is archived in your home’s equipment registry for exactly that purpose.' },
  { q: 'What does “priority dispatch” actually mean?', a: 'Agreement members move to the front of the dispatch queue. During peak weather that is the difference between same-day and next-available service.' },
  { q: 'Can I add or remove systems from a plan later?', a: 'Yes. Plans are modular—adding a second system, an ERV or a humidifier simply adjusts the scope of the seasonal audits.' },
  { q: 'Do you service equipment you did not install?', a: 'Yes. We service all major residential brands after a baseline audit that records the current condition and tolerances of every component.' },
]

const profiles = [
  { label: 'One system', plan: 0 },
  { label: 'Heating + cooling', plan: 1 },
  { label: 'Zoned estate', plan: 2 },
]

export default function MaintenancePlans() {
  const [profile, setProfile] = useState(1)
  const rec = profiles[profile].plan
  return (
    <>
      <PageIntro
        crumb="Maintenance Plans" tag="Document 04 // Preservation"
        eyebrow="Preservation agreements"
        title="A little attention goes a long way."
        lead="Residential climate systems operate quietly out of sight, yet sustain daily domestic comfort across every season. Methodical, preventative care preserves calibrated airflow, verifies electrical integrity, and safeguards your home’s thermal sanctuary—delivering predictable peace of mind through careful stewardship rather than urgent intervention."
        actions={<><Button to="/#schedule">Enroll a system</Button><ArrowLink to="/maintenance-plans#plans">Compare plans</ArrowLink></>}
        media={
          <div className="stack">
            <ThermalField className="stage--tall" badge="Standard operational procedure" lines={['BASELINE AUDIT', 'TESP 0.47 in.wc', 'Δ-T 18.4 °F']} />
            <p className="note-card" data-reveal><b>Standard operational procedure</b>Calibrated seasonal inspection &amp; component baseline audit</p>
          </div>
        }
      />

      <MetricStrip items={metrics.map((m) => ({ ...m, value: m.k.split(' / ')[0], k: m.k.split(' / ')[1] }))} />

      <section className="services">
        <div className="wrap">
          <SectionHead eyebrow="Preserving system longevity" title="Systematic care rooted in measured mechanical health." />
          <CardGrid items={why} cols={2} />
        </div>
      </section>

      <section className="dark checklist">
        <div className="wrap">
          <SectionHead tone="dark" eyebrow="Technical scope of work" title="Calibrated protocols for cooling and heating systems." lead="A clear, itemized overview of preventative evaluations. Actual inspection parameters are customized to your home’s architectural equipment profile and fuel sources." />
          <i className="hair hair--dark" data-line />
          <div className="checkcols">
            {[['Cooling Maintenance Audit', cooling], ['Heating Maintenance Audit', heating]].map(([h, list]) => (
              <div key={h} data-reveal>
                <h3 className="h3 h3--light">{h}</h3>
                <ul className="checklist__list">
                  {list.map(([t, d]) => (
                    <li key={t}><span className="checklist__tick"><Icon name="check" size={12} stroke={2} /></span><div><b>{t}</b><p>{d}</p></div></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process">
        <div className="wrap">
          <SectionHead eyebrow="Chronological stewardship" title="Thoughtful timing for balanced seasonal transitions." lead="A disciplined schedule ensures thermal comfort is guaranteed long before weather shifts place heavy stress on cooling and heating assemblies." />
          <Steps items={seasons} />
        </div>
      </section>

      <section className="plans" id="plans">
        <div className="wrap">
          <SectionHead eyebrow="Configurable maintenance plans" title="Choose the level of stewardship your home needs." />
          <div className="configurator" data-reveal>
            <span className="mono">Your home</span>
            <div className="seg" role="radiogroup" aria-label="Home profile">
              {profiles.map((p, i) => (
                <button key={p.label} role="radio" aria-checked={profile === i} className={profile === i ? 'is-on' : ''} onClick={() => setProfile(i)} type="button">{p.label}</button>
              ))}
            </div>
          </div>
          <div className="plangrid" data-stagger="0.1">
            {plans.map((p, i) => (
              <article key={p.name} className={`plan ${rec === i ? 'is-rec' : ''}`}>
                {rec === i && <span className="plan__flag">Recommended for you</span>}
                <p className="kicker">{p.for}</p>
                <h3 className="h3">{p.name}</h3>
                <p>{p.blurb}</p>
                <div className="plan__inv"><small className="mono">Investment schedule</small><b>{p.price}</b></div>
                <p className="mono plan__freq">Frequency: {p.freq}</p>
                <Button to="/#schedule" variant={rec === i ? 'dark' : 'outline'}>Request this plan</Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark standard">
        <div className="wrap">
          <SectionHead tone="dark" eyebrow="Transparent recordkeeping" title="What happens after an inspection." lead="Every site visit concludes with comprehensive clarity. No ambiguous remarks, no surprise invoices, and no hasty recommendations." />
          <i className="hair hair--dark" data-line />
          <CardGrid items={after} cols={3} tone="dark" />
        </div>
      </section>

      <section className="faqsec">
        <div className="wrap faqsec__grid">
          <SectionHead eyebrow="Homeowner inquiries" title="Questions about preservation." />
          <Faq items={faqs} />
        </div>
      </section>

      <Cta title="Thoughtful care for your home’s enduring comfort." text="Enroll a system today and your first baseline audit is scheduled before the next seasonal transition." primary="Schedule a baseline audit" />
    </>
  )
}
