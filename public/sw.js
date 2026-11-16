const CACHE_NAME = 'robots-v2';
const BASE_URL = self.registration.scope;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll([
                `${BASE_URL}assets/hole-dark.png`,
            ]))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName)),
            ))
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) {
        return;
    }

    const request = event.request;
    const isStaticAsset = /\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i.test(new URL(request.url).pathname);

    event.respondWith(isStaticAsset
        ? caches.match(request).then(cachedResponse => cachedResponse || fetchAndCache(request))
        : fetchAndCache(request).catch(() => caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            throw new Error(`Network request failed: ${request.url}`);
        })),
    );
});

async function fetchAndCache(request) {
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${request.url}`);
    }
    const responseToCache = response.clone();
    await caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
    return response;
}
