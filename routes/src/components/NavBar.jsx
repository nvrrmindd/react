import { Link, NavLink } from 'react-router'
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
  const { user, loading, logout } = useAuth()

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          AI Era Jobs
        </Link>
        <nav className="nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-btn">
              {link.label}
            </NavLink>
          ))}
          {!loading && !user && (
            <>
              <NavLink to="/login" className="nav-btn login">
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-btn login">
                Signup
              </NavLink>
            </>
          )}
          {!loading && user && (
            <>
              <NavLink to="/profile" className="nav-btn login">
                Profile
              </NavLink>
              <button className="nav-btn login logout" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
