# AI Era Jobs — Routing & Application Architecture

The midterm job board (AI Era Jobs) extended with **React Router**: nested routes, dynamic URLs, filters in the URL and lazy-loaded pages.

**Live demo:** https://nvrrmindd.github.io/react/routes/dist/

**Source code:** https://github.com/nvrrmindd/react/tree/main/routes

## Routes

| URL | Page | Lazy |
|---|---|---|
| `/` | Home — intro, image, links, currency widget | |
| `/about` | About the project | ✓ |
| `/jobs` | Jobs list — search, filters, sort, pagination (all in URL) | |
| `/jobs/:id` | Job details | ✓ |
| `/jobs/new` | Post a job (form from the midterm) | ✓ |
| `/dashboard` | Statistics | ✓ |
| `/feedback` | Feedback form → localStorage (bonus) | ✓ |
| `/login` | Login placeholder | ✓ |
| `*` | 404 Not Found | ✓ |

## Project structure

```
src/
  main.jsx               BrowserRouter (basename = Vite base)
  App.jsx                only routes + React.lazy imports
  constants.js           default filter values
  layouts/
    RootLayout.jsx       NavBar + <Suspense> + <Outlet />
  pages/                 one file per route
  components/            NavBar, JobCard, Badge, Filters, Pagination, StatusMessage,
                         JobForm, StatCard, Breakdown, CurrencyWidget
  hooks/
    useJobFilters.js     filters <-> URL (useSearchParams)
    useExchangeRates.js  loads currency rates
  services/
    service.js           all API requests (fake API + real currency API)
    data.js              generates 120 jobs for the fake API
  styles/styles.css
  assets/hero.svg
```

## How it works

- **Routing.** `App.jsx` has one parent route `/` with `RootLayout`; all pages are its children and are rendered in `<Outlet />`. `/jobs` has nested children: index (list), `new` and `:id`.
- **Navigation without reloads.** Only `<Link>`, `<NavLink>` and `useNavigate()` are used, no `<a href>` and no `window.location`.
- **Filters in the URL.** `useJobFilters` reads `search`, `level`, `aiRisk`, `remoteOnly`, `sort`, `page` from `useSearchParams` and writes them back with `setSearchParams`. Default values are not written, so the URL stays short. Because the URL is the state, refresh, sharing a link and Back/Forward all keep the filters.
- **Job details.** `useParams()` gives `id`. Not a positive integer → "not a valid job ID". API throws an error with `status: 404` → "not found". Other errors → "Try again". Stale requests are ignored with an `ignore` flag set in the effect cleanup (try clicking Next › quickly).
- **Back.** `navigate(-1)`, but if the page was opened directly (`location.key === 'default'`) it goes to `/jobs`.
- **Lazy loading.** 7 pages are loaded with `React.lazy`; the fallback is in `<Suspense>` in `RootLayout`. After `npm run build` each lazy page is a separate `.js` file in `dist/assets`.
- **Fake API** (`services/service.js`): Promises, random delay, `localStorage` as the database, 5% random network error. "Endpoints": `getJobs`, `getAllJobs`, `getJob`, `createJob`, `getFeedback`, `createFeedback`.
- **Real API** (bonus): `getExchangeRates()` calls https://open.er-api.com/v6/latest/USD (free, no key). Shown on Home and on job details (salary in KZT/EUR/RUB/CNY).
- **Dashboard.** Loads all jobs once, then `useMemo` calculates stats for the selected level: 5 stat cards, breakdowns by AI risk, city and AI tools, top 5 by salary. Links lead to filtered lists and job pages.

## Run locally

```bash
npm install
npm run dev     # open the URL Vite prints (…/react/routes/dist/)
```

## Deploy (GitHub Pages)

GitHub Pages serves the `main` branch; the built app is committed in `routes/dist`.

```bash
npm run build   # vite build + copy dist/index.html to ../404.html
git add . ../404.html && git commit -m "build" && git push
```

GitHub Pages knows nothing about client routes, so a direct link like `/react/routes/dist/jobs/5` would be a 404.
For any missing file GitHub Pages returns `404.html` from the repo root — it is a copy of our `index.html`, so the React app loads and React Router shows the right page.
`vite.config.js` uses `base: '/react/routes/dist/'` (absolute paths, so assets load from any URL depth) and the same value is passed to `BrowserRouter` as `basename`.

## Requirements checklist

| Requirement | Where |
|---|---|
| react-router, RootLayout, NavBar, Outlet | `main.jsx`, `layouts/RootLayout.jsx`, `components/NavBar.jsx` |
| Nested routes, App.jsx only routing | `App.jsx` |
| pages / components / services / hooks / styles | `src/` folders |
| API in `services/service.js` | `services/service.js` |
| Home: intro, image, links | `pages/HomePage.jsx` |
| About, Login | `pages/AboutPage.jsx`, `pages/LoginPage.jsx` |
| Reusable cards | `components/JobCard.jsx` |
| Search, 2+ filters, sorting, pagination | `components/Filters.jsx`, `components/Pagination.jsx` |
| useSearchParams | `hooks/useJobFilters.js` |
| Loading / error / empty | `components/StatusMessage.jsx` in every page |
| useParams, 7+ details, Back + All jobs | `pages/JobDetailsPage.jsx` |
| Invalid / missing ID, stale requests | `pages/JobDetailsPage.jsx` |
| 4+ stats, 2+ breakdowns, filter, links | `pages/DashboardPage.jsx` |
| 3+ lazy pages + Suspense | `App.jsx`, `layouts/RootLayout.jsx` |
| 404 page with Home link | `pages/NotFoundPage.jsx` |
| Bonus: extra page, feedback in localStorage, public API widget | `pages/FeedbackPage.jsx`, `components/CurrencyWidget.jsx` |
