import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { getAuthErrorMessage, useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { user, signup } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already logged in (or just signed up) -> go to the profile
  if (user) return <Navigate to="/profile" replace />

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    if (!form.email.trim()) return 'Email is required.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    setError(validationError)
    if (validationError) return

    setSubmitting(true)
    try {
      await signup(form.email.trim(), form.password)
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Sign up</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label>
          Email
          <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Password
          <input className="input" type="password" name="password" value={form.password} onChange={handleChange} />
        </label>
        <label>
          Confirm password
          <input
            className="input"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="muted small">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}
