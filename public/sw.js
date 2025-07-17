const CACHE_NAME = 'salama-kenya-v1';
const STATIC_CACHE = 'salama-static-v1';
const DYNAMIC_CACHE = 'salama-dynamic-v1';

// Assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Audio files
  '/audio/danger-detected-sw.mp3',
  '/audio/please-send-help-sw.mp3',
  '/audio/emergency-activated-sw.mp3',
  '/audio/safe-status-sw.mp3'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external URLs
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }

        // Not in cache, try network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not successful
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Cache successful responses
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Network failed, try to serve a fallback
            if (request.destination === 'document') {
              return caches.match('/');
            }
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for when connectivity is restored
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'emergency-sync') {
    event.waitUntil(syncEmergencyData());
  }
  
  if (event.tag === 'contacts-sync') {
    event.waitUntil(syncContactsData());
  }
});

async function syncEmergencyData() {
  try {
    // Get stored emergency incidents from IndexedDB
    const incidents = await getStoredIncidents();
    
    if (incidents.length > 0) {
      console.log('Syncing emergency incidents:', incidents.length);
      
      // Send to backend when online
      for (const incident of incidents) {
        await fetch('/api/emergency-incidents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(incident)
        });
      }
      
      // Clear synced data
      await clearStoredIncidents();
    }
  } catch (error) {
    console.error('Failed to sync emergency data:', error);
  }
}

async function syncContactsData() {
  try {
    // Sync logic for contacts if needed
    console.log('Syncing contacts data...');
  } catch (error) {
    console.error('Failed to sync contacts:', error);
  }
}

// Helper functions for IndexedDB operations
async function getStoredIncidents() {
  return new Promise((resolve) => {
    const stored = localStorage.getItem('emergency-incidents');
    resolve(stored ? JSON.parse(stored) : []);
  });
}

async function clearStoredIncidents() {
  localStorage.removeItem('emergency-incidents');
}