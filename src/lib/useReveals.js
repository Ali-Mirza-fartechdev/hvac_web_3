import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReduced, isDesktop } from './motion'

/**
 * Declarative scroll choreography. Pages stay clean — they just tag markup:
 *
 *  data-split="mask"     headline: line-by-line masked rise (SplitText)
 *  data-split="fade"     paragraph: soft line fade/rise
 *  data-reveal           element: fade + rise   (data-delay="0.1")
 *  data-reveal="clip"    element: clip-path wipe from bottom (media)
 *  data-stagger          parent: its direct children rise in sequence
 *  data-line             hairline draws left→right
 *  data-count="98"       number counts up (data-suffix, data-prefix, data-decimals)
 *  data-parallax="0.12"  scroll-scrubbed drift (fraction of element height)
 *  data-scrub-fill       element scales on Y/X by scroll progress through its parent
 */
export function useReveals(rootRef, deps = []) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReduced()) return
    let ctx
    let cancelled = false

    const run = () => {
      if (cancelled) return
      ctx = gsap.context(() => {
        const start = 'top 88%'

        // 1 — headline masks
        root.querySelectorAll('[data-split]').forEach((el) => {
          const mode = el.dataset.split
          const delay = parseFloat(el.dataset.delay || 0)
          SplitText.create(el, {
            type: 'lines',
            mask: mode === 'mask' ? 'lines' : undefined,
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
              el.style.visibility = 'visible'
              return gsap.from(self.lines, {
                yPercent: mode === 'mask' ? 108 : 0,
                y: mode === 'mask' ? 0 : 18,
                opacity: mode === 'mask' ? 1 : 0,
                duration: mode === 'mask' ? 1.15 : 0.9,
                ease: 'vd',
                stagger: mode === 'mask' ? 0.09 : 0.07,
                delay,
                scrollTrigger: { trigger: el, start, once: true },
              })
            },
          })
        })

        // 2 — generic reveals
        root.querySelectorAll('[data-reveal]').forEach((el) => {
          const delay = parseFloat(el.dataset.delay || 0)
          if (el.dataset.reveal === 'clip') {
            gsap.fromTo(
              el,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'vd', delay,
                scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
            )
            const inner = el.querySelector('[data-clip-inner]')
            if (inner)
              gsap.fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'vd', delay,
                scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
          } else {
            gsap.fromTo(
              el,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 1, ease: 'vd', delay, clearProps: 'transform',
                scrollTrigger: { trigger: el, start, once: true } }
            )
          }
        })

        // 3 — staggered groups
        root.querySelectorAll('[data-stagger]').forEach((parent) => {
          const gap = parseFloat(parent.dataset.stagger || 0.09)
          gsap.fromTo(
            parent.children,
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 1, ease: 'vd', stagger: gap, clearProps: 'transform',
              scrollTrigger: { trigger: parent, start: 'top 85%', once: true } }
          )
        })

        // 4 — hairlines
        root.querySelectorAll('[data-line]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.4, ease: 'vdInOut', transformOrigin: 'left center',
              scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
          )
        })

        // 5 — counters
        root.querySelectorAll('[data-count]').forEach((el) => {
          const end = parseFloat(el.dataset.count)
          const dec = parseInt(el.dataset.decimals || 0, 10)
          const pre = el.dataset.prefix || ''
          const suf = el.dataset.suffix || ''
          const o = { v: 0 }
          const fmt = (v) => pre + v.toFixed(dec) + suf
          el.textContent = fmt(0)
          gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out',
            onUpdate: () => (el.textContent = fmt(o.v)),
            scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
        })

        // 6 — parallax (desktop only; cheap & subtle)
        if (isDesktop()) {
          root.querySelectorAll('[data-parallax]').forEach((el) => {
            const amt = parseFloat(el.dataset.parallax)
            gsap.fromTo(el, { yPercent: -amt * 100 }, { yPercent: amt * 100, ease: 'none',
              scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } })
          })
        }

        // 7 — scrubbed fills (progress rails)
        root.querySelectorAll('[data-scrub-fill]').forEach((el) => {
          const axis = el.dataset.scrubFill === 'x' ? 'scaleX' : 'scaleY'
          gsap.fromTo(el, { [axis]: 0 }, { [axis]: 1, ease: 'none',
            transformOrigin: axis === 'scaleX' ? 'left center' : 'center top',
            scrollTrigger: { trigger: el.closest('.steps') || el.parentElement, start: 'top 72%', end: 'bottom 60%', scrub: 0.4 } })
        })
      }, root)

      ScrollTrigger.refresh()
    }

    // Wait for fonts (SplitText needs final metrics) and for the preloader / page curtain to lift
    const gate = window.__vdReady
      ? new Promise((r) => setTimeout(r, window.__vdNav ? 700 : 0))
      : new Promise((r) => window.addEventListener('vd:ready', r, { once: true }))
    Promise.all([document.fonts.ready, gate]).then(run)
    return () => {
      cancelled = true
      ctx && ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
