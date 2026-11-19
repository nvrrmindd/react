import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/jobs', label: 'Jobs', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/about', label: 'About' },
  { to: '/jobs/new', label: '+ Post a job' },
]

export default function NavBar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          AI Era Jobs
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close menu' : 'Menu'}
        </button>
        <nav className={`nav${menuOpen ? ' nav-open' : ''}`} id="primary-navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-btn" onClick={() => setMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/profile" className="nav-btn login" onClick={() => setMenuOpen(false)}>
                Profile
              </NavLink>
              <button className="nav-btn login logout" onClick={() => { setMenuOpen(false); logout() }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-btn login" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-btn login" onClick={() => setMenuOpen(false)}>
                Signup
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
