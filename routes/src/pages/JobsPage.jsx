import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { getJobs } from '../services/service'
import useJobFilters from '../hooks/useJobFilters'
import Filters from '../components/Filters'
import JobCard from '../components/JobCard'
import Pagination from '../components/Pagination'
import StatusMessage from '../components/StatusMessage'

const PAGE_SIZE = 9

export default function JobsPage() {
  const { filters, updateFilters, resetFilters } = useJobFilters()
  const location = useLocation()
  const notice = location.state?.notice

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)

    getJobs({ ...filters, pageSize: PAGE_SIZE })
      .then((data) => {
        if (ignore) return
        setJobs(data.items)
        setTotal(data.total)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [filters, reloadKey])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  let content
  if (loading) {
    content = <StatusMessage type="loading" text="Loading vacancies…" />
  } else if (error) {
    content = <StatusMessage type="error" text={error} onRetry={() => setReloadKey((k) => k + 1)} />
  } else if (jobs.length === 0) {
    content = <StatusMessage type="empty" text="No vacancies match your filters. Try resetting them." />
  } else {
    content = (
      <>
        <p className="muted">Found {total} vacancies</p>
        <div className="grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <Pagination page={filters.page} totalPages={totalPages} onPageChange={(p) => updateFilters({ page: p })} />
      </>
    )
  }

  return (
    <section>
      <h1>Vacancies</h1>
      {notice && <p className="notice">{notice}</p>}
      <Filters filters={filters} onChange={updateFilters} onReset={resetFilters} />
      {content}
    </section>
  )
}
