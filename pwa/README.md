# AI Era Jobs PWA

This is the PWA version of the existing React job board. It keeps the original job filters, details, dashboard, forms, feedback, and Firebase sign-in.

- GitHub repository: https://github.com/nvrrmindd/react (project folder `pwa/`)
- Deployed path: https://nvrrmindd.github.io/react/pwa/dist/

## Run locally

```bash
cd pwa
npm ci
cp .env.example .env.local
npm run dev
```

Add your Firebase settings to `.env.local` for sign-in and protected profile features. Never commit that file.

## Build and deploy

```bash
npm run build
```

The build is written to `dist/`, under the GitHub Pages path used by this repository. `404.html` supports direct links to client-side routes.

## PWA behavior

- `public/manifest.webmanifest` + icons in `public/icons/` make the app installable.
- `public/sw.js` is the service worker: pre-caches the app shell, deletes old caches on activate (`VERSION`), shows an **Update** button for new versions.
- Cache-first for own files (max 50), network-first for the exchange-rate API (max 20). Firebase/auth requests are never cached.
- `/offline` page with **Retry connection**; Online/Offline indicator on every page.
- Responsive menu and layout from 320px.
- When deploying a new version, change `VERSION` in `public/sw.js`.
