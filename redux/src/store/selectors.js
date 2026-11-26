import { createSelector } from '@reduxjs/toolkit'

export const selectJobsList = (state) => state.jobs.list
export const selectAllJobs = (state) => state.jobs.all
export const selectJobDetails = (state) => state.jobDetails
export const selectFeedback = (state) => state.feedback

function countValues(values) {
  const counts = {}
  for (const value of values) counts[value] = (counts[value] || 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

export const selectDashboardStats = createSelector(
  [(state) => state.jobs.all.items, (_, level) => level],
  (jobs, level) => {
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
  },
)

export const selectFeedbackSummary = createSelector([(state) => state.feedback.items], (items) => ({
  count: items.length,
  average: items.length ? (items.reduce((sum, r) => sum + r.rating, 0) / items.length).toFixed(1) : null,
}))
