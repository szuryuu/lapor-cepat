const CACHE_NAME = 'laporcepat-v1'
const ASSETS = ['/', '/lapor', '/offline.html', '/favicon.ico']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)))
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then((res) => res || caches.match('/offline.html')))
  )
})
