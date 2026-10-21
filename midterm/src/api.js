import { generateJobs } from './data'

const KEY = 'ai-era-jobs'
const riskOrder = { Low: 1, Medium: 2, High: 3 }

function load() {
  const saved = localStorage.getItem(KEY)
  if (saved) return JSON.parse(saved)
  const jobs = generateJobs(120)
  localStorage.setItem(KEY, JSON.stringify(jobs))
  return jobs
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 5% chance of a fake network error, so the error state can be seen
function maybeFail() {
  if (Math.random() < 0.05) throw new Error('Network error. Please try again.')
}

export async function getJobs({ search, level, aiRisk, remoteOnly, sort, page, pageSize }) {
  await delay(400 + Math.random() * 600)
  maybeFail()

  let jobs = load()
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
    return b.postedAt.localeCompare(a.postedAt) || b.id - a.id // newest
  })

  const total = jobs.length
  const items = jobs.slice((page - 1) * pageSize, page * pageSize)
  return { items, total }
}

export async function getJob(id) {
  await delay(300 + Math.random() * 400)
  maybeFail()
  const job = load().find((j) => j.id === id)
  if (!job) throw new Error('Job not found')
  return job
}

export async function createJob(data) {
  await delay(500)
  maybeFail()
  const jobs = load()
  const job = {
    ...data,
    id: Math.max(...jobs.map((j) => j.id)) + 1,
    postedAt: new Date().toISOString().slice(0, 10),
  }
  localStorage.setItem(KEY, JSON.stringify([job, ...jobs]))
  return job
}
