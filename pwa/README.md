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

- `public/manifest.webmanifest` identifies the installable app; the two PNG icons are in `public/icons/`.
- The service worker code is in `sw-template.js`. The Vite build creates `dist/sw.js` from it and includes the built HTML, JavaScript, CSS, icons, manifest, and offline page in the install cache.
- The service worker keeps versioned caches (version = build time), removes old versions on activation, and waits for the user to select **Update app** before activating an update.
- Built assets and images use cache-first (max 60 entries). The public exchange-rate API uses network-first and keeps up to 20 responses. Firebase/authentication requests are not put in a shared runtime cache.
- Jobs are generated and saved in local storage by the original app, so lists and details already work offline on that device. The top-of-page connectivity message explains when the app is offline; saved exchange rates show a separate cached-data message.
- `/offline` is the app's offline route. Failed offline navigations show a separately precached retry page.
- The navigation collapses to a touch-friendly menu on narrow screens.

