# AI Era Jobs — Auth & Caching

My React Router homework (job board), extended with Firebase Authentication and TanStack Query caching.

- Live app: https://nvrrmindd.github.io/react/auth/dist/
- Repository: https://github.com/nvrrmindd/react (folder `auth/`)

## What was added

- Login, signup (with password confirmation) and Google sign-in with Firebase
- `/profile` page with the user's email and UID. Only logged-in users can open it, others go to `/login`
- NavBar shows Login / Signup or Profile / Logout
- The session stays after a page refresh
- Caching of the jobs data with TanStack Query

All pages, filters and pagination from the previous homework still work.

## How to run

```bash
cd auth
npm install
cp .env.example .env.local   # put your Firebase config here
npm run dev
```

`.env.example` shows which variables are needed. The real values are in `.env.local`, which is in `.gitignore` and is not pushed.

## Caching strategy

The jobs data is cached with TanStack Query (`src/hooks/useJobs.js`).

Every query has its own key:

- `['jobs', 'list', filters]` — one page of the list. The filters and the page number are in the key, so every filter and page is cached separately.
- `['jobs', 'all']` — all jobs, used by the dashboard.
- `['jobs', 'detail', id]` — one job.

Settings (`src/main.jsx`):

- `staleTime` is 1 minute. During this time the data is taken from the cache, without a new request.
- `gcTime` is 5 minutes. Data that no page uses is deleted from the cache after 5 minutes.

After 1 minute the old data is still shown at once, and new data is loaded in the background.

If the user changes a filter before the old request finishes, the old request is cancelled (AbortSignal), so it cannot replace the new result.

## When the cache is invalidated

The cache of all jobs (`['jobs']`) is invalidated:

- after a new job is posted;
- after the user applies to a job.

So the list, the dashboard and the job page show the new data.
