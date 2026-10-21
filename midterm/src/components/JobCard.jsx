import Badge from './Badge'

export default function JobCard({ job, onOpen }) {
  return (
    <article className="card" onClick={() => onOpen(job.id)}>
      <div className="card-top">
        <h3>{job.title}</h3>
        <Badge type={`risk-${job.aiRisk}`}>AI risk: {job.aiRisk}</Badge>
      </div>
      <p className="muted">
        {job.company} · {job.city} · {job.level}
      </p>
      <p className="salary">${job.salary.toLocaleString()} / month</p>
      <div className="tags">
        {job.skills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
      <p className="muted small">Posted {job.postedAt}</p>
    </article>
  )
}
