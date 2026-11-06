
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

## Bonus features

| Feature | Location |
|---|---|
| Lazy loading of pages with `React.lazy` | `src/App.jsx` |
| `Suspense` fallback while a lazy page loads | `src/layouts/RootLayout.jsx` |
| Scroll to top on every route change | `src/layouts/RootLayout.jsx` |
| Filters, search, sort and page stored in the URL (`useSearchParams`) | `src/hooks/useJobFilters.js`, `src/pages/JobsPage.jsx` |
| Real public API — USD exchange rates (open.er-api.com) | `src/services/service.js` (`getExchangeRates`), `src/hooks/useExchangeRates.js` |
| Currency widget (KZT, EUR, RUB, CNY) | `src/components/CurrencyWidget.jsx` — used on `src/pages/HomePage.jsx` and `src/pages/JobDetailsPage.jsx` |
| Fake API: Promises, random delays, 5% network error, `localStorage` as a DB | `src/services/service.js` |
| Retry button on load errors | `src/components/StatusMessage.jsx` — used on Jobs, Job details, Dashboard pages |
| Dashboard with statistics and level filter | `src/pages/DashboardPage.jsx`, `src/components/StatCard.jsx`, `src/components/Breakdown.jsx` |
| Feedback form with validation, saved to `localStorage` | `src/pages/FeedbackPage.jsx` |
| Apply to a job (status saved in `localStorage`) | `src/pages/JobDetailsPage.jsx`, `src/services/service.js` (`applyToJob`) |
| Prev / Next job navigation and smart "Back" button | `src/pages/JobDetailsPage.jsx` |
| Invalid ID and 404 job handling | `src/pages/JobDetailsPage.jsx` |
| Login page placeholder | `src/pages/LoginPage.jsx` |
| 404 Not Found page | `src/pages/NotFoundPage.jsx` |

### Bonus: salary in KZT

On the job details page the salary is also shown in Kazakhstani tenge, converted with the live USD → KZT rate:
`$3,000 / month · 1 500 000 ₸ / ай`

Location: `src/pages/JobDetailsPage.jsx` (salary block, uses `useExchangeRates`)
