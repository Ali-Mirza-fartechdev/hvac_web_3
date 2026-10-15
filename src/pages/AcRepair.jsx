import { Button, ArrowLink, Eyebrow } from '../components/UI'
import ThermalField from '../webgl/ThermalField'
import { PageIntro, SectionHead, CardGrid, Steps, Faq, Cta, Quotes, Pull, Stat } from '../sections/Blocks'

const symptoms = [
  { kicker: 'Sign 01', title: 'Uneven Temperatures & Hot Spots', text: 'Specific zones or upper architectural stories fail to maintain setpoints despite continuous blower run, indicating zoning damper friction or distribution duct losses.' },
  { kicker: 'Sign 02', title: 'Warm Air from Ceiling Diffusers', text: 'Air circulates but fails to strip latent humidity or depress temperature. Frequently caused by failed contactor points, blown capacitors, or refrigerant loop imbalance.' },
  { kicker: 'Sign 03', title: 'Unusual Sounds & Harmonic Noise', text: 'Buzzing electrical relays, whistling diffusers, or mechanical chatter from the compressor cabinet signal bearing wear or sheet metal harmonic resonance.' },
  { kicker: 'Sign 04', title: 'Weak or Restricted Air Velocity', text: 'Blower motor RPM fails to overcome elevated external static pressure. Often caused by high-resistance secondary filters or fouled indoor heat-exchange coils.' },
  { kicker: 'Sign 05', title: 'Condensate Backup or Standing Water', text: 'Moisture accumulation around the indoor unit from clogged P-traps, cracked secondary drain pans, or frozen evaporator coils experiencing sudden melt cycles.' },
  { kicker: 'Sign 06', title: 'Rapid System Cycling (Short-Cycling)', text: 'System initiates and terminates cycles within 3 to 5 minutes, tripping internal thermal safeties, high-pressure cutoffs, or misreading thermostatic control sensors.' },
]
const steps = [
  { kicker: 'Step 01', title: 'Listen & Investigate', text: 'Homeowner consultation regarding thermal history, comfort imbalances across rooms, odd sounds, and system event timelines.' },
  { kicker: 'Step 02', title: 'Scientific Component Audit', text: 'Digital manifold subcooling and superheat evaluation, dual-probe static pressure verification, and microfarad capacitor tests.' },
  { kicker: 'Step 03', title: 'Plain-Language Findings', text: 'We present an itemized digital health report with raw telemetry data explained clearly, free of industry jargon or false urgency.' },
  { kicker: 'Step 04', title: 'Transparent Repair Paths', text: 'Firm upfront quotes before tools touch your machinery. You decide whether to proceed with exact factory replacement components.' },
]
const visit = [
  { kicker: 'Controls', title: 'Thermostat & Control Systems', text: 'Inspection of low-voltage wiring circuits, digital bus communication integrity, and ambient temperature sensor calibration against NIST reference thermometers.', bullets: ['24V transformer step-down load test', 'Microprocessor communication continuity'] },
  { kicker: 'Airflow', title: 'Airflow Dynamics & Filtration', text: 'Direct manometer measurement of external total static pressure (ETSP), blower wheel cleanliness, supply plenum velocity, and return duct balance.', bullets: ['Differential static pressure across coils', 'CFM air volume balancing across zones'] },
  { kicker: 'Electrical', title: 'Electrical & Contactor Quality', text: 'Testing run and start capacitors against factory capacitance tolerances, checking magnetic contactor face pitting, and tightening high-voltage lugs.', bullets: ['Microfarad (µF) tolerance within ±5%', 'Contactor voltage drop under load'] },
  { kicker: 'Refrigerant', title: 'Refrigerant Circuit & Heat Transfer', text: 'Real-time digital manifold measurement of subcooling and superheat, electronic infrared sniffer leak sweeps, and exterior fin heat transfer checks.', bullets: ['Target vs. actual subcooling confirmation', 'Electronic ultrasonic leak verification'] },
  { kicker: 'Drainage', title: 'Condensate Drainage & Traps', text: 'Cleaning and chemical clearing of primary condensate drain lines, secondary safety float switch triggering, and condensate pump run checks.', bullets: ['Secondary overflow float test', 'Evacuation line vacuum flush'] },
  { kicker: 'Mechanical', title: 'Compressor & Blower Telemetry', text: 'Verification of compressor true running amp draw (RLA) against locked rotor amps (LRA), ECM motor modulation signal, and bearing thermal imagery.', bullets: ['Inverter DC modulation bus review', 'Compressor thermal imaging verification'] },
]
const factors = [
  { kicker: 'Factor 01', title: 'Equipment Age & Fatigue', text: 'Evaluating the remaining engineered service life of coils and compressor bearings versus the cumulative mechanical fatigue of the system.' },
  { kicker: 'Factor 02', title: 'Nature & Repair Cost', text: 'Differentiating simple field-replaceable electrical components (capacitors, contactors, fan motors) from sealed refrigerant circuit breaches.' },
  { kicker: 'Factor 03', title: 'Seasonal Efficiency', text: 'Comparing the operational energy cost of older 10–13 SEER single-stage compressors against modern variable-capacity 20+ SEER2 inverter heat pumps.' },
  { kicker: 'Factor 04', title: 'Homeowner Plans', text: 'Tailoring recommendations to your timeline—whether you plan an upcoming home remodel, room addition, or simply want reliable immediate comfort.' },
]
const quotes = [
  { text: 'Two other contractors immediately insisted our six-year-old variable system needed total replacement. Verdant’s technician identified a drifted microfarad capacitor and a loose bus wire in twenty minutes. Refreshingly honest.', who: 'Julian & Claire V.', where: 'Westwood Hills • Inverter Heat Pump Repair' },
  { text: 'The digital telemetry report showed exact static pressure drop and motor RPM before and after the repair. No vague explanations—just clear, disciplined engineering.', who: 'Marcus T.', where: 'Barton Creek Valley • Dual-Fuel System Diagnostic' },
  { text: 'They treated our home with the highest level of care. Shoe covers, protective floor runners, and quiet, respectful technicians. Our primary suite is perfectly balanced again.', who: 'Elena S.', where: 'Pemberton Heights • Evaporator Coil Restoration' },
]
const faqs = [
  { q: 'My AC is running but the air isn’t cold. What should I check first?', a: 'Confirm the thermostat is set to cool and the filter isn’t clogged, then check that the outdoor unit’s fan is spinning. If it is, turn the system off and call us—running a system with low refrigerant or a frozen coil can damage the compressor.' },
  { q: 'Do you charge extra for emergency or after-hours diagnostics?', a: 'Our diagnostics are transparent and we do not inflate emergency pricing. Your technician quotes the scope in writing before work begins.' },
  { q: 'Will you use factory OEM components?', a: 'Yes. We use factory OEM or equivalent-specification parts and document the part numbers in your digital report.' },
  { q: 'How long does a typical diagnostic take?', a: 'Most visits take 60–90 minutes, including the written telemetry summary. More complex refrigerant-circuit work can take longer, and we’ll tell you before we begin.' },
]

export default function AcRepair() {
  return (
    <>
      <PageIntro
        crumb="AC Repair & Diagnostics" tag="Field diagnostics // Cooling"
        eyebrow="Precision troubleshooting"
        title="When your AC needs attention, start with a clear diagnosis."
        lead="Cooling disruptions rarely begin with catastrophic failure. More often, they stem from subtle thermodynamic imbalances, contactor wear, static duct resistance, or micro-refrigerant migration. Our senior technicians practice methodical, non-hurried investigation—protecting your home’s architectural finishes while isolating root causes with digital laboratory precision."
        actions={<><Button to="/#schedule">Request diagnostics</Button><ArrowLink to="/ac-installation">Considering replacement?</ArrowLink></>}
        media={
          <div className="stack">
            <ThermalField className="stage--tall" badge="Field diagnostic protocol" lines={['LIVE LOAD SCAN', 'SUBCOOL 11.2 °F', 'SUPERHEAT 9.8 °F']} />
            <p className="note-card" data-reveal><b>Field diagnostic protocol</b>48-point thermodynamic and electrical verification. Every sensor, relay, and air circuit audited prior to disassembly.</p>
          </div>
        }
      />

      <section className="services">
        <div className="wrap">
          <SectionHead eyebrow="Symptom recognition" title="Common signs your cooling system requires attention." lead="Residential cooling networks communicate distress in measurable ways. Addressing these symptoms early prevents secondary component fatigue, motor burnouts, and unneeded energy consumption." />
          <CardGrid items={symptoms} cols={3} />
        </div>
      </section>

      <section className="process">
        <div className="wrap">
          <SectionHead eyebrow="Diagnostic approach" title="Methodical investigation, zero guesswork." />
          <Steps items={steps} />
        </div>
      </section>

      <section className="dark standard">
        <div className="wrap">
          <SectionHead tone="dark" eyebrow="What a service visit may involve" title="Comprehensive inspection tailored to your equipment." lead="Every residential mechanical room possesses distinct architectural and airflow nuances. Your technician evaluates relevant components based on system configuration, age, and observed symptoms." />
          <i className="hair hair--dark" data-line />
          <CardGrid items={visit} cols={3} tone="dark" />
        </div>
      </section>

      <section className="services">
        <div className="wrap advisory">
          <div>
            <SectionHead eyebrow="Honest advisory" title="Repair or Replace: An honest, balanced evaluation." lead="We view cooling systems as long-term home investments. We help you make an informed decision based on verifiable telemetry data, not arbitrary age rules or sales quotas." />
            <Pull left="— Verdant & Co. Engineering Code of Conduct">Our technicians are 100% non-commissioned. We have no incentive to recommend equipment replacement when a factory-spec repair will restore full system integrity.</Pull>
          </div>
          <CardGrid items={factors} cols={2} />
        </div>
      </section>

      <section className="split">
        <div className="wrap decorum">
          <div>
            <Eyebrow>Sanctuary etiquette &amp; home care</Eyebrow>
            <h2 className="h2" data-split="mask">Clean floor runners, digital telemetry reports, and quiet communication.</h2>
          </div>
          <div>
            <p className="lead" data-split="fade">Your home is a private sanctuary, not an industrial construction site. When our technicians arrive, they deploy surface protectors, wear sanitized shoe covers, and conduct mechanical audits with absolute quiet discipline.</p>
            <div className="stats">
              <Stat n="100%" count={{ n: 100, suffix: '%' }} label="Background checked" />
              <Stat n="120+ Hrs" count={{ n: 120, suffix: '+ Hrs' }} label="Annual technical training" />
              <Stat n="0%" count={{ n: 0, suffix: '%' }} label="Sales commission" />
            </div>
          </div>
        </div>
      </section>

      <section className="voices">
        <div className="wrap">
          <SectionHead eyebrow="Homeowner feedback" title="Quiet words from homeowners we’ve served." />
          <Quotes items={quotes} />
        </div>
      </section>

      <section className="faqsec">
        <div className="wrap faqsec__grid">
          <SectionHead eyebrow="Frequently addressed inquiries" title="Cooling repair, plainly answered." />
          <Faq items={faqs} />
        </div>
      </section>

      <Cta title="Get a clear diagnosis before you decide anything." text="Instrumented testing, itemized findings and a firm written quote—before tools touch your equipment." />
    </>
  )
}
