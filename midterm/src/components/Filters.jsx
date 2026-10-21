import { useEffect, useState } from 'react'
import { initialFilters } from '../constants'

export default function Filters({ filters, onChange }) {
  const [text, setText] = useState(filters.search)

  useEffect(() => {
    if (text === filters.search) return
    const timer = setTimeout(() => {
      onChange((prev) => ({ ...prev, search: text, page: 1 }))
    }, 400)
    return () => clearTimeout(timer)
  }, [text, filters.search, onChange])

  function update(field, value) {
    onChange((prev) => ({ ...prev, [field]: value, page: 1 }))
  }

  function reset() {
    setText('')
    onChange(initialFilters)
  }

  return (
    <div className="filters">
      <input
        className="input search"
        type="search"
        placeholder="Search by title, company or skill…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select className="input" value={filters.level} onChange={(e) => update('level', e.target.value)}>
        <option value="All">All levels</option>
        <option value="Junior">Junior</option>
        <option value="Middle">Middle</option>
        <option value="Senior">Senior</option>
      </select>
      <select className="input" value={filters.aiRisk} onChange={(e) => update('aiRisk', e.target.value)}>
        <option value="All">Any AI risk</option>
        <option value="Low">Low AI risk</option>
        <option value="Medium">Medium AI risk</option>
        <option value="High">High AI risk</option>
      </select>
      <select className="input" value={filters.sort} onChange={(e) => update('sort', e.target.value)}>
        <option value="newest">Newest first</option>
        <option value="salary-desc">Salary: high → low</option>
        <option value="salary-asc">Salary: low → high</option>
        <option value="risk-asc">Safest from AI first</option>
      </select>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={filters.remoteOnly}
          onChange={(e) => update('remoteOnly', e.target.checked)}
        />
        Remote only
      </label>
      <button className="btn ghost" onClick={reset}>
        Reset
      </button>
    </div>
  )
}
