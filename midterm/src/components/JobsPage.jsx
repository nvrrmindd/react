import { useEffect, useState } from 'react'
import { getJobs } from '../api'
import Filters from './Filters'
import JobCard from './JobCard'
import Pagination from './Pagination'
import StatusMessage from './StatusMessage'

const PAGE_SIZE = 9

export default function JobsPage({ filters, onFiltersChange, onOpenJob }) {
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // ignore = true when filters change before the old request finishes (race condition)
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
            <JobCard key={job.id} job={job} onOpen={onOpenJob} />
          ))}
        </div>
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={(p) => onFiltersChange((prev) => ({ ...prev, page: p }))}
        />
      </>
    )
  }

  return (
    <section>
      <div className="hero">
        <h1>Find an IT job that AI won't replace</h1>
        <p className="muted">
          Every vacancy shows how much of the role can be automated by AI and which AI tools the team uses.
        </p>
      </div>
      <Filters filters={filters} onChange={onFiltersChange} />
      {content}
    </section>
  )
}
