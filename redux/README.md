# AI Era Jobs — Redux Toolkit

The PWA job board refactored to Redux Toolkit. All previous features still work: Firebase auth, protected routes, jobs list with search (debounce), filters, sorting and pagination in the URL, job details, apply, new job form, feedback, dashboard, PWA and offline mode.

- Live app: https://nvrrmindd.github.io/react/redux/dist/
- Repository: https://github.com/nvrrmindd/react (folder `redux/`)

## Run

```bash
cd redux
npm install
cp .env.example .env.local   # Firebase config
npm run dev
```

## Structure

- `src/store/` — Redux: store, slices, selectors
- `src/services/` — API functions (`service.js`), Firebase, logs
- `src/hooks/` — custom hooks that connect components to Redux (`useJobs.js`, `useFeedback.js`)
- `src/pages/`, `src/components/` — UI

Authentication stays in `AuthContext` (Firebase keeps the session itself). Form inputs, "saving…" flags and the dashboard level switch are local `useState`, because only one component needs them.

## Store

`src/store/store.js` — `configureStore` with 3 reducers. `main.jsx` wraps the app in `<Provider store={store}>`.

## Slices

| Slice | State | Used on |
|---|---|---|
| `jobs` | `list` (current page of jobs + total), `all` (all jobs for dashboard) | Jobs, Dashboard |
| `jobDetails` | one job + `applied` flag | Job details |
| `feedback` | list of reviews | Feedback |

Every request part has `status` (`idle / loading / succeeded / failed`) and `error`.

## Thunks (`createAsyncThunk`)

| Thunk | Type |
|---|---|
| `fetchJobs(filters)` | list fetching |
| `fetchAllJobs()` | list fetching (dashboard) |
| `fetchJob(id)` | details fetching |
| `createJob(data)` | mutation |
| `applyToJob(id)` | mutation / business operation |
| `fetchFeedback()`, `createFeedback(data)` | list + mutation |

`pending`, `fulfilled` and `rejected` are handled in `extraReducers`.

- **Loading / errors / empty** — pages show a message based on `status`; empty list shows "No vacancies…".
- **Retry** — the error message has a Retry button that dispatches the thunk again.
- **Stale requests** — hooks call `request.abort()` when filters change or the page closes. Reducers save `requestId` in `pending` and ignore any answer with another `requestId`, so an old slow answer can't replace a new one.
- **No unnecessary requests** — `condition` in a thunk skips the request if the same data is already loaded (same filters, same job id, dashboard already loaded).
- **Refresh after mutations** — `createJob.fulfilled` marks the list and dashboard as outdated, so they load again; `applyToJob.fulfilled` sets `applied = true`; `createFeedback.fulfilled` adds the new review to the list.

## Selectors (`src/store/selectors.js`)

- `selectJobsList`, `selectAllJobs`, `selectJobDetails`, `selectFeedback` — simple selectors.
- `selectDashboardStats(state, level)` — memoized with `createSelector`; dashboard numbers are recalculated only when jobs or level change.
- `selectFeedbackSummary` — memoized with `createSelector`; number of reviews and average rating.

Components read state with `useSelector` and start actions with `useDispatch`.

## PWA

Same as the PWA homework: `public/manifest.webmanifest`, `public/sw.js` (cache names start with `redux-`), offline page `/offline`. Change `VERSION` in `sw.js` on every deploy.
