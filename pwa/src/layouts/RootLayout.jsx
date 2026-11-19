import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import NavBar from '../components/NavBar'
import PwaStatus from '../components/PwaStatus'

export default function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    navigator.serviceWorker?.controller?.postMessage({
      type: 'CACHE_PAGE',
      url: window.location.href,
    })
  }, [location.pathname, location.search])

  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <PwaStatus />
        <Outlet />
      </main>
      <footer className="footer container muted small">AI Era Jobs</footer>
    </div>
  )
}
