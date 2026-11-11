import { Link } from 'react-router'
import heroImage from '../assets/hero.svg'
import CurrencyWidget from '../components/CurrencyWidget'

export default function HomePage() {
  return (
    <section>
      <div className="home-hero">
        <div>
          <h1>Find an IT job that AI won't replace</h1>
          <p className="muted">
            AI Era Jobs is a job board for IT vacancies. Every vacancy shows its <b>AI risk</b> — how much of the
            work can be automated — and the AI tools the team uses.
          </p>
          <div className="home-links">
            <Link to="/jobs" className="btn">
              Browse jobs
            </Link>
            <Link to="/jobs?aiRisk=Low&sort=salary-desc" className="btn ghost">
              Safest jobs
            </Link>
            <Link to="/dashboard" className="btn ghost">
              Dashboard
            </Link>
            <Link to="/about" className="btn ghost">
              About the project
            </Link>
          </div>
        </div>
        <img src={heroImage} alt="A job card next to a friendly robot" className="home-image" />
      </div>
      <CurrencyWidget amount={1000} />
    </section>
  )
}
