import { generateJobs } from './data'

const JOBS_KEY = 'ai-era-jobs'
const FEEDBACK_KEY = 'ai-era-feedback'
const APPLIED_KEY = 'ai-era-applied'
const riskOrder = { Low: 1, Medium: 2, High: 3 }

function loadJobs() {
  const saved = localStorage.getItem(JOBS_KEY)
  if (saved) return JSON.parse(saved)
  const jobs = generateJobs(120)
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
  return jobs
}

// Waits like a real network request. If the request was cancelled
// while waiting (signal is aborted), it throws and no data is returned.
async function delay(ms, signal) {
  await new Promise((resolve) => setTimeout(resolve, ms))
  signal?.throwIfAborted()
}

function maybeFail() {
  if (Math.random() < 0.05) throw new Error('Network error. Please try again.')
}

export async function getJobs({ search, level, aiRisk, remoteOnly, sort, page, pageSize }, signal) {
  await delay(400 + Math.random() * 600, signal)
  maybeFail()

  let jobs = loadJobs()
  const q = search.trim().toLowerCase()
  if (q) {
    jobs = jobs.filter((j) =>
      [j.title, j.company, ...j.skills].some((s) => s.toLowerCase().includes(q))
    )
  }
  if (level !== 'All') jobs = jobs.filter((j) => j.level === level)
  if (aiRisk !== 'All') jobs = jobs.filter((j) => j.aiRisk === aiRisk)
  if (remoteOnly) jobs = jobs.filter((j) => j.city === 'Remote')

  jobs = [...jobs].sort((a, b) => {
    if (sort === 'salary-desc') return b.salary - a.salary
    if (sort === 'salary-asc') return a.salary - b.salary
    if (sort === 'risk-asc') return riskOrder[a.aiRisk] - riskOrder[b.aiRisk]
    return b.postedAt.localeCompare(a.postedAt) || b.id - a.id
  })

  const total = jobs.length
  const items = jobs.slice((page - 1) * pageSize, page * pageSize)
  return { items, total }
}

export async function getAllJobs(signal) {
  await delay(400 + Math.random() * 400, signal)
  maybeFail()
  return loadJobs()
}

export async function getJob(id, signal) {
  await delay(300 + Math.random() * 700, signal)
  maybeFail()
  const job = loadJobs().find((j) => j.id === id)
  if (!job) {
    const error = new Error(`Job #${id} not found`)
    error.status = 404
    throw error
  }
  const appliedIds = JSON.parse(localStorage.getItem(APPLIED_KEY) || '[]')
  return { ...job, applied: appliedIds.includes(id) }
}

export async function applyToJob(id) {
  await delay(400)
  maybeFail()
  const appliedIds = JSON.parse(localStorage.getItem(APPLIED_KEY) || '[]')
  if (!appliedIds.includes(id)) {
    localStorage.setItem(APPLIED_KEY, JSON.stringify([...appliedIds, id]))
  }
}

export async function createJob(data) {
  await delay(500)
  maybeFail()
  const jobs = loadJobs()
  const job = {
    ...data,
    id: Math.max(...jobs.map((j) => j.id)) + 1,
    postedAt: new Date().toISOString().slice(0, 10),
  }
  localStorage.setItem(JOBS_KEY, JSON.stringify([job, ...jobs]))
  return job
}

export async function getFeedback(signal) {
  await delay(300, signal)
  return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]')
}

export async function createFeedback(data) {
  await delay(500)
  maybeFail()
  const list = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]')
  const item = { ...data, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10) }
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify([item, ...list]))
  return item
}

export async function getExchangeRates(signal) {
  const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal })
  if (!res.ok) throw new Error(`Rates API error: ${res.status}`)
  const data = await res.json()
  return { rates: data.rates, updatedAt: data.time_last_update_utc }
}
