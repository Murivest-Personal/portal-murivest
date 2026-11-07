self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch { /* ignore */ }
  const title = data.title || 'Murivest'
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || 'You have a new update.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag,                       // same tag replaces the older notification
      data: { url: data.url || '/portal' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL(event.notification.data?.url || '/portal', self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (w.url === url && 'focus' in w) return w.focus()
      }
      return self.clients.openWindow(url)
    }),
  )
})