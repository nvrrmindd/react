import { useState } from 'react'
import { createJob } from '../api'

const emptyForm = {
  title: '',
  company: '',
  city: 'Remote',
  level: 'Junior',
  salary: '',
  aiRisk: 'Medium',
  skills: '',
  aiTools: '',
  description: '',
}

// "React, React" -> ['React'] (values are used as keys, so they must be unique)
const toList = (text) => [
  ...new Set(
    text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  ),
]

export default function JobForm({ onCreated, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const errs = {}
    if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters'
    if (!form.company.trim()) errs.company = 'Company is required'
    if (!form.salary || Number(form.salary) <= 0) errs.salary = 'Salary must be a positive number'
    if (toList(form.skills).length === 0) errs.skills = 'Add at least one skill'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    setSubmitError(null)
    try {
      const job = await createJob({
        title: form.title.trim(),
        company: form.company.trim(),
        city: form.city,
        level: form.level,
        salary: Number(form.salary),
        aiRisk: form.aiRisk,
        skills: toList(form.skills),
        aiTools: toList(form.aiTools),
        description: form.description.trim() || 'No description provided.',
      })
      onCreated(job)
    } catch (err) {
      // form fields stay filled, so the user can just press the button again
      setSubmitError(err.message)
      setSaving(false)
    }
  }

  return (
    <section>
      <h1>Post a new vacancy</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Job title *
          <input className="input" name="title" value={form.title} onChange={handleChange} />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </label>
        <label>
          Company *
          <input className="input" name="company" value={form.company} onChange={handleChange} />
          {errors.company && <span className="error-text">{errors.company}</span>}
        </label>
        <div className="row">
          <label>
            City
            <select className="input" name="city" value={form.city} onChange={handleChange}>
              {['Remote', 'Almaty', 'Astana', 'Shymkent', 'Berlin', 'Dubai'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Level
            <select className="input" name="level" value={form.level} onChange={handleChange}>
              <option>Junior</option>
              <option>Middle</option>
              <option>Senior</option>
            </select>
          </label>
          <label>
            AI risk
            <select className="input" name="aiRisk" value={form.aiRisk} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
        </div>
        <label>
          Salary, $ / month *
          <input className="input" type="number" name="salary" value={form.salary} onChange={handleChange} />
          {errors.salary && <span className="error-text">{errors.salary}</span>}
        </label>
        <label>
          Skills * (comma separated)
          <input
            className="input"
            name="skills"
            placeholder="React, TypeScript"
            value={form.skills}
            onChange={handleChange}
          />
          {errors.skills && <span className="error-text">{errors.skills}</span>}
        </label>
        <label>
          AI tools (comma separated)
          <input
            className="input"
            name="aiTools"
            placeholder="Claude, Cursor"
            value={form.aiTools}
            onChange={handleChange}
          />
        </label>
        <label>
          Description
          <textarea className="input" rows="4" name="description" value={form.description} onChange={handleChange} />
        </label>
        {submitError && <p className="error-text">{submitError}</p>}
        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Saving…' : 'Publish vacancy'}
          </button>
        </div>
      </form>
    </section>
  )
}
