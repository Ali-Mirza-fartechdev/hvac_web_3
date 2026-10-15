const P = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  clock: ['M12 7v5l3 2', 'circle:12,12,9'],
  pin: ['M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z', 'circle:12,10,2.4'],
  shield: ['M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z', 'M8.5 12l2.5 2.5 4.5-5'],
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  chevron: 'M6 9l6 6 6-6',
  plus: 'M12 5v14M5 12h14',
  menu: 'M4 8h16M4 16h16',
  close: 'M5 5l14 14M19 5L5 19',
  search: ['circle:11,11,6', 'M20 20l-4.2-4.2'],
  thermo: ['M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z', 'M12 9v7'],
  wind: 'M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  hex: ['M12 3l7 4v8l-7 4-7-4V7l7-4z', 'circle:12,11,2'],
  badge: ['M12 3l2.4 1.7 2.9-.1.9 2.8 2.3 1.8-.9 2.7.9 2.7-2.3 1.8-.9 2.8-2.9-.1L12 21l-2.4-1.7-2.9.1-.9-2.8-2.3-1.8.9-2.7-.9-2.7 2.3-1.8.9-2.8 2.9.1L12 3z', 'M8.5 12l2.5 2.5 4.5-5'],
  check: 'M5 12.5l4.5 4.5L19 7',
  ruler: ['M4 17L17 4l3 3L7 20z', 'M8 13l2 2M11 10l2 2M14 7l2 2'],
}
export default function Icon({ name, size = 16, stroke = 1.5, className = '', ...rest }) {
  const parts = [].concat(P[name] || [])
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} aria-hidden="true" {...rest}>
      {parts.map((d, i) => {
        if (d.startsWith('circle:')) {
          const [cx, cy, r] = d.slice(7).split(',')
          return <circle key={i} cx={cx} cy={cy} r={r} />
        }
        return <path key={i} d={d} />
      })}
    </svg>
  )
}

export function LogoMark({ size = 34 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="32.5" height="32.5" stroke="currentColor" strokeWidth="1" />
      <path className="logo-mark__v" d="M8 10l9 15 9-15" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <path className="logo-mark__leaf" d="M17 25c0-6.5 2.2-10 7.6-12" stroke="var(--terracotta)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
