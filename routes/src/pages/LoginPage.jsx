import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { getAuthErrorMessage, useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, login, loginWithGoogle } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already logged in (or just logged in) -> go to the profile
  if (user) return <Navigate to="/profile" replace />

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form.email, form.password)
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setSubmitting(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Log in</h1>
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
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Please wait…' : 'Log in'}
        </button>
        <button type="button" className="btn ghost" disabled={submitting} onClick={handleGoogle}>
          Continue with Google
        </button>
      </form>
      <p className="muted small">
        No account yet? <Link to="/signup">Sign up</Link>
      </p>
    </section>
  )
}
