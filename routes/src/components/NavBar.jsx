import { Link, NavLink } from 'react-router'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/jobs', label: 'Jobs', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/about', label: 'About' },
  { to: '/jobs/new', label: '+ Post a job' },
]

export default function NavBar() {
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
          <NavLink to="/login" className="nav-btn login">
            Log in
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
