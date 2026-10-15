import { site } from '../data/site'
import { communities } from '../data/communities'
import Icon from '../components/Icon'
import { Button, ArrowLink, Eyebrow, TLink } from '../components/UI'
import HouseScene from '../webgl/HouseScene'
import InteriorScene from '../webgl/InteriorScene'
import ThermalField from '../webgl/ThermalField'
import { SectionHead, CardGrid, Pillars, Steps, Quotes, Cta, Pull } from '../sections/Blocks'

const trust = [
  ['01', 'Diagnostics', 'Exacting standards', 'Zero guesswork diagnostics using calibrated digital airflow and refrigeration instruments.'],
  ['02', 'Integrity', 'Clear recommendations', 'Detailed scope of work with transparent, itemized choices before any mechanical work begins.'],
  ['03', 'Craft', 'Master workmanship', 'Licensed specialists who take pride in straight pipe runs, tidy wiring, and quiet dampening.'],
  ['04', 'Sanctuary', 'Homeowner care', 'Floor runners, clean boot covers, and immaculate post-service cleanup on every single visit.'],
]

const services = [
  { wide: true, accent: true, kicker: 'Primary engineering', meta: 'SEER2 • 20+ RATED', title: 'AC Installation & Replacement', text: 'High-efficiency inverter heat pumps and variable-capacity condenser systems tailored through rigorous Manual J heat-load calculations. We re-engineer plenum transitions and design duct runs for zero turbulence.', tags: ['Variable-speed inverter', 'Quiet acoustic dampening', 'Multi-zone airflow'], link: ['/ac-installation', 'Explore installation & equipment'] },
  { wide: true, kicker: 'Precision troubleshooting', meta: '24–48HR DISPATCH', title: 'AC Repair & Diagnostic Service', text: 'Methodical electronic fault-tracing, subcooling and superheat calibration, and blower motor analysis. Transparent diagnostics with no inflated emergency fees.', tags: ['Calibrated digital manifold', 'Factory OEM components'], link: ['/ac-repair', 'View repair standards'] },
  { kicker: 'Thermal generation', meta: '98% AFUE', title: 'Heating & Furnace Systems', text: 'Ultra-high efficiency condensing gas furnaces and hybrid dual-fuel pairings. Non-disruptive thermal comfort designed for sub-zero resilience.', link: ['/heating-furnace', 'Explore heating solutions'] },
  { kicker: 'Atmospheric purity', meta: 'MERV 16 / HEPA', title: 'Indoor Air Quality & Filtration', text: 'Whole-home steam humidification, ERV energy recovery ventilation, and medical-grade in-duct air purification protecting fine furnishings and health.', link: ['/services#air-quality', 'Discover IAQ systems'] },
  { kicker: 'System longevity', meta: 'BI-ANNUAL AUDIT', title: 'Preservation Agreements', text: 'Systematic chemical coil cleansing, electrical thermal scan, static pressure logging, and VIP guaranteed same-day dispatch access.', link: ['/maintenance-plans', 'View maintenance tiers'] },
]

const pillars = [
  { icon: 'thermo', kicker: 'Pillar 01', title: 'Temperature Consistency', text: 'Eliminating hot and cold spots across multiple stories with balanced multi-zone dampers and proportional air division.', telemetry: 'Tolerance: ± 0.5°F Target' },
  { icon: 'wind', kicker: 'Pillar 02', title: 'Engineered Airflow', text: 'Quiet, non-drafty laminar air distribution that prevents whistling registers and stagnant thermal pockets.', telemetry: 'Velocity: < 400 FPM at Grille' },
  { icon: 'drop', kicker: 'Pillar 03', title: 'Humidity Modulation', text: 'Targeting 40–50% relative humidity year-round to protect architectural woodwork, fine art, and respiratory wellness.', telemetry: 'Envelope RH: 45% Maintained' },
  { icon: 'hex', kicker: 'Pillar 04', title: 'Particulate & IAQ Control', text: 'Continuous elimination of microscopic dust, VOCs, wildfire smoke, and seasonal pollen prior to interior redistribution.', telemetry: 'Capture: 99.97% at 0.3 Micron' },
]

const steps = [
  { kicker: 'Phase 01', title: 'Understand the Issue', text: 'We begin with comprehensive diagnostic measurements—inspecting static duct pressure, electrical draw, and thermal differentials rather than guessing or performing hasty visual scans.', note: 'INCLUDES FULL DIAGNOSTIC PRINTOUT' },
  { kicker: 'Phase 02', title: 'Discuss the Options', text: 'You receive an honest, plain-English overview of what’s occurring with your system, along with repair and replacement options so you stay in total control of budget and timeline.', note: 'ITEMIZED PRICING BEFORE WORK BEGINS' },
  { kicker: 'Phase 03', title: 'Complete Work Carefully', text: 'Our certified technicians execute the agreed work cleanly, test the complete operational envelope under live load, and leave your mechanical area cleaner than we found it.', note: 'FULL COMMISSIONING & SITE SIGN-OFF' },
]

const quotes = [
  { text: 'Verdant & Co. completely resolved our second-floor cooling disparity that three other contractors couldn’t diagnose. The ductwork reconfiguration was executed with true craftsmanship.', who: 'Julian & Claire Vance', where: 'Craftsman Renovation in Barton Creek' },
  { text: 'They arrived on time, wore protective shoe covers, explained the diagnostic readings clearly without any high-pressure upselling, and had our heat pump running smoothly in two hours.', who: 'Marcus H. Sterling', where: 'Contemporary Residence in Westwood Hills' },
  { text: 'The new inverter system is virtually silent. Our energy bills decreased noticeably, and the whole-home humidity control made our hardwood floors look significantly better.', who: 'Evelyn Ross-Childs', where: 'Historic Estate in Pemberton Heights' },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero" data-hero>
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <Eyebrow tone="muted">Residential Heating &amp; Cooling</Eyebrow>
            <h1 className="h1 h1--xl" data-split="mask" data-delay="0.2">Comfort, thoughtfully delivered.</h1>
            <p className="lead lead--lg" data-split="fade" data-delay="0.45">
              Engineered climate solutions for distinctive American homes. We treat residential heating, cooling, and air quality as an architectural discipline—prioritizing quiet operation, balanced airflow, and immaculate installation craftsmanship.
            </p>
            <div className="hero__actions" data-reveal data-delay="0.6">
              <Button to="/#schedule" variant="dark">Schedule In-Home Consultation</Button>
              <a className="phoneblock" href={`tel:${site.tel}`}>
                <Icon name="phone" size={15} />
                <span><b>{site.phone}</b><small>Direct dispatch line</small></span>
              </a>
            </div>
            <p className="hero__trust" data-reveal data-delay="0.75">
              <Icon name="shield" size={14} /> Direct, transparent recommendations • Uniformed certified technicians • Respectful of your home
            </p>
          </div>
          <HouseScene />
        </div>
        <button className="scrollcue" onClick={() => document.getElementById('trust')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Scroll to content" type="button"><i /></button>
      </section>

      {/* TRUST STRIP */}
      <section className="trust" id="trust">
        <div className="wrap trust__grid" data-stagger="0.1">
          {trust.map(([n, k, t, d]) => (
            <div className="trust__item" key={n}>
              <div className="trust__top"><span className="serif-n">{n}</span><span className="tag-mono">{k}</span></div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ETHOS */}
      <section className="split" id="ethos">
        <div className="wrap split__grid">
          <div className="split__copy">
            <Eyebrow>Our ethos</Eyebrow>
            <h2 className="h2" data-split="mask">A more considered approach to indoor climate.</h2>
            <p data-split="fade">Most residential HVAC work is treated like an emergency transaction—rushed replacements, oversized equipment, and noisy, unbalanced airflow that leaves upstairs rooms cold and basements damp.</p>
            <p data-split="fade">We take an architectural view. Every home has its own thermal envelope, sun exposures, and structural quirks. We tailor heating and cooling systems to preserve the quiet sanctuary of your residence while lowering total lifecycle consumption.</p>
            <Pull left="Mechanical engineering principles" right="Manual J / D compliance">Designed for quiet performance, longevity, and unobtrusive integration with your home’s interior architecture.</Pull>
          </div>
          <InteriorScene photo="/images/interior.jpg" />
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="wrap">
          <SectionHead eyebrow="System capabilities" title="Specialized residential climate services." lead="Engineered for optimal comfort, seasonal resilience, and whisper-quiet operation." />
          <div className="svc-layout">
            <CardGrid items={services.slice(0, 2)} cols={2} />
            <CardGrid items={services.slice(2)} cols={3} />
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="dark pillars-sec">
        <div className="wrap">
          <SectionHead tone="dark" eyebrow="The physics of living well" title="Whole-Home Comfort is More Than Just Temperature." lead="True residential comfort requires a delicate harmony of four interconnected atmospheric conditions inside your home." />
          <i className="hair hair--dark" data-line />
          <Pillars items={pillars} />
        </div>
      </section>

      {/* PROCESS */}
      <section className="process">
        <div className="wrap">
          <SectionHead eyebrow="Service process" title="A transparent, disciplined path to lasting comfort." />
          <Steps items={steps} />
        </div>
      </section>

      {/* CRAFT */}
      <section className="split split--flip" id="company">
        <div className="wrap split__grid">
          <ThermalField photo="/images/technician.jpg" />
          <div className="split__copy">
            <Eyebrow>Professional reputation</Eyebrow>
            <h2 className="h2" data-split="mask">Respectful technicians who treat your home like their own.</h2>
            <p data-split="fade">We do not employ commission-driven salespeople posing as technicians. Every individual dispatched to your residence is a seasoned career tradesperson trained in both state-of-the-art inverter electronics and the delicate protocols of custom homes.</p>
            <p data-split="fade">From custom protective floor carpets and sterile shoe covers to pristine wiring ties and post-installation walkthroughs, our standard of decorum matches the quality of your residence.</p>
            <div className="stats">
              <div className="stat"><b data-count="100" data-suffix="%">100%</b><span>Background checked • non-smoking</span></div>
              <div className="stat"><b data-count="120" data-suffix="+">120+</b><span>Annual factory training hours</span></div>
            </div>
            <ArrowLink to="/services#standard">Learn about our company &amp; credentials</ArrowLink>
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="voices">
        <div className="wrap">
          <SectionHead eyebrow="Customer feedback" title="Quiet words from satisfied homeowners." />
          <Quotes items={quotes} />
        </div>
      </section>

      {/* SERVICE AREA PREVIEW */}
      <section className="areas-prev">
        <div className="wrap areas-prev__grid">
          <div>
            <Eyebrow tone="muted">Service coverage</Eyebrow>
            <h2 className="h2" data-split="mask">Serving discerning homeowners across the Greater Metro Region.</h2>
            <p className="lead" data-split="fade">Our mobile diagnostic units are dispatched across central and suburban neighborhoods daily, equipped with factory OEM components and precision calibration gear.</p>
            <ArrowLink to="/service-areas" tone="terracotta">View complete service area map &amp; response times</ArrowLink>
          </div>
          <ul className="areagrid" data-stagger="0.05">
            {communities.map((c) => (
              <li key={c.id}>
                <TLink to="/service-areas" className="area">
                  <Icon name="pin" size={16} />
                  <b>{c.name}</b>
                  <small>{c.tier === 'priority' ? 'Same-day priority' : 'Active route'}</small>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cta text="Whether your existing heating and cooling system requires methodical maintenance or you are considering a quiet, high-efficiency heat pump installation, our senior technicians are ready to assist." primary="Schedule In-Home Evaluation" />
    </>
  )
}
