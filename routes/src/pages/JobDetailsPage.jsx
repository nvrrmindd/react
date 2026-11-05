import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { applyToJob, getJob } from '../services/service'
import Badge from '../components/Badge'
import StatusMessage from '../components/StatusMessage'
import CurrencyWidget from '../components/CurrencyWidget'

const tips = {
  Low: 'This role relies on human judgement. AI is a helper here, not a replacement.',
  Medium: 'Part of this work is automated. Learn the AI tools the team uses to stay ahead.',
  High: 'Much of this work can be done by AI. Focus on skills AI is weak at: communication, architecture, ownership.',
}

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const jobId = Number(id)
  const isValidId = Number.isInteger(jobId) && jobId > 0

  const [job, setJob] = useState(null)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState(null)

  useEffect(() => {
    if (!isValidId) return
    let ignore = false
    setJob(null)
    setError(null)
    setApplyError(null)

    getJob(jobId)
      .then((data) => {
        if (!ignore) setJob(data)
      })
      .catch((err) => {
        if (!ignore) setError(err)
      })

    return () => {
      ignore = true
    }
  }, [jobId, isValidId, reloadKey])

  async function handleApply() {
    setApplying(true)
    setApplyError(null)
    try {
      const appliedId = job.id
      await applyToJob(appliedId)
      setJob((prev) => (prev?.id === appliedId ? { ...prev, applied: true } : prev))
    } catch (err) {
      setApplyError(err.message)
    } finally {
      setApplying(false)
    }
  }

  function goBack() {
    if (location.key === 'default') navigate('/jobs')
    else navigate(-1)
  }

  let content
  if (!isValidId) {
    content = <StatusMessage type="error" text={`"${id}" is not a valid job ID.`} />
  } else if (error?.status === 404) {
    content = <StatusMessage type="empty" text={error.message} />
  } else if (error) {
    content = <StatusMessage type="error" text={error.message} onRetry={() => setReloadKey((k) => k + 1)} />
  } else if (!job) {
    content = <StatusMessage type="loading" text="Loading job…" />
  } else {
    content = (
      <div className="detail">
        <div className="card-top">
          <h1>{job.title}</h1>
          <Badge type={`risk-${job.aiRisk}`}>AI risk: {job.aiRisk}</Badge>
        </div>
        <p className="salary big">${job.salary.toLocaleString()} / month</p>

        <dl className="facts">
          <dt>Job ID</dt>
          <dd>#{job.id}</dd>
          <dt>Company</dt>
          <dd>{job.company}</dd>
          <dt>City</dt>
          <dd>{job.city}</dd>
          <dt>Level</dt>
          <dd>{job.level}</dd>
          <dt>AI risk</dt>
          <dd>{job.aiRisk}</dd>
          <dt>Posted</dt>
          <dd>{job.postedAt}</dd>
        </dl>

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

        <button className="btn" disabled={job.applied || applying} onClick={handleApply}>
          {job.applied ? '✓ Application sent' : applying ? 'Sending…' : 'Apply now'}
        </button>
        {applyError && <p className="error-text">{applyError}</p>}

        <CurrencyWidget amount={job.salary} />
      </div>
    )
  }

  return (
    <section>
      <div className="detail-nav">
        <button className="btn ghost" onClick={goBack}>
          ← Back
        </button>
        <Link to="/jobs" className="btn ghost">
          All jobs
        </Link>
        {isValidId && (
          <span className="detail-nav-right">
            {jobId > 1 && (
              <Link to={`/jobs/${jobId - 1}`} className="btn ghost">
                ‹ Prev
              </Link>
            )}
            <Link to={`/jobs/${jobId + 1}`} className="btn ghost">
              Next ›
            </Link>
          </span>
        )}
      </div>
      {content}
    </section>
  )
}
