// Tiny pub/sub so the header, footer and WebGL scenes can react to scroll
// regardless of whether Lenis (smooth) or native scrolling is driving it.
const subs = new Set()
export const state = { y: 0, dir: 1, velocity: 0, progress: 0, lenis: null }

export function onScroll(fn) {
  subs.add(fn)
  return () => subs.delete(fn)
}
export function emitScroll(payload) {
  Object.assign(state, payload)
  subs.forEach((fn) => fn(state))
}

export function scrollToTarget(target, opts = {}) {
  if (state.lenis) {
    state.lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts })
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'auto' })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}
