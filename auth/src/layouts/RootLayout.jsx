import { Outlet } from 'react-router'
import NavBar from '../components/NavBar'

export default function RootLayout() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer container muted small">AI Era Jobs</footer>
    </div>
  )
}
