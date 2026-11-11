import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import NavBar from '../components/NavBar'
import StatusMessage from '../components/StatusMessage'

export default function RootLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Suspense fallback={<StatusMessage type="loading" text="Loading page…" />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="footer container muted small">AI Era Jobs</footer>
    </div>
  )
}
