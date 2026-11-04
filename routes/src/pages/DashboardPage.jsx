import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { getAllJobs } from '../services/service'
import StatCard from '../components/StatCard'
import Breakdown from '../components/Breakdown'
import StatusMessage from '../components/StatusMessage'

const levels = ['All', 'Junior', 'Middle', 'Senior']

function countValues(values) {
  const counts = {}
  for (const value of values) counts[value] = (counts[value] || 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [level, setLevel] = useState('All')

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)

    getAllJobs()
      .then((data) => {
        if (!ignore) setJobs(data)
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
  }, [reloadKey])

  const stats = useMemo(() => {
    const list = level === 'All' ? jobs : jobs.filter((j) => j.level === level)
    if (list.length === 0) return null
    const topPaid = [...list].sort((a, b) => b.salary - a.salary).slice(0, 5)
    return {
      total: list.length,
      avgSalary: Math.round(list.reduce((sum, j) => sum + j.salary, 0) / list.length),
      topPaid,
      lowRiskPercent: Math.round((list.filter((j) => j.aiRisk === 'Low').length / list.length) * 100),
      remote: list.filter((j) => j.city === 'Remote').length,
      byRisk: countValues(list.map((j) => j.aiRisk)),
      byCity: countValues(list.map((j) => j.city)),
      byTool: countValues(list.flatMap((j) => j.aiTools)),
    }
  }, [jobs, level])

  const levelParam = level === 'All' ? '' : `&level=${level}`

  if (loading) return <StatusMessage type="loading" text="Loading statistics…" />
  if (error) return <StatusMessage type="error" text={error} onRetry={() => setReloadKey((k) => k + 1)} />
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
