/* Kalima service worker — offline-first cache */
const CACHE = 'kalima-v1';
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      // keep lesson + audio caches so downloaded speech replays offline
      Promise.all(keys.filter((k) => k !== CACHE && k !== 'kalima-audio-v1').map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // never cache non-http(s) or chrome-extension requests
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  event.respondWith(
    caches.match(req, { ignoreSearch: false }).then((cached) => {
      // Online HD audio: serve from cache first so downloaded speech replays offline.
      if (url.hostname === 'translate.google.com' || url.pathname.endsWith('.mp3')) {
        return (async () => {
          if (cached) return cached;
          try {
            const res = await fetch(req);
            if (res && res.ok) {
              const copy = res.clone();
              caches.open('kalima-audio-v1').then((c) => c.put(req, copy)).catch(() => {});
            }
            return res;
          } catch { return Response.error(); }
        })();
      }
      const network = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => {
        if (req.mode === 'navigate') {
          return caches.match('/index.html').then((m) => m || Response.error());
        }
        return cached || Response.error();
      });
      // stale-while-revalidate for assets/fonts, network-first for navigations
      if (req.mode === 'navigate') return network;
      return cached || network;
    })
  );
});
