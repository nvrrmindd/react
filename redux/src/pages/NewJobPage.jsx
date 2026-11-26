import { useNavigate } from 'react-router'
import JobForm from '../components/JobForm'

export default function NewJobPage() {
  const navigate = useNavigate()

  function handleCreated(job) {
    navigate('/jobs', { state: { notice: `Vacancy "${job.title}" was published.` } })
  }

  return <JobForm onCreated={handleCreated} onCancel={() => navigate('/jobs')} />
}
