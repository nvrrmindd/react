# AI Era Jobs — React SPA (Midterm)

A job board for IT vacancies in the age of AI. Every vacancy shows an **AI risk** level (how much of the job could be automated) and the **AI tools** the team uses, so a job seeker can look for roles that AI won't replace.

**Live demo:** https://nvrrmindd.github.io/react/midterm/dist/

**Source code:** https://github.com/nvrrmindd/react/tree/main/midterm

## Features

- List of 120+ vacancies with cards
- Detail view for each vacancy, with advice based on its AI risk
- Search by title, company or skill (debounced)
- Filters: level, AI risk, remote only
- Sorting: newest, salary high→low, salary low→high, safest from AI first
- Pagination (9 per page)
- Controlled form for posting a new vacancy, with validation and a submit error message
- Loading, error (with retry), empty and success states (list of jobs + "Vacancy published" message)

## Tech

- React 19 + Vite
- No router and no UI libraries: views are switched with `useState`
- **Simulated API** (`src/api.js`): uses Promises, random delays, JSON in `localStorage` and a 5% chance of a fake network error (for list, detail and create). On first run it seeds 120 records from `src/data.js`.

## Project structure

```
src/
  api.js             simulated async API (getJobs, getJob, createJob)
  data.js            generates the 120 initial records
  constants.js       default filter values
  App.jsx            current view, selected job id, filters
  components/
    Header.jsx       navigation
    JobsPage.jsx     loads the list (useEffect + cleanup), shows states
    Filters.jsx      search / filter / sort controls, debounce
    JobCard.jsx      one vacancy in the list
    Pagination.jsx   prev / next pages
    JobDetail.jsx    loads one vacancy by id
    JobForm.jsx      controlled form for a new vacancy
    Badge.jsx        reusable label
    StatusMessage.jsx  reusable loading / error / empty block
```

## Key React points

- **State placement:** `App` keeps only shared state (view, selected id, filters, so filters are kept when you come back from the detail page). Fetched data lives in `JobsPage` / `JobDetail`, form fields in `JobForm`, the typed search text in `Filters`.
- **Effects and race conditions:** each fetch effect has an `ignore` flag that the cleanup sets to `true`, so a slow old response can't overwrite a newer one.
- **Debounce cleanup:** `Filters` uses `setTimeout` in an effect and `clearTimeout` in its cleanup.
- **Keys and identity:** lists use stable keys (`job.id`, skill names). `<JobDetail key={selectedId} />` resets the detail state (e.g. "Application sent") when another job is opened.
- **Immutable updates:** `setFilters(prev => ({ ...prev, page: 1 }))`, `setForm(prev => ({ ...prev, [name]: value }))`.
- No direct DOM manipulation.

## Run locally

```bash
npm install
npm run dev
```

## Requirements checklist

| Requirement | Where |
|---|---|
| One data source, 100+ records | simulated API `api.js`, 120 records from `data.js` |
| 5+ reusable components | `Header`, `JobCard`, `Badge`, `StatusMessage`, `Pagination`, `Filters`, `JobDetail`, `JobForm`, `JobsPage` |
| List and detail views | `JobsPage` + `JobCard` / `JobDetail` |
| Controlled form | `JobForm` (`value` + `onChange`, validation) |
| Search, filter, sort, pagination | `Filters` → `getJobs()` in `api.js`, `Pagination` |
| Loading / error / empty / success | `StatusMessage`, `JobsPage`, `JobDetail`, `JobForm`, notice in `App` |
| Effect deps + cleanup | `JobsPage`, `JobDetail` (`ignore` flag), `Filters` (`clearTimeout`) |
| Stable keys, identity | `key={job.id}`, `key={skill}`, `<JobDetail key={selectedId} />` |
| No direct DOM manipulation | only `createRoot` in `main.jsx` |

## Deploy (GitHub Pages)

GitHub Pages serves the `main` branch of this repo, and the built app is committed in `midterm/dist`.
`vite.config.js` has `base: './'`, so the assets load from any sub-folder.

```bash
npm run build      # rebuilds midterm/dist
git add dist && git commit -m "build" && git push
```

To reset the data, clear `localStorage` for the site (key `ai-era-jobs`).
