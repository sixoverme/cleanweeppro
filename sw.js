const CACHE_NAME = 'cleansweep-pro-cache-v3';
// These are the core files for the app shell
const CORE_ASSETS = [
  './',
  './index.html',
  './icon.svg',
  './manifest.json',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './hooks/useLocalStorage.ts',
  './context/AppContext.tsx',
  './constants.tsx',
  './components/Icons.tsx',
  './components/Dashboard.tsx',
  './components/CustomersPage.tsx',
  './components/AppointmentsPage.tsx',
  './components/InventoryPage.tsx',
  './components/InvoicesPage.tsx',
  './components/CustomerDetailPage.tsx',
  './components/InventoryDetailPage.tsx',
  './components/AppointmentCalendar.tsx',
  './components/BusinessInfoForm.tsx',
  './components/InvoiceDetailPage.tsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests and http/https requests.
  // This prevents errors from trying to cache chrome-extension:// requests.
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try to get the response from the cache
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // If we found a match in the cache, return it
        return cachedResponse;
      }
      
      // If the resource was not in the cache, try the network
      try {
        const fetchResponse = await fetch(event.request);
        // Save the new response into the cache for next time
        // We need to clone it because a response can be consumed only once
        cache.put(event.request, fetchResponse.clone());
        // And return it
        return fetchResponse;
      } catch (e) {
        // The network failed.
        console.error('Fetch failed; could not retrieve resource from network.', e);
      }
    })
  );
});


self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});