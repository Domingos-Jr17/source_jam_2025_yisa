const CACHE_NAME = 'docescola-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.jpg',
  '/icon-512.jpg'
]

// Instalar service worker e fazer cache dos recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache aberto')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.log('[SW] Erro ao fazer cache:', error)
      })
  )
  self.skipWaiting()
})

// Ativar service worker e limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Interceptar requisições e servir do cache quando offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retornar resposta do cache
        if (response) {
          return response
        }

        return fetch(event.request).then(
          (response) => {
            // Verificar se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clonar resposta
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          }
        ).catch(() => {
          // Offline - retornar página offline se disponível
          return caches.match('/')
        })
      })
  )
})
