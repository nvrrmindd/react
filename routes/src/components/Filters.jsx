import { useEffect, useState } from 'react'

export default function Filters({ filters, onChange, onReset }) {
  const [text, setText] = useState(filters.search)

  useEffect(() => {
    setText(filters.search)
  }, [filters.search])

  useEffect(() => {
    if (text === filters.search) return
    const timer = setTimeout(() => onChange({ search: text }), 400)
    return () => clearTimeout(timer)
  }, [text, filters.search, onChange])

  return (
    <div className="filters">
      <input
        className="input search"
        type="search"
        placeholder="Search by title, company or skill…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select className="input" value={filters.level} onChange={(e) => onChange({ level: e.target.value })}>
        <option value="All">All levels</option>
        <option value="Junior">Junior</option>
        <option value="Middle">Middle</option>
        <option value="Senior">Senior</option>
      </select>
      <select className="input" value={filters.aiRisk} onChange={(e) => onChange({ aiRisk: e.target.value })}>
        <option value="All">Any AI risk</option>
        <option value="Low">Low AI risk</option>
        <option value="Medium">Medium AI risk</option>
        <option value="High">High AI risk</option>
      </select>
      <select className="input" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
        <option value="newest">Newest first</option>
        <option value="salary-desc">Salary: high → low</option>
        <option value="salary-asc">Salary: low → high</option>
        <option value="risk-asc">Safest from AI first</option>
      </select>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={filters.remoteOnly}
          onChange={(e) => onChange({ remoteOnly: e.target.checked })}
        />
        Remote only
      </label>
      <button className="btn ghost" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
