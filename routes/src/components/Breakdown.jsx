import { Link } from 'react-router'

export default function Breakdown({ title, rows, total, linkFor }) {
  return (
    <div className="breakdown">
      <h3>{title}</h3>
      {rows.map(([name, count]) => (
        <div key={name} className="bar-row">
          <span className="bar-label">{linkFor ? <Link to={linkFor(name)}>{name}</Link> : name}</span>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${(count / total) * 100}%` }} />
          </div>
          <span className="bar-count">{count}</span>
        </div>
      ))}
    </div>
  )
}
