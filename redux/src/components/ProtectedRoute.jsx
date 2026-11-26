import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import StatusMessage from './StatusMessage'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <StatusMessage type="loading" text="Checking your session…" />
  if (!user) return <Navigate to="/login" replace />

  return children
}
