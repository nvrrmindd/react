import { Link, useLocation } from 'react-router'

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <section className="not-found">
      <h1>404</h1>
      <p>
        Page <code>{pathname}</code> does not exist.
      </p>
      <div className="home-links center">
        <Link to="/" className="btn">
          Go home
        </Link>
        <Link to="/jobs" className="btn ghost">
          All jobs
        </Link>
      </div>
    </section>
  )
}
