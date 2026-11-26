import { Link } from 'react-router'

export default function AboutPage() {
  return (
    <section className="page-narrow">
      <h1>About the project</h1>
      <p>
        <b>AI Era Jobs</b> is a job board for IT vacancies in the age of AI. Each vacancy has an <b>AI risk</b> level
        (Low / Medium / High) and a list of AI tools the team uses, so a job seeker can choose roles that AI won't
        replace.
      </p>

      <h3>What you can do</h3>
      <ul>
        <li>Search, filter, sort and page through 120+ vacancies — the filters are saved in the URL</li>
        <li>Open a vacancy by its URL and see all its details</li>
        <li>Post a new vacancy</li>
        <li>See statistics on the dashboard</li>
        <li>Leave feedback about the site</li>
      </ul>

      <h3>How it is built</h3>
      <ul>
        <li>React 19 + Vite</li>
        <li>React Router: nested routes, dynamic URL <code>/jobs/:id</code>, <code>useSearchParams</code></li>
        <li>Lazy loading of pages with <code>React.lazy</code> and <code>Suspense</code></li>
        <li>
          Fake API in <code>services/service.js</code>: Promises, random delays, <code>localStorage</code> as a
          database and a 5% chance of a network error
        </li>
        <li>Real public API for currency rates: open.er-api.com</li>
      </ul>

      <Link to="/jobs" className="btn">
        Go to jobs
      </Link>
    </section>
  )
}
