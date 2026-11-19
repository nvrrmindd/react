// Service Worker. Vite fills in VERSION and PRECACHE during build (see vite.config.js).
const VERSION = '__VERSION__'
const SHELL_CACHE = 'shell-' + VERSION // app shell: html, js, css, icons, offline page
const STATIC_CACHE = 'static-' + VERSION // images / fonts (cache-first)
const API_CACHE = 'api-' + VERSION // public API responses (network-first)
const PAGES_CACHE = 'pages-' + VERSION // visited pages
const ALL_CACHES = [SHELL_CACHE, STATIC_CACHE, API_CACHE, PAGES_CACHE]
const PRECACHE = __PRECACHE__
const API_HOST = 'open.er-api.com'

const url = (path) => new URL(path, self.registration.scope).href

// 1. install: download and save the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE.map(url))))
})

// 2. activate: delete caches from old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !ALL_CACHES.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

// messages from the app
self.addEventListener('message', (event) => {
  // user clicked "Update app"
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
  // user opened a page inside the app -> remember it for offline
  if (event.data?.type === 'CACHE_PAGE') event.waitUntil(cacheVisitedPage(event.data.url))
})

// 3. fetch: choose a strategy for every request
self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const { origin, hostname } = new URL(request.url)

  if (hostname === API_HOST) {
    event.respondWith(networkFirst(request))
  } else if (request.mode === 'navigate') {
    event.respondWith(pageRequest(request))
  } else if (origin === self.location.origin) {
    event.respondWith(cacheFirst(request))
  }
  // everything else (Firebase auth, tokens, Google) goes to the network and is never cached
})

// Cache-first: images, icons, fonts, js, css
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      await cache.put(request, response.clone())
      await trimCache(STATIC_CACHE, 60)
    }
    return response
  } catch {
    return new Response('', { status: 504 })
  }
}

// Network-first: public API. Offline -> last saved answer
async function networkFirst(request) {
  const cache = await caches.open(API_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) {
      await cache.put(request, response.clone())
      await trimCache(API_CACHE, 20)
    }
    return response
  } catch {
    const cached = await cache.match(request)
    if (!cached) {
      return new Response(JSON.stringify({ error: 'offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    // mark the answer so the app can show "cached data"
    const headers = new Headers(cached.headers)
    headers.set('X-From-Cache', 'true')
    return new Response(cached.body, { status: 200, headers })
  }
}

// Pages: network-first. Offline -> visited page, otherwise the offline page
async function pageRequest(request) {
  try {
    const response = await fetch(request)
    // GitHub Pages answers 404 for app routes like /jobs/5 -> give the app shell
    if (response.status === 404) return (await caches.match(url('index.html'))) || response
    return response
  } catch {
    return (await caches.match(request.url, { cacheName: PAGES_CACHE }))
      || (await caches.match(url('offline.html')))
  }
}

async function cacheVisitedPage(pageUrl) {
  if (!pageUrl.startsWith(self.registration.scope)) return
  const shell = await caches.match(url('index.html'))
  if (!shell) return
  const cache = await caches.open(PAGES_CACHE)
  await cache.put(pageUrl, shell)
  await trimCache(PAGES_CACHE, 50)
}

// keep only the newest maxEntries items (no unlimited growth)
async function trimCache(name, maxEntries) {
  const cache = await caches.open(name)
  const keys = await cache.keys()
  for (const key of keys.slice(0, keys.length - maxEntries)) await cache.delete(key)
}
