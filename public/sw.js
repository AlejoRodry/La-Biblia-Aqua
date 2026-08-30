const CACHE_NAME = 'biblia-rvr1960-v1';
const DATA_CACHE_NAME = 'biblia-data-v1';
const FONT_CACHE_NAME = 'biblia-fonts-v1';

const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        await cache.addAll(STATIC_PRECACHE);
      } catch (err) {
        console.warn('Pre-cache error during SW install:', err);
      }
      // Also pre-fetch /api/bible if online
      try {
        const dataCache = await caches.open(DATA_CACHE_NAME);
        const bibleRes = await fetch('/api/bible');
        if (bibleRes.ok) {
          await dataCache.put('/api/bible', bibleRes);
        }
      } catch (e) {
        // Will be cached on first user fetch
      }
      return self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (![CACHE_NAME, DATA_CACHE_NAME, FONT_CACHE_NAME].includes(key)) {
            return caches.delete(key);
          }
        })
      );
      return self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. API Calls (Bible text database)
  if (url.pathname === '/api/bible') {
    event.respondWith(
      (async () => {
        const dataCache = await caches.open(DATA_CACHE_NAME);
        // Try network first
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            dataCache.put(event.request, networkResponse.clone());
            return networkResponse;
          }
        } catch (err) {
          // Network failed (offline) -> fallback to cache below
        }

        // Return from cache
        const cachedResponse = await dataCache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Return fallback JSON
        return new Response(JSON.stringify({ error: 'offline_no_cache' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })()
    );
    return;
  }

  // 2. Google Fonts & CDN fonts
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      (async () => {
        const fontCache = await caches.open(FONT_CACHE_NAME);
        const cached = await fontCache.match(event.request);
        if (cached) return cached;

        try {
          const networkRes = await fetch(event.request);
          if (networkRes.ok) {
            fontCache.put(event.request, networkRes.clone());
          }
          return networkRes;
        } catch (e) {
          return cached || new Response('', { status: 408 });
        }
      })()
    );
    return;
  }

  // 3. Navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }
        } catch (err) {
          // Offline navigation
        }

        const cache = await caches.open(CACHE_NAME);
        const cached = (await cache.match(event.request)) || (await cache.match('/index.html')) || (await cache.match('/'));
        if (cached) return cached;

        return new Response('Sin conexión', { status: 503, statusText: 'Offline' });
      })()
    );
    return;
  }

  // 4. Static assets (JS, CSS, SVG, PNG, icons)
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);

      if (cached) {
        // Revalidate in background if online
        fetch(event.request)
          .then((networkRes) => {
            if (networkRes && networkRes.ok) {
              cache.put(event.request, networkRes);
            }
          })
          .catch(() => {});
        return cached;
      }

      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.ok && event.request.method === 'GET') {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        // Try match ignoring query params
        const urlWithoutQuery = event.request.url.split('?')[0];
        const matchNoQuery = await cache.match(urlWithoutQuery);
        if (matchNoQuery) return matchNoQuery;
        throw err;
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
