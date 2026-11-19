import { useState } from 'react'
import { Link } from 'react-router'

export default function OfflinePage() {
  const [checking, setChecking] = useState(false)

  function retryConnection() {
    setChecking(true)
    window.location.reload()
  }

  return (
    <section className="offline-page">
      <h1>You are offline</h1>
      <p className="muted">
        The connection is unavailable. Saved vacancies and previously loaded public data remain available where possible.
      </p>
      <div className="home-links">
        <button className="btn" type="button" onClick={retryConnection}>
          {checking ? 'Checking…' : 'Retry connection'}
        </button>
        <Link className="btn ghost" to="/jobs">Open saved vacancies</Link>
      </div>
    </section>
  )
}
