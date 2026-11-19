import { useLocation } from 'react-router'
import { useJobs } from '../hooks/useJobs'
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

  const { data, isPending, isError, error, refetch } = useJobs({ ...filters, pageSize: PAGE_SIZE })
  const jobs = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  let content
  if (isPending) {
    content = <StatusMessage type="loading" text="Loading vacancies…" />
  } else if (isError) {
    content = <StatusMessage type="error" text={error.message} onRetry={() => refetch()} />
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
