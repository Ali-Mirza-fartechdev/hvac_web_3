import { Button } from '../components/UI'
import ContourField from '../webgl/ContourField'

export default function NotFound() {
  return (
    <section className="nf">
      <ContourField />
      <div className="wrap nf__in">
        <p className="mono" data-reveal>Error 404 — static pressure: 0.00 in.wc</p>
        <h1 className="h1 h1--xl h2--light" data-split="mask">There’s no airflow to this page.</h1>
        <p className="lead lead--light" data-split="fade">The page you’re looking for has moved or never existed. Let’s get you back to a comfortable place.</p>
        <div data-reveal data-delay="0.2"><Button to="/" variant="light">Return home</Button></div>
      </div>
    </section>
  )
}
