import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useGo } from '../lib/Transition'
import { gsap, isFinePointer, prefersReduced } from '../lib/motion'
import Icon from './Icon'

/** Transition-aware internal link (falls back to a normal anchor for mailto:/tel:/external) */
export function TLink({ to, children, onClick, ...rest }) {
  const go = useGo()
  const external = /^(mailto:|tel:|https?:)/.test(to)
  if (external) return <a href={to} onClick={onClick} {...rest}>{children}</a>
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick && onClick(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

export function useActive(match = []) {
  const { pathname } = useLocation()
  return match.includes(pathname)
}

/** Magnetic pull for primary buttons (fine pointers only) */
export function useMagnetic(ref, strength = 0.28) {
  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReduced()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref, strength])
}

/**
 * variant: dark | light | ghost-light | outline | text
 * The label is rendered twice and rolls on hover; a fill sweeps in from below.
 */
export function Button({ to, href, variant = 'dark', icon, children, className = '', magnetic = true, ...rest }) {
  const ref = useRef(null)
  useMagnetic(ref, magnetic ? 0.22 : 0)
  const inner = (
    <>
      <span className="btn__fill" />
      {icon && <Icon name={icon} size={14} />}
      <span className="btn__roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </>
  )
  const cls = `btn btn--${variant} ${className}`
  if (to) return <TLink ref={ref} to={to} className={cls} {...rest}>{inner}</TLink>
  return <a ref={ref} href={href} className={cls} {...rest}>{inner}</a>
}

/** "VIEW REPAIR STANDARDS →" — arrow slides, underline draws */
export function ArrowLink({ to, children, tone = 'ink', className = '', ...rest }) {
  return (
    <TLink to={to} className={`arrow-link arrow-link--${tone} ${className}`} {...rest}>
      <span className="arrow-link__t">{children}</span>
      <span className="arrow-link__a"><Icon name="arrow" size={13} stroke={1.6} /><Icon name="arrow" size={13} stroke={1.6} /></span>
    </TLink>
  )
}

export function Eyebrow({ children, tone = 'terracotta', className = '' }) {
  return (
    <p className={`eyebrow eyebrow--${tone} ${className}`}>
      <span className="eyebrow__rule" data-line />
      <span>{children}</span>
    </p>
  )
}

/** Cards share a pointer-tracked spotlight + blueprint crop marks (CSS does the rest) */
export function useSpotlight(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer()) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    el.addEventListener('pointermove', move)
    return () => el.removeEventListener('pointermove', move)
  }, [ref])
}

export function Card({ as: Tag = 'article', className = '', children, ...rest }) {
  const ref = useRef(null)
  useSpotlight(ref)
  return (
    <Tag ref={ref} className={`card ${className}`} {...rest}>
      <i className="crop crop--tl" /><i className="crop crop--tr" /><i className="crop crop--bl" /><i className="crop crop--br" />
      {children}
    </Tag>
  )
}

/** Scramble the telemetry line on hover (monospace readouts) */
export function Telemetry({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const host = el.closest('.card') || el
    const text = el.textContent
    const run = () => gsap.to(el, { duration: 0.9, scrambleText: { text, chars: '0123456789±.<>%', speed: 0.6, revealDelay: 0.1 }, overwrite: true })
    host.addEventListener('pointerenter', run)
    return () => host.removeEventListener('pointerenter', run)
  }, [])
  return <p ref={ref} className={`mono telemetry ${className}`}>{children}</p>
}
