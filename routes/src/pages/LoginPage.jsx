import { useState } from 'react'
import { Link } from 'react-router'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setMessage('Authentication is not ready yet. It will be added in a future version.')
  }

  return (
    <section className="auth-card">
      <h1>Log in</h1>
      <p className="muted">Sign in to save vacancies and track your applications.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input className="input" type="email" name="email" required value={form.email} onChange={handleChange} />
        </label>
        <label>
          Password
          <input
            className="input"
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="btn">
          Log in
        </button>
        {message && <p className="notice">{message}</p>}
      </form>
      <p className="muted small">
        Just looking? <Link to="/jobs">Browse jobs without an account</Link>
      </p>
    </section>
  )
}
