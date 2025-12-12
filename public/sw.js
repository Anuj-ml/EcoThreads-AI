
const CACHE_NAME = 'ecothreads-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first strategy for APIs (Google AI, Firebase, etc)
  if (url.hostname.includes('googleapis.com') || 
      url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('opensupplyhub.org')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first strategy for static assets and CDN libraries
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone and cache for future use (Runtime caching)
        // This captures ESM modules from CDNs and other dynamic assets
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }).catch(() => {
        // Fallback for offline navigation
        if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
        }
    })
  );
});
