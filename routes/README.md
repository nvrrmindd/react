# AI Era Jobs

A job board for IT vacancies in the age of AI. Every vacancy shows its **AI risk** level and the AI tools the team uses.

This project is the React Router homework, extended with **server data caching** (TanStack Query) and **Firebase Authentication**.

- GitHub repository: https://github.com/nvrrmindd/react (folder `routes/`)
- Live application: https://nvrrmindd.github.io/react/routes/dist/

## Technologies

- React 19 + Vite
- React Router 8
- TanStack Query 5 (server data and caching)
- Firebase Authentication (Email/Password and Google)

## Previous homework (still works)

| URL | Page |
|---|---|
| `/` | Home: intro, links, currency widget |
| `/about` | About the project |
| `/jobs` | Jobs list: search, filters, sort, pagination (all stored in the URL) |
| `/jobs/:id` | Job details, "Apply" button, Prev / Next |
| `/jobs/new` | Form to post a new job |
| `/dashboard` | Statistics |
| `/feedback` | Feedback form and reviews |
| `*` | 404 page |

Other features: lazy loading of pages (`React.lazy` + `Suspense`), a fake jobs API in `src/services/service.js` (Promises, random delay, 5% random error, `localStorage` as a database), and a real public API for exchange rates (open.er-api.com).

## New assignment: what was added

| Requirement | How it is implemented |
|---|---|
| Firebase setup in a separate file | `src/services/firebase.js` reads the config from `VITE_` environment variables |
| Environment variables | `.env.local` (not in Git) and `.env.example` (in Git) |
| `AuthContext`, `AuthProvider`, `useAuth` | `src/context/AuthContext.jsx` |
| Track the auth state | `onAuthStateChanged` inside `AuthProvider` |
| Signup, login, Google sign-in, logout | functions `signup`, `login`, `loginWithGoogle`, `logout` in `AuthProvider` |
| Loading and error states | `loading` in the context; `submitting` and `error` on the pages |
| `/login` | `src/pages/LoginPage.jsx` |
| `/signup` | `src/pages/SignupPage.jsx` (checks password length and password confirmation) |
| `/profile` (protected) | `src/pages/ProfilePage.jsx` inside `src/components/ProtectedRoute.jsx` |
| NavBar depends on the auth state | `src/components/NavBar.jsx` |
| Server data caching | TanStack Query: `src/main.jsx`, `src/hooks/useJobs.js` |

## Authentication

- `AuthProvider` wraps the whole app (`src/main.jsx`). It keeps two values: `user` and `loading`.
- Firebase calls `onAuthStateChanged` when the app starts and every time a user logs in or out. We save the user in state.
- Firebase stores the session in the browser, so the user stays logged in after a page refresh.
- Any component can call `useAuth()` to get `user`, `loading`, `signup`, `login`, `loginWithGoogle` and `logout`.
- `ProtectedRoute` shows a loader while Firebase checks the session. If there is no user, it redirects to `/login`.
- After a successful login or signup the user is redirected to `/profile`.
- Firebase error codes are changed into simple messages, for example "Wrong email or password."

## Firebase setup

1. Open https://console.firebase.google.com and create a project.
2. Go to **Build → Authentication → Get started**.
3. On the **Sign-in method** tab enable **Email/Password** and **Google**.
4. Go to **Project settings → General → Your apps**, add a **Web app** and copy the `firebaseConfig` values.
5. Copy `.env.example` to `.env.local` and paste your values.
6. Go to **Authentication → Settings → Authorized domains** and add the domain of the deployed site (for this project: `nvrrmindd.github.io`). `localhost` is already there.

## Environment variables

| Variable | Value from `firebaseConfig` |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

- Vite only gives the browser code variables that start with `VITE_`.
- `.env.local` contains the real values and is listed in `.gitignore`, so it is never pushed.
- `.env.example` contains only the variable names with placeholder values. It shows which variables are needed.

## Install, run, build

```bash
cd routes
npm install
cp .env.example .env.local   # then put your Firebase values into .env.local
npm run dev                  # run locally
npm run build                # production build into dist/
```

## Caching strategy

Server data is loaded and cached with **TanStack Query**. Pages do not call the API themselves: they use custom hooks, and the hooks call functions from `src/services/service.js`.

### Which data is cached

The cached resource is **jobs**. It is the main data of the app: the list has filters and pagination, and there are real operations that change it (post a job, apply to a job). Feedback and exchange rates work as in the previous homework.

| Data | Hook | Query key |
|---|---|---|
| One page of the jobs list | `useJobs(filters)` | `['jobs', 'list', filters]` |
| All jobs (dashboard) | `useAllJobs()` | `['jobs', 'all']` |
| One job | `useJob(id)` | `['jobs', 'detail', id]` |

### How the query keys work

A query key is the name of a cache entry. The key of the jobs list contains the `filters` object: `search`, `level`, `aiRisk`, `remoteOnly`, `sort`, `page` and `pageSize`. So every combination of filters and every page has its own cache entry, and different filters or pages never share data.

### Cache configuration

The defaults are set once in `src/main.jsx`:

| Option | Value | Meaning |
|---|---|---|
| `staleTime` | 1 minute | Data is "fresh" for 1 minute. While it is fresh, opening the same page again makes **no** request. Vacancies do not change every second, so 1 minute is enough. |
| `gcTime` | 5 minutes | When no page uses the data, it stays in memory for 5 more minutes and then it is deleted. This lets the user go back and still see the data at once. |
| `retry` | `false` | An error is shown at once, with a "Try again" button. |

### When data is refetched

- When the data is requested for the first time (a new query key).
- When the data is older than `staleTime` and the page is opened again or the browser tab gets focus. The old data is shown at once and is updated in the background.
- When the user clicks "Try again" after an error.
- When the cache is invalidated (see below).

### When the cache is invalidated

| Action | What is invalidated | Why |
|---|---|---|
| A new job is posted (`useCreateJob`) | `['jobs']` | The new job must appear in the lists and statistics |
| The user applies to a job (`useApplyToJob`) | `['jobs']` | The job must show "Application sent" |

`['jobs']` is a prefix: it matches every key that starts with `'jobs'` (lists, dashboard, job details).

### Outdated requests

TanStack Query gives every request an `AbortSignal`. The hooks pass it to the service functions. If the user changes a filter before the previous request finishes, the previous request is cancelled and its result is never saved. Also, every result is stored under its own query key, so an old answer cannot replace a new one.

### Loading, error and empty states

Every jobs page shows a loader while data is loading, an error message with a "Try again" button if the request failed, and a text message if the list is empty.

## Deployment

The app is deployed with **GitHub Pages** from the `main` branch of the repository.

1. Put the real Firebase values into `.env.local`.
2. Run `npm run build` in the `routes` folder. It creates `dist/` and copies `dist/index.html` to `404.html` in the repository root. GitHub Pages opens `404.html` for unknown URLs, so React Router links such as `/jobs/5` also work after a page refresh.
3. Commit and push. GitHub Pages publishes the site in about a minute.
4. Add `nvrrmindd.github.io` to **Authorized domains** in Firebase, or Google sign-in will not work on the deployed site.

The base path `/react/routes/dist/` is set in `vite.config.js`.
