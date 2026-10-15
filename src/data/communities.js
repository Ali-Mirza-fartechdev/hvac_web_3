// Edit this file to change the service territory.
// `radar` places each community on the coverage map: ang (deg, 0 = east, CCW) and r (0–1 of the 35-mile core).
export const communities = [
  { id: 'central-metro', name: 'Central Metro', tier: 'priority', zips: ['78701', '78702', '78705'], radar: { ang: 98, r: 0.12 }, response: '< 2 hr', eta: 'Same-day priority' },
  { id: 'north-hills', name: 'North Hills', tier: 'active', zips: ['78757', '78758', '78759'], radar: { ang: 82, r: 0.52 }, response: '< 4 hr', eta: 'Active route' },
  { id: 'west-highland', name: 'West Highland', tier: 'active', zips: ['78746', '78733'], radar: { ang: 168, r: 0.55 }, response: '< 4 hr', eta: 'Active route' },
  { id: 'oak-ridge', name: 'Oak Ridge', tier: 'priority', zips: ['78731', '78756'], radar: { ang: 130, r: 0.42 }, response: '< 2 hr', eta: 'Same-day priority' },
  { id: 'river-valley', name: 'River Valley', tier: 'active', zips: ['78744', '78741'], radar: { ang: 285, r: 0.6 }, response: '< 4 hr', eta: 'Active route' },
  { id: 'lakeview', name: 'Lakeview', tier: 'priority', zips: ['78734', '78732'], radar: { ang: 205, r: 0.74 }, response: '< 2 hr', eta: 'Same-day priority' },
  { id: 'pinecrest', name: 'Pinecrest', tier: 'active', zips: ['78750', '78726'], radar: { ang: 58, r: 0.82 }, response: '< 4 hr', eta: 'Active route' },
  { id: 'eastwood', name: 'Eastwood', tier: 'active', zips: ['78721', '78723'], radar: { ang: 12, r: 0.66 }, response: '< 4 hr', eta: 'Active route' },
]

// The directory table (service-area page) lists these named neighbourhoods
export const directory = [
  { name: 'Central Metro', zip: '78701', arch: 'Mid-century & modern infill', time: '< 2 hr', status: 'Same-day priority' },
  { name: 'Westwood Hills', zip: '78746', arch: 'Contemporary hillside estates', time: '< 2 hr', status: 'Same-day priority' },
  { name: 'Barton Creek Valley', zip: '78735', arch: 'Craftsman & custom renovations', time: '< 3 hr', status: 'Active route' },
  { name: 'Highland Park', zip: '78731', arch: 'Tudor, colonial & revival', time: '< 2 hr', status: 'Same-day priority' },
  { name: 'Lakeway Preserve', zip: '78734', arch: 'Lakefront luxury residences', time: '< 4 hr', status: 'Active route' },
  { name: 'River Oaks', zip: '78703', arch: 'Historic plaster & millwork', time: '< 3 hr', status: 'Active route' },
  { name: 'Pemberton Heights', zip: '78703', arch: 'Historic estates', time: '< 3 hr', status: 'Active route' },
]

// Extra municipalities the ZIP checker will accept
export const alsoServed = ['Westlake', 'Rollingwood', 'Tarrytown', 'Bee Cave', 'Cedar Park', 'Round Rock']

export function checkCoverage(raw) {
  const q = raw.trim().toLowerCase()
  if (!q) return { state: 'idle' }
  const hit =
    communities.find((c) => c.zips.includes(q) || c.name.toLowerCase().includes(q)) ||
    directory.find((d) => d.zip === q || d.name.toLowerCase().includes(q))
  if (hit) {
    const c = communities.find((c) => c.name === hit.name) || null
    const priority = hit.tier === 'priority' || (hit.status || '').toLowerCase().includes('priority')
    return { state: 'covered', name: hit.name, priority, time: hit.response || hit.time, id: c?.id }
  }
  if (alsoServed.some((a) => a.toLowerCase().includes(q))) {
    return { state: 'covered', name: alsoServed.find((a) => a.toLowerCase().includes(q)), priority: false, time: '< 4 hr' }
  }
  if (/^\d{5}$/.test(q) && q.startsWith('787')) return { state: 'covered', name: `ZIP ${q}`, priority: false, time: '< 4 hr' }
  if (/^\d{5}$/.test(q)) return { state: 'outside', name: `ZIP ${q}` }
  return { state: 'unknown', name: raw.trim() }
}
