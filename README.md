# Verdant & Co. — Architectural Heating & Cooling

React 19 · Vite · Three.js · GSAP (ScrollTrigger + SplitText + ScrambleText) · Lenis smooth scroll · React Router

A 7-page site built from the Figma file *Verdant — Template 3*:
Home · Our Services · Service Areas · Maintenance Plans · Heating & Furnace · AC Repair & Diagnostics · AC Installation & Replacement (+ 404).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview
```

Requires Node 20.19+ (22 recommended).

## Deploy (GitHub → Vercel)

1. Create a GitHub repo and push this folder (`node_modules/` and `dist/` are git-ignored).
2. In Vercel: **Add New → Project → import the repo.** Vercel auto-detects Vite
   (build `npm run build`, output `dist`). No env vars needed.
3. `vercel.json` already contains the SPA rewrite (so `/services`, `/ac-repair`… work on refresh)
   and long-lived cache headers for hashed assets.

## What's in it

| Area | Implementation |
| --- | --- |
| **Hero** | Procedural Three.js craftsman house (dusk), GPU airflow particles from a heat-pump, flickering window light, pointer parallax, scroll-driven camera dolly, projected hotspot label |
| **Other 3D** | Vaulted-interior airflow scene · thermal-imaging shader with live cursor readout · isoline "pressure map" backgrounds · service-area coverage radar (linked to the directory table and ZIP checker) |
| **Scroll** | Lenis + ScrollTrigger; SplitText masked headline reveals, line draws, counters, scrubbed process rails, staggered groups, clip-path media reveals |
| **Header** | Collapsing utility bar, hide-on-scroll-down / show-on-scroll-up, scroll-progress hairline, label-roll nav hovers, animated Services mega-panel, full-screen mobile menu |
| **Footer** | Live "dispatch desk open" status (timezone aware), animated link hovers, giant outline wordmark that rises on scroll, back-to-top with progress ring |
| **Interaction** | Page-transition curtain, preloader, magnetic buttons, pointer-spotlight cards with blueprint crop marks, custom cursor, scramble-text telemetry, FAQ accordions |
| **Functional bits** | ZIP/municipality checker, plan configurator, furnace-age advisor, financing illustration, schedule dialog |
| **Accessibility** | Respects `prefers-reduced-motion` (no Lenis, no reveals, static WebGL frame), skip link, focus styles, aria on controls |

## Edit content

- Contact details, hours, nav, footer links → `src/data/site.js`
- Service territory, ZIPs, radar positions → `src/data/communities.js`
- Page copy → the `const` arrays at the top of each file in `src/pages/`
- Colors / type tokens → `:root` in `src/styles/global.css`

## Things you should know

- **Photos.** The Figma photographs could not be downloaded when this was generated, so every
  media slot renders a live Three.js scene instead. To use real photos, drop `hero-house.jpg`,
  `interior.jpg`, `technician.jpg` into `public/images/` (see the README there) — they are detected
  and swapped in automatically.
- **Copy I wrote vs. copy from Figma.** Headlines, body copy, metrics and card text come from the
  Figma file. Short micro-labels that weren't readable from the file, all FAQ answers, the six
  maintenance-checklist descriptions, the heating "preparation" cards, the five AC-install step
  descriptions, and plan pricing wording were written to match the brand voice — **review them.**
  ZIP codes, phone number, license number and e-mail are placeholders.
- **Schedule form.** A static Vercel site has no backend, so the dialog opens a prefilled `mailto:`.
  Swap `submit()` in `src/components/ScheduleDialog.jsx` for Formspree/Resend/an API route when ready.
- **Financing widget** is an illustrative amortization calculator, clearly labeled as not an offer of credit.
- The Figma footer credit line ("Template 03: Designed by FAR Tech & Developers") is kept; remove it in `Footer.jsx` if not wanted.
- Three.js is ~190 kB gzipped and is code-split into its own chunk.
