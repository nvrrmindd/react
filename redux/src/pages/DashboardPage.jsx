import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { useAllJobs } from '../hooks/useJobs'
import { selectDashboardStats } from '../store/selectors'
import StatCard from '../components/StatCard'
import Breakdown from '../components/Breakdown'
import StatusMessage from '../components/StatusMessage'

const levels = ['All', 'Junior', 'Middle', 'Senior']

export default function DashboardPage() {
  const { status, error, refetch } = useAllJobs()
  const [level, setLevel] = useState('All')
  const stats = useSelector((state) => selectDashboardStats(state, level))

  const levelParam = level === 'All' ? '' : `&level=${level}`

  if (status === 'idle' || status === 'loading') return <StatusMessage type="loading" text="Loading statistics…" />
  if (status === 'failed') return <StatusMessage type="error" text={error} onRetry={() => refetch()} />
  if (!stats) return <StatusMessage type="empty" text="No vacancies yet." />

  return (
    <section>
      <h1>Dashboard</h1>
      <p className="muted">Statistics are calculated from all vacancies returned by the API.</p>

      <div className="segmented">
        {levels.map((l) => (
          <button key={l} className={l === level ? 'active' : ''} onClick={() => setLevel(l)}>
            {l === 'All' ? 'All levels' : l}
          </button>
        ))}
      </div>

      <div className="stats">
        <StatCard label="Vacancies" value={stats.total}>
          <Link to={level === 'All' ? '/jobs' : `/jobs?level=${level}`}>View list →</Link>
        </StatCard>
        <StatCard label="Average salary" value={`$${stats.avgSalary.toLocaleString()}`} />
        <StatCard label="Highest salary" value={`$${stats.topPaid[0].salary.toLocaleString()}`}>
          <Link to={`/jobs/${stats.topPaid[0].id}`}>{stats.topPaid[0].title} →</Link>
        </StatCard>
        <StatCard label="Low AI risk" value={`${stats.lowRiskPercent}%`}>
          <Link to={`/jobs?aiRisk=Low${levelParam}`}>Safest jobs →</Link>
        </StatCard>
        <StatCard label="Remote jobs" value={stats.remote}>
          <Link to={`/jobs?remoteOnly=true${levelParam}`}>Remote jobs →</Link>
        </StatCard>
      </div>

      <div className="breakdowns">
        <Breakdown
          title="By AI risk"
          rows={stats.byRisk}
          total={stats.total}
          linkFor={(risk) => `/jobs?aiRisk=${risk}${levelParam}`}
        />
        <Breakdown title="By city" rows={stats.byCity} total={stats.total} />
        <Breakdown title="AI tools used" rows={stats.byTool} total={stats.total} />

        <div className="breakdown">
          <h3>Top 5 by salary</h3>
          <ol className="top-list">
            {stats.topPaid.map((job) => (
              <li key={job.id}>
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                <span className="muted small">
                  {' '}
                  · {job.company} · ${job.salary.toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
