import { Routes, Route } from 'react-router'
import RootLayout from './layouts/RootLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import JobsPage from './pages/JobsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import NewJobPage from './pages/NewJobPage'
import DashboardPage from './pages/DashboardPage'
import FeedbackPage from './pages/FeedbackPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

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
