import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function OfflinePage() {
  const navigate = useNavigate()
  const [stillOffline, setStillOffline] = useState(false)

  function retry() {
    if (navigator.onLine) navigate('/')
    else setStillOffline(true)
  }

  return (
    <section className="offline-page">
      <h1>You are offline</h1>
      <p className="muted">This page is not saved. Check your internet connection. Pages you opened before still work.</p>
      <button className="btn" onClick={retry}>Retry connection</button>
      {stillOffline && <p className="error-text">Still no connection.</p>}
    </section>
  )
}
