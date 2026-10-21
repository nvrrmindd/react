// Generates 120 initial job records (deterministic, so the list is the same for everyone)

const titles = [
  'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'ML Engineer',
  'Prompt Engineer', 'Data Analyst', 'DevOps Engineer', 'QA Engineer',
  'AI Product Manager', 'Mobile Developer', 'Data Scientist', 'Security Engineer',
  'LLM Ops Engineer', 'UX Designer', 'AI Trainer',
]
const companies = [
  'Kaspi', 'Kolesa Group', 'OpenMind Labs', 'NeuroSoft', 'ByteForge', 'DataWave',
  'CloudNine', 'Halyk Tech', 'PixelPeak', 'AgentWorks', 'Chocofamily', 'SkyNet Solutions',
]
const cities = ['Almaty', 'Astana', 'Shymkent', 'Remote', 'Berlin', 'Dubai']
const levels = ['Junior', 'Middle', 'Senior']
const aiRisks = ['Low', 'Medium', 'High']
const aiTools = ['ChatGPT', 'Claude', 'GitHub Copilot', 'Cursor', 'Midjourney', 'Gemini']
const skillsByTitle = {
  'Frontend Developer': ['React', 'TypeScript', 'CSS'],
  'Backend Developer': ['Node.js', 'PostgreSQL', 'Docker'],
  'Full-Stack Developer': ['React', 'Node.js', 'SQL'],
  'ML Engineer': ['Python', 'PyTorch', 'MLOps'],
  'Prompt Engineer': ['Prompting', 'Python', 'Evaluation'],
  'Data Analyst': ['SQL', 'Excel', 'Power BI'],
  'DevOps Engineer': ['Kubernetes', 'CI/CD', 'AWS'],
  'QA Engineer': ['Playwright', 'Testing', 'JavaScript'],
  'AI Product Manager': ['Roadmaps', 'Analytics', 'LLM basics'],
  'Mobile Developer': ['React Native', 'Kotlin', 'Swift'],
  'Data Scientist': ['Python', 'Statistics', 'Pandas'],
  'Security Engineer': ['Pentesting', 'Networks', 'Linux'],
  'LLM Ops Engineer': ['RAG', 'Vector DB', 'Python'],
  'UX Designer': ['Figma', 'Research', 'Prototyping'],
  'AI Trainer': ['Writing', 'Annotation', 'Critical thinking'],
}

// tiny seeded random so data does not change between reloads
let seed = 42
function rand() {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const pick = (arr) => arr[Math.floor(rand() * arr.length)]

export function generateJobs(count = 120) {
  seed = 42
  const jobs = []
  const start = new Date('2026-10-01').getTime()
  for (let i = 1; i <= count; i++) {
    const title = pick(titles)
    const level = pick(levels)
    const base = level === 'Junior' ? 400 : level === 'Middle' ? 1200 : 2500
    const tools = [...new Set([pick(aiTools), pick(aiTools)])]
    jobs.push({
      id: i,
      title,
      company: pick(companies),
      city: pick(cities),
      level,
      salary: base + Math.round(rand() * 20) * 50,
      aiRisk: pick(aiRisks),
      aiTools: tools,
      skills: skillsByTitle[title],
      postedAt: new Date(start - Math.floor(rand() * 60) * 86400000).toISOString().slice(0, 10),
      description: `We are looking for a ${level} ${title} who is comfortable working side by side with AI tools like ${tools.join(' and ')}. You will use AI to speed up routine work and focus on decisions that still need a human.`,
    })
  }
  return jobs
}
