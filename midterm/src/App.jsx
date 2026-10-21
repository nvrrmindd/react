import { useState } from 'react'
import Header from './components/Header'
import JobsPage from './components/JobsPage'
import JobDetail from './components/JobDetail'
import JobForm from './components/JobForm'
import { initialFilters } from './constants'

export default function App() {
  // 'list' | 'detail' | 'add'
  const [view, setView] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  // filters live here so they are kept when user opens a job and comes back
  const [filters, setFilters] = useState(initialFilters)
  // success message after a new vacancy is published
  const [notice, setNotice] = useState('')

  function navigate(next) {
    setNotice('')
    setView(next)
  }

  function openJob(id) {
    setSelectedId(id)
    navigate('detail')
  }

  function handleCreated(job) {
    setFilters(initialFilters) // show the new job on top
    setView('list')
    setNotice(`Vacancy "${job.title}" was published.`)
  }

  return (
    <div className="app">
      <Header view={view} onNavigate={navigate} />
      <main className="container">
        {view === 'list' && notice && <p className="notice">{notice}</p>}
        {view === 'list' && (
          <JobsPage filters={filters} onFiltersChange={setFilters} onOpenJob={openJob} />
        )}
        {view === 'detail' && (
          // key resets JobDetail state when another job is opened
          <JobDetail key={selectedId} jobId={selectedId} onBack={() => navigate('list')} />
        )}
        {view === 'add' && <JobForm onCreated={handleCreated} onCancel={() => navigate('list')} />}
      </main>
    </div>
  )
}
