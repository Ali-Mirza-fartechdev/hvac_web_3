import { useState } from 'react'
import { Button, ArrowLink } from '../components/UI'
import HouseScene from '../webgl/HouseScene'
import { PageIntro, SectionHead, CardGrid, Steps, Faq, Cta, Stat } from '../sections/Blocks'

const reasons = [
  { kicker: '01 / Mechanical', title: 'Recurring Repairs', text: 'Multiple component failures within consecutive seasons, signaling cascading fatigue across electrical contacts or compressor windings.' },
  { kicker: '02 / Comfort', title: 'Thermal Variance', text: 'Persistent multi-degree variance between floors, persistent hot spots, or humidity levels that linger despite continuous compressor run-times.' },
  { kicker: '03 / Environmental', title: 'Refrigerant Phase-Out', text: 'Aging equipment utilizing obsolete compounds (such as R-22), where minor coil leaks lead to exorbitant, chemically obsolete recharge costs.' },
  { kicker: '04 / Acoustic', title: 'Acoustic Fatigue', text: 'Harsh single-stage cycling, contactor chatter, or outdoor condenser vibration audible inside primary living, dining, and sleeping suites.' },
  { kicker: '05 / Efficiency', title: 'Seasonal Draw', text: 'Substantial seasonal kilowatt draw compared against contemporary variable-capacity inverter systems operating up to 24 SEER2.' },
]
const steps = [
  { kicker: 'Step 01', title: 'Understand the Home', text: 'A walk-through of your living patterns, comfort complaints, and architectural plans, including a full Manual J load calculation.' },
  { kicker: 'Step 02', title: 'Assess Existing Plant', text: 'Instrumented review of current ductwork, static pressure, electrical service and line sets to see what can be preserved or must be redesigned.' },
  { kicker: 'Step 03', title: 'Review Options', text: 'Good-better-best specifications compared on sound level, efficiency and zoning capability—without pressure toward any one tier.' },
  { kicker: 'Step 04', title: 'Explain the Proposal', text: 'A plain-English, itemized proposal covering equipment, ductwork modifications, controls, schedule and warranty terms.' },
  { kicker: 'Step 05', title: 'Execute Installation', text: 'Protected floors, nitrogen-purged brazing, deep-vacuum evacuation, live-load commissioning and a full homeowner handover.' },
]
const factors = [
  { kicker: 'Factor 1', title: 'Size & Thermal Envelope', text: 'Square footage, ceiling heights, window solar heat gain coefficients (SHGC), and wall cavity insulation values.' },
  { kicker: 'Factor 2', title: 'Solar Exposure & Glazing', text: 'South and west glass orientations, double-height great rooms, and localized thermal microclimates created by overhangs.' },
  { kicker: 'Factor 3', title: 'Ductwork & Static Pressure', text: 'Supply and return trunk sizing, leakage rates, and acoustic lining to ensure silent, draft-free laminar airflow throughout.' },
  { kicker: 'Factor 4', title: 'Microclimate & Humidity', text: 'Peak summer design temperatures and latent humidity loads requiring dedicated variable-speed dehumidification cycles.' },
  { kicker: 'Factor 5', title: 'Acoustic & Aesthetic Placement', text: 'Outdoor sound boundaries (<24 dBA night mode targets), property line setbacks, and discreet architectural screen integration.' },
  { kicker: 'Factor 6', title: 'Household Living & Zoning', text: 'Individualized bedroom climate control, home office occupancy schedules, and smart home automation platform pairing.' },
]
const faqs = [
  { q: 'How long does a full system replacement take?', a: 'Most residential replacements are completed in one to two days. Projects that include duct redesign or additional zoning can take longer, and your proposal will state the schedule up front.' },
  { q: 'Why not simply match the size of my old unit?', a: 'Older systems were often oversized. A Manual J calculation sizes the new system to your home’s actual loads, which improves comfort, humidity control and sound.' },
  { q: 'What does “variable-capacity” mean for my comfort?', a: 'The compressor and fan adjust continuously rather than cycling on and off. That means steadier temperatures, better dehumidification and a much quieter system.' },
  { q: 'Do you handle permits and manufacturer registration?', a: 'Yes. We manage permitting, inspection scheduling and warranty registration so your coverage is documented from day one.' },
  { q: 'Is financing available?', a: 'Customized residential financing is available through vetted lending partners, subject to approved credit. Terms are discussed in your proposal.' },
]

function Finance() {
  const [amt, setAmt] = useState(18000)
  const [yrs, setYrs] = useState(7)
  const [apr, setApr] = useState(7.9)
  const r = apr / 100 / 12
  const n = yrs * 12
  const m = r === 0 ? amt / n : (amt * r) / (1 - Math.pow(1 + r, -n))
  const fmt = (v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const rows = [
    ['Equipment & installation', amt, 12000, 40000, 500, setAmt, (v) => fmt(v)],
    ['Term', yrs, 3, 12, 1, setYrs, (v) => `${v} years`],
    ['Illustrative APR', apr, 0, 14, 0.1, setApr, (v) => `${v.toFixed(1)}%`],
  ]
  return (
    <div className="finance">
      <div className="finance__ctl">
        {rows.map(([label, val, min, max, step, set, f]) => (
          <label key={label}>
            <span className="finance__row"><span className="mono">{label}</span><b>{f(val)}</b></span>
            <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(+e.target.value)} style={{ '--p': `${((val - min) / (max - min)) * 100}%` }} />
          </label>
        ))}
      </div>
      <div className="finance__out">
        <small className="mono">Indicative monthly investment</small>
        <b>{fmt(m)}<em>/mo</em></b>
        <p>An illustration only—not an offer of credit. Actual terms are set by third-party lenders and subject to credit approval.</p>
        <Button to="/#schedule" variant="light">Discuss options in a proposal</Button>
      </div>
    </div>
  )
}

export default function AcInstall() {
  return (
    <>
      <PageIntro
        crumb="AC Installation & Replacement" tag="Capital equipment // Cooling"
        eyebrow="Engineered replacement"
        title="A cooling system chosen for your home."
        lead="Replacing a central cooling system is an architectural investment in your residence’s quietude, thermal precision, and long-term energy profile. We design and install balanced, variable-capacity heat pumps and inverters calibrated to your home’s exact envelope—never oversized, hurried, or treated like an off-the-shelf appliance."
        actions={<><Button to="/#schedule">Request a proposal</Button><ArrowLink to="/ac-repair">Repair instead?</ArrowLink></>}
        media={<HouseScene mood="day" caption="Variable-capacity heat pump — acoustic placement study" tag="Summer profile" hotspot="Inverter condenser · < 24 dBA" />}
      />

      <section className="services">
        <div className="wrap">
          <SectionHead eyebrow="When to consider replacement" title="When to consider replacement over continued repair." lead="Equipment age alone rarely justifies capital replacement. Rather, the decision emerges when thermodynamic limitations compromise daily comfort, acoustic profiles, or ongoing mechanical predictability." />
          <CardGrid items={reasons} cols={3} />
        </div>
      </section>

      <section className="process">
        <div className="wrap">
          <SectionHead eyebrow="Methodical planning" title="A measured, five-step replacement protocol." />
          <Steps items={steps} />
        </div>
      </section>

      <section className="dark standard">
        <div className="wrap">
          <SectionHead tone="dark" eyebrow="Selecting the right system" title="Six factors that shape your cooling specification." />
          <i className="hair hair--dark" data-line />
          <CardGrid items={factors} cols={3} tone="dark" />
        </div>
      </section>

      <section className="split">
        <div className="wrap decorum">
          <div>
            <SectionHead eyebrow="Installation craftsmanship" title="Clean mechanical rooms, pristine copper runs, and zero disruption." />
            <div className="stats">
              <Stat n="100%" count={{ n: 100, suffix: '%' }} label="Salaried installers" />
              <Stat n="0.05" count={{ n: 0.05, dec: 2 }} label="Micron pressure spec" />
              <Stat n="Full Log" label="Delivered on handover" />
            </div>
          </div>
          <div className="prose">
            <p data-split="fade">We treat your residence like an architectural gallery. From the instant our technicians arrive, heavy-duty neoprene runners protect all finished floors, entryways are isolated with containment barriers, and work areas are kept spotless throughout the teardown and installation.</p>
            <p data-split="fade">All line connections are purged with oxygen-free nitrogen during brazing to eliminate internal copper oxidation, protecting the sensitive electronic expansion valves of modern variable-inverter systems for decades to come.</p>
            <p data-split="fade">Before our team departs, we conduct an exhaustive commissioning log under live load and provide an in-depth homeowner demonstration of your new system controls and filtration access.</p>
          </div>
        </div>
      </section>

      <section className="services" id="financing">
        <div className="wrap">
          <SectionHead eyebrow="Optional financing advisory" title="Flexible financing options for capital equipment investments." lead="For homeowners preferring to preserve liquid reserves, customized residential financing solutions are available through vetted lending partners, subject to approved credit. Terms, promotional interest periods, and monthly structures can be tailored during your consultation proposal." />
          <Finance />
          <p className="disclaimer">Disclaimer: All financing programs are offered through third-party financial institutions and are subject to credit approval and program availability. Inquire with your engineering advisor for current options.</p>
        </div>
      </section>

      <section className="faqsec">
        <div className="wrap faqsec__grid">
          <SectionHead eyebrow="Frequently addressed inquiries" title="Installation, plainly answered." />
          <Faq items={faqs} />
        </div>
      </section>

      <Cta title="Let’s specify the right system for your home." text="A senior advisor will walk your home, measure what matters, and present a proposal with no sales pressure." primary="Request a proposal" />
    </>
  )
}
