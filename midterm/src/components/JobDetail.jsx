import { useEffect, useState } from 'react'
import { getJob } from '../api'
import Badge from './Badge'
import StatusMessage from './StatusMessage'

const tips = {
  Low: 'This role relies on human judgement. AI is a helper here, not a replacement.',
  Medium: 'Part of this work is automated. Learn the AI tools the team uses to stay ahead.',
  High: 'Much of this work can be done by AI. Focus on skills AI is weak at: communication, architecture, ownership.',
}

export default function JobDetail({ jobId, onBack }) {
  const [job, setJob] = useState(null)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    let ignore = false
    setJob(null)
    setError(null)
    getJob(jobId)
      .then((data) => {
        if (!ignore) setJob(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [jobId, reloadKey])

  return (
    <section>
      <button className="btn ghost" onClick={onBack}>
        ← Back to list
      </button>

      {error && <StatusMessage type="error" text={error} onRetry={() => setReloadKey((k) => k + 1)} />}
      {!error && !job && <StatusMessage type="loading" text="Loading job…" />}

      {job && (
        <div className="detail">
          <div className="card-top">
            <h1>{job.title}</h1>
            <Badge type={`risk-${job.aiRisk}`}>AI risk: {job.aiRisk}</Badge>
          </div>
          <p className="muted">
            {job.company} · {job.city} · {job.level} · posted {job.postedAt}
          </p>
          <p className="salary big">${job.salary.toLocaleString()} / month</p>

          <h3>About the role</h3>
          <p>{job.description}</p>

          <h3>Skills</h3>
          <div className="tags">
            {job.skills.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>

          <h3>AI tools used by the team</h3>
          <div className="tags">
            {job.aiTools.map((t) => (
              <Badge key={t} type="tool">
                {t}
              </Badge>
            ))}
          </div>

          <div className={`tip risk-${job.aiRisk}`}>{tips[job.aiRisk]}</div>

          <button className="btn" disabled={applied} onClick={() => setApplied(true)}>
            {applied ? '✓ Application sent' : 'Apply now'}
          </button>
        </div>
      )}
    </section>
  )
}
