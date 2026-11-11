import { lazy } from 'react'
import { Routes, Route } from 'react-router'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import ProtectedRoute from './components/ProtectedRoute'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const JobDetailsPage = lazy(() => import('./pages/JobDetailsPage'))
const NewJobPage = lazy(() => import('./pages/NewJobPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="jobs">
          <Route index element={<JobsPage />} />
          <Route path="new" element={<NewJobPage />} />
          <Route path=":id" element={<JobDetailsPage />} />
        </Route>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
