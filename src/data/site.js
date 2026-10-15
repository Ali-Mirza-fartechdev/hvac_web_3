export const site = {
  name: 'Verdant & Co.',
  tagline: 'Architectural Heating & Cooling',
  phone: '(555) 234-8900',
  tel: '+15552348900',
  email: 'hello@verdantandco.example',
  address: ['Executive Studio: 1200 Stone Arch Parkway, Suite 400', 'Metro Engineering District'],
  hoursLabel: 'MON – FRI: 7:00 AM – 6:00 PM | SAT: 8:00 AM – 2:00 PM',
  hours: [
    ['Mon–Fri', '7:00 AM – 6:00 PM'],
    ['Sat', '8:00 AM – 2:00 PM'],
  ],
  timeZone: 'America/Chicago', // used for the live "open now" indicator
  // [day 0=Sun .. 6=Sat] -> [openHour, closeHour] in 24h, or null
  schedule: { 0: null, 1: [7, 18], 2: [7, 18], 3: [7, 18], 4: [7, 18], 5: [7, 18], 6: [8, 14] },
  license: '[State License #HVAC-000000]',
  areaLine: 'SERVING PRIMARY METRO AREA & SURROUNDING COMMUNITIES',
}

export const services = [
  { no: '01', title: 'AC Installation & Replacement', to: '/ac-installation', blurb: 'Variable-capacity systems sized by Manual J' },
  { no: '02', title: 'AC Repair & Diagnostics', to: '/ac-repair', blurb: 'Instrumented fault-tracing, no parts-swapping' },
  { no: '03', title: 'Heating & Furnace Systems', to: '/heating-furnace', blurb: 'Modulating gas and dual-fuel warmth' },
  { no: '04', title: 'Indoor Air Quality', to: '/services#air-quality', blurb: 'ERV, humidity control and MERV 16 filtration' },
  { no: '05', title: 'Preservation Agreements', to: '/maintenance-plans', blurb: 'Seasonal calibration and priority dispatch' },
]

export const mainNav = [
  { label: 'Services', to: '/services', children: true, match: ['/services', '/ac-installation', '/ac-repair', '/heating-furnace'] },
  { label: 'Indoor Air Quality', to: '/services#air-quality' },
  { label: 'Maintenance Plans', to: '/maintenance-plans', match: ['/maintenance-plans'] },
  { label: 'Our Company', to: '/#company' },
]

export const footerCols = [
  {
    title: 'Residential Services',
    links: [
      ['Air Conditioning Repair', '/ac-repair'],
      ['High-Efficiency AC Installation', '/ac-installation'],
      ['Precision Furnace Tuning', '/heating-furnace'],
      ['Heat Pump Systems', '/ac-installation'],
      ['Architectural Duct Design', '/services'],
    ],
  },
  {
    title: 'Specialized Climate',
    links: [
      ['Indoor Air Filtration', '/services#air-quality'],
      ['Whole-Home Humidity Balancing', '/services#air-quality'],
      ['Energy Audits & Airflow Zoning', '/services#standard'],
      ['Annual Preservation Agreements', '/maintenance-plans'],
    ],
  },
  {
    title: 'Our Company & Care',
    links: [
      ['Our Architectural Standards', '/services#standard'],
      ['The Team & Craftsmanship', '/#company'],
      ['Career Opportunities', 'mailto:hello@verdantandco.example?subject=Careers'],
      ['Service Areas', '/service-areas'],
      ['Homeowner Journal', 'mailto:hello@verdantandco.example?subject=Homeowner%20Journal'],
    ],
  },
]

export const footerAreas = ['Central Metro', 'Westwood Hills', 'Barton Creek Valley', 'Highland Park', 'Lakeway Preserve', 'River Oaks', 'Pemberton Heights']

export function openStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: site.timeZone, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(now)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const h = parseInt(get('hour'), 10) % 24
  const m = parseInt(get('minute'), 10)
  const today = site.schedule[dayIdx]
  const t = h + m / 60
  if (today && t >= today[0] && t < today[1]) return { open: true, label: 'Dispatch desk open' }
  return { open: false, label: 'After hours — emergency line active' }
}
