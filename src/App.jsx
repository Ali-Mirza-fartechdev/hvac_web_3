import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger } from './lib/motion'
import SmoothScroll from './lib/SmoothScroll'
import { TransitionProvider } from './lib/Transition'
import { useReveals } from './lib/useReveals'
import Header from './components/Header'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import ScheduleDialog from './components/ScheduleDialog'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceAreas from './pages/ServiceAreas'
import MaintenancePlans from './pages/MaintenancePlans'
import Heating from './pages/Heating'
import AcRepair from './pages/AcRepair'
import AcInstall from './pages/AcInstall'
import NotFound from './pages/NotFound'

const TITLES = {
  '/': 'Verdant & Co. — Architectural Heating & Cooling',
  '/services': 'Our Services — Verdant & Co.',
  '/service-areas': 'Service Areas — Verdant & Co.',
  '/maintenance-plans': 'Maintenance Plans — Verdant & Co.',
  '/heating-furnace': 'Heating & Furnace Services — Verdant & Co.',
  '/ac-repair': 'AC Repair & Diagnostics — Verdant & Co.',
  '/ac-installation': 'AC Installation & Replacement — Verdant & Co.',
}

function Page({ children }) {
  const ref = useRef(null)
  const { pathname } = useLocation()
  useReveals(ref, [pathname])
  useEffect(() => {
    document.title = TITLES[pathname] || 'Page not found — Verdant & Co.'
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(t)
  }, [pathname])
  return <main ref={ref} id="main" key={pathname}>{children}</main>
}

function Shell() {
  return (
    <>
      <Preloader />
      <Cursor />
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <Page>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/maintenance-plans" element={<MaintenancePlans />} />
          <Route path="/heating-furnace" element={<Heating />} />
          <Route path="/ac-repair" element={<AcRepair />} />
          <Route path="/ac-installation" element={<AcInstall />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Page>
      <Footer />
      <ScheduleDialog />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <TransitionProvider>
          <Shell />
        </TransitionProvider>
      </SmoothScroll>
    </BrowserRouter>
  )
}
