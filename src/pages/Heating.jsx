import { useState } from 'react'
import { Button, ArrowLink } from '../components/UI'
import HouseScene from '../webgl/HouseScene'
import { PageIntro, MetricStrip, SectionHead, CardGrid, Steps, Faq, Cta, Quotes } from '../sections/Blocks'

const metrics = [
  { value: 'Up to 98%', k: 'AFUE rating', title: 'Modulating', text: 'Zero cold drafts, linear fuel consumption matching home load curve.' },
  { value: '0 PPM', k: 'Combustion benchmark', title: 'Ambient target', text: 'Fiberoptic heat exchanger verification and absolute safety assurance.' },
  { value: '< 28 dBA', k: 'Sound profile', title: 'Whisper flow', text: 'Variable-speed ECM draft blowers isolated with acoustic dampening.' },
  { value: '100%', k: 'Technician protocol', title: 'Salaried staff', text: 'Zero upselling commissions, replacement quotas, or high-pressure tactics.' },
]
const portfolio = [
  { wide: true, accent: true, kicker: 'Diagnostics', meta: 'ROOT-CAUSE', title: 'Precision Heating Diagnostics & Repair', text: 'Methodical root-cause fault isolation, digital manifold analysis, ignition control testing, and electrical telemetry without hasty component swapping. Our diagnostic protocols dissect electronic circuit boards, draft induction pressure switches, and gas line regulators to pinpoint the precise failure mode.' },
  { wide: true, kicker: 'Furnaces', meta: '± 0.5°F', title: 'High-Efficiency Modulating Furnace Services', text: 'Multi-stage variable gas valve calibration, blower motor static tuning, and clean combustion analysis that maintains your room within 0.5 degrees of setpoint continuously.' },
  { wide: true, kicker: 'Dual-fuel', meta: 'HYBRID', title: 'Dual-Fuel & Hybrid Heat Pump System Replacement', text: 'Engineered pairing of cold-climate inverter heat pumps with auxiliary high-efficiency gas furnaces for optimal seasonal economics and resilient warmth down to negative sub-zero outdoor ambients.', bullets: ['Intelligent cutover control: the system calculates local electric vs. gas therm parity to select the lowest carbon and dollar cost heat source hourly.'] },
  { wide: true, kicker: 'Safety', meta: '28-POINT AUDIT', title: 'Seasonal Preservation & Safety Audits', text: 'Comprehensive pre-season commissioning, flue gas draft pressure testing, flame sensor rejuvenation, and high-resolution fiberoptic heat exchanger inspection to preserve equipment longevity and family safety.', tags: ['28-point audit', 'Written telemetry'] },
]
const symptoms = [
  { kicker: 'Symptom 01', title: 'Insufficient Heat & Lukewarm Air', text: 'Equipment runs continuously without reaching setpoints, indicating primary burner malfunction, manifold pressure drop, or heat exchanger capacity loss.' },
  { kicker: 'Symptom 02', title: 'Uneven Room Temperatures & Stratification', text: 'Multi-floor thermal imbalance where upper levels overheat while main living areas remain cold, signaling zoning damper failure or duct static restriction.' },
  { kicker: 'Symptom 03', title: 'Unusual Noises & Mechanical Chatter', text: 'High-pitched blower squeals, metallic vibration in trunk lines, or heavy rumbling delayed ignition across the main burner vestibule.' },
  { kicker: 'Symptom 04', title: 'Frequent System Cycling (Short-Cycling)', text: 'Rapid on-off cycling caused by restricted airflow, high limit safety switch tripping, faulty flame rectification, or severely oversized equipment.' },
  { kicker: 'Symptom 05', title: 'Thermostat Communication & Control Variance', text: 'Inconsistent interface responses, calibration drift, communication bus errors, or remote temperature sensor disconnects in zoned setups.' },
  { kicker: 'Symptom 06', title: 'Unexpected Changes in Operation or Utility Draw', text: 'Spiking gas therm or electric billing alongside continuous blower operation, signaling deteriorating combustion efficiency or failing heat staging.' },
]
const steps = [
  { kicker: 'Step 01: Consultation', title: 'Review Symptoms & History', text: 'In-depth homeowner interview regarding recent thermal changes, room draft complaints, historical maintenance logs, and seasonal utility patterns.' },
  { kicker: 'Step 02: Telemetry', title: 'Inspect Relevant Components', text: 'Scientific test of safety switches, draft inducer pressure differentials, fiberoptic heat exchanger scan, and static external duct pressures.' },
  { kicker: 'Step 03: Clarity', title: 'Explain Findings in Plain Language', text: 'Itemized digital summary presenting actual combustion gas analysis readings, draft pressure data, and visual borescope footage of internal cells.' },
  { kicker: 'Step 04: Resolution', title: 'Discuss Suitable Next Steps', text: 'Transparent repair or optimization paths presented with clear, binding estimates before tools or replacement hardware contact the system.' },
]
const factors = [
  { kicker: 'Factor 01', title: 'Equipment Age & Fatigue', text: 'Evaluating the remaining metallurgical lifespan of heat exchanger cell walls, burner assemblies, and inducer housings against the standard 15–20 year operational envelope.' },
  { kicker: 'Factor 02', title: 'Nature & Repair Cost', text: 'Distinguishing standard component refreshes (flame sensors, hot-surface igniters, run capacitors) from major failures (breached heat exchangers, cracked collector boxes).' },
  { kicker: 'Factor 03', title: 'Thermal Comfort & Fuel Efficiency', text: 'Weighing legacy 80% single-stage fuel waste and blast cycles against contemporary 96–98% modulating continuous comfort that eradicates draft stratification.' },
  { kicker: 'Factor 04', title: 'Homeowner Future Horizons', text: 'Aligning recommendations with your living plans—whether stewarding a generational estate, scheduling phased interior remodels, or seeking immediate seasonal reliability.' },
]
const prep = [
  { kicker: 'Before we arrive', title: 'Clear a path to the equipment', text: 'Please keep three feet of clearance around the furnace and thermostat so measurements can be taken without moving belongings.' },
  { kicker: 'Safety first', title: 'If you smell gas, leave', text: 'Do not operate switches or phones indoors. Exit, call your gas utility or emergency services, then call our emergency line from outside.' },
  { kicker: 'Helpful to have', title: 'Note what you’ve noticed', text: 'Sounds, rooms that run cold, and when the issue began. Past service records or manuals are useful but never required.' },
  { kicker: 'During the visit', title: 'Pets & small children', text: 'We’ll be moving between the mechanical area and living spaces. Keeping pets secured helps us work quickly and safely.' },
]
const quotes = [
  { text: 'Our historic colonial had severe temperature swings between the north parlor and the bedrooms. The technician performed a static pressure check, discovered a restricted bypass damper, and rebalanced the furnace airflow in one visit.', who: 'Verified Residential Client', where: 'West Highland District' },
  { text: 'When our furnace started short-cycling on the first freeze of November, Verdant & Co. provided an exact combustion readout showing a weakened flame sensor. Clean, courteous, and no sales pressure whatsoever.', who: 'Verified Residential Client', where: 'Barton Creek Valley' },
  { text: 'Replaced our 20-year-old noisy unit with a modulating dual-fuel setup. The mechanical room looks like an art gallery with straight duct runs and insulated piping. The quiet operation is astonishing.', who: 'Verified Residential Client', where: 'Pemberton Heights' },
]
const faqs = [
  { q: 'What is the difference between a modulating and a single-stage furnace?', a: 'A single-stage furnace is either fully on or off, which creates temperature swings and noise. A modulating furnace continuously adjusts its flame and blower speed to match the heat your home is actually losing, holding temperature within about half a degree.' },
  { q: 'Is a dual-fuel system right for a cold climate?', a: 'Often, yes. A cold-climate heat pump handles most of the season efficiently, and the gas furnace takes over automatically during extreme cold or when gas is cheaper per unit of heat.' },
  { q: 'How often should a furnace be inspected?', a: 'Once a year, ideally in early autumn, so combustion safety and heat exchanger integrity are verified before the first freeze.' },
  { q: 'Can you service a furnace you didn’t install?', a: 'Yes—every major residential brand. We start with a baseline audit that documents the unit’s current condition.' },
]

function AgeGauge() {
  const [age, setAge] = useState(12)
  const tier = age < 8 ? 0 : age < 15 ? 1 : age < 20 ? 2 : 3
  const msg = [
    ['Early life', 'Repair is almost always the sensible path. Components are well within their metallurgical lifespan.'],
    ['Mid life', 'Repair remains reasonable for standard components. We’d note any early fatigue in the heat exchanger.'],
    ['Late life', 'Weigh the repair against replacement. A major failure at this age rarely justifies a large repair.'],
    ['Past typical envelope', 'Plan for replacement. Modulating efficiency gains and reliability usually outweigh further repair spend.'],
  ][tier]
  return (
    <div className="gauge" data-reveal>
      <div className="gauge__head"><span className="mono">Furnace age</span><b>{age} yrs</b></div>
      <input type="range" min="0" max="25" value={age} onChange={(e) => setAge(+e.target.value)} aria-label="Furnace age in years" style={{ '--p': `${(age / 25) * 100}%` }} />
      <div className="gauge__scale mono"><span>New</span><span>15–20 yr envelope</span><span>25</span></div>
      <p className="gauge__msg"><b>{msg[0]}.</b> {msg[1]}</p>
      <small>A guide only—every system is evaluated on measured condition.</small>
    </div>
  )
}

export default function Heating() {
  return (
    <>
      <PageIntro
        crumb="Heating & Furnace" tag="Thermal generation // Winter"
        eyebrow="Architectural residential heating & modulation"
        title="Comfort that carries you through the colder months."
        lead="Residential heating is about balanced thermal envelopes, quiet combustion, and steady, draft-free warmth. Whether fine-tuning a modulating gas furnace, assessing a dual-fuel heat pump, or restoring reliable heat, our senior technicians approach your home with calm precision and non-commissioned integrity."
        actions={<><Button to="/#schedule">Schedule heating service</Button><ArrowLink to="/maintenance-plans">Preservation plans</ArrowLink></>}
        media={<HouseScene mood="winter" caption="Modulating multi-stage heating & dual-fuel inverter integration" tag="Winter profile" hotspot="Dual-fuel heat pump" />}
      />
      <MetricStrip items={metrics} />

      <section className="services">
        <div className="wrap">
          <SectionHead eyebrow="Portfolio of discipline" title="Calibrated solutions for whole-home thermal comfort." lead="Every heating configuration has distinct thermodynamic demands. We provide specialized care across four key heating competencies tailored to your home’s architecture." />
          <CardGrid items={portfolio} cols={2} />
        </div>
      </section>

      <section className="dark standard">
        <div className="wrap">
          <SectionHead tone="dark" eyebrow="Symptom recognition" title="Common indications your heating system requires attention." lead="Heating networks communicate stress through measurable mechanical indicators. Identifying subtle variances early prevents heat loss during winter freezes." />
          <i className="hair hair--dark" data-line />
          <CardGrid items={symptoms} cols={3} tone="dark" />
        </div>
      </section>

      <section className="process">
        <div className="wrap">
          <SectionHead eyebrow="Systematic process" title="Four steps to empirical heating diagnosis." lead="We replace hurried visual inspections with calibrated instrumentation. Every visit begins with verified evidence." />
          <Steps items={steps} />
        </div>
      </section>

      <section className="services">
        <div className="wrap advisory">
          <div>
            <SectionHead eyebrow="Objective advisory" title="Repair or Replace: An honest, measured evaluation." lead="We evaluate home heating systems as long-term capital investments, not disposable appliances. Our advisory helps you weigh mechanical realities against economic return." />
            <AgeGauge />
          </div>
          <CardGrid items={factors} cols={2} />
        </div>
      </section>

      <section className="split">
        <div className="wrap">
          <SectionHead eyebrow="Practice & protocol" title="Preparing your home for a heating service visit." />
          <CardGrid items={prep} cols={4} />
        </div>
      </section>

      <section className="voices">
        <div className="wrap">
          <SectionHead eyebrow="Verified experiences" title="Quiet words from homeowners we’ve served." lead="Recent heating diagnostics and furnace services across the metro region." />
          <Quotes items={quotes} />
        </div>
      </section>

      <section className="faqsec">
        <div className="wrap faqsec__grid">
          <SectionHead eyebrow="Frequently addressed" title="Heating, plainly answered." />
          <Faq items={faqs} />
        </div>
      </section>

      <Cta title="Let’s make your home warmer, quieter and safer." text="Our senior technicians are ready to diagnose with instruments, not assumptions." />
    </>
  )
}
