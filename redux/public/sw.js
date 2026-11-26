const VERSION = 'v1'
const SHELL = 'redux-shell-' + VERSION
const STATIC = 'redux-static-' + VERSION
const API = 'redux-api-' + VERSION
const PAGES = 'redux-pages-' + VERSION

const FILES = [
  './',
  'index.html',
  'assets/index.js',
  'assets/index.css',
  'assets/hero.jpg',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then(async (cache) => {
      await cache.addAll(FILES.map((file) => new Request(file, { cache: 'reload' })))
      await cache.put('offline', await cache.match('index.html'))
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('redux-') && !key.endsWith('-' + VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'update') self.skipWaiting()
  if (event.data.page) event.waitUntil(savePage(event.data.page))
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET') return

  if (url.hostname === 'open.er-api.com') event.respondWith(networkFirst(request))
  else if (request.mode === 'navigate') event.respondWith(openPage(request))
  else if (url.origin === location.origin) event.respondWith(cacheFirst(request))
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC)
      await cache.put(request, response.clone())
      await trim(STATIC, 50)
    }
    return response
  } catch {
    return Response.error()
  }
}

async function networkFirst(request) {
  const cache = await caches.open(API)
  try {
    const response = await fetch(request)
    if (response.ok) {
      await cache.put(request, response.clone())
      await trim(API, 20)
    }
    return response
  } catch {
    const cached = await cache.match(request)
    if (!cached) return Response.error()
    const headers = new Headers(cached.headers)
    headers.set('X-From-Cache', 'true')
    return new Response(cached.body, { headers })
  }
}

async function openPage(request) {
  try {
    return await fetch(request)
  } catch {
    return (await caches.match(request)) || Response.redirect('offline')
  }
}

async function savePage(page) {
  const cache = await caches.open(PAGES)
  await cache.put(page, await caches.match('index.html'))
  await trim(PAGES, 30)
}

async function trim(name, max) {
  const cache = await caches.open(name)
  const keys = await cache.keys()
  if (keys.length > max) await cache.delete(keys[0])
}
