import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <section className="auth-card">
      <h1>Profile</h1>
      <dl className="facts">
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Firebase UID</dt>
        <dd>{user.uid}</dd>
      </dl>
      <button className="btn" onClick={logout}>
        Log out
      </button>
    </section>
  )
}
