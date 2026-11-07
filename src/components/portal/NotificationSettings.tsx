import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { Bell, BellOff, Download, Share } from 'lucide-react'
import { savePushSubscription, removePushSubscription } from '@/lib/push.function'

const VAPID_PUBLIC_KEY = (import.meta as ImportMeta & { env: { VITE_VAPID_PUBLIC_KEY?: string } }).env
  .VITE_VAPID_PUBLIC_KEY as string

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

type Status = 'loading' | 'unsupported' | 'ios-install' | 'denied' | 'off' | 'on'

export default function NotificationSettings() {
  const save = useServerFn(savePushSubscription)
  const remove = useServerFn(removePushSubscription)
  const [status, setStatus] = useState<Status>('loading')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [installEvent, setInstallEvent] = useState<any>(null)

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setInstallEvent(e) }
    window.addEventListener('beforeinstallprompt', onPrompt)

    ;(async () => {
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true
      if (isIos && !standalone) return setStatus('ios-install')
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window))
        return setStatus('unsupported')
      if (Notification.permission === 'denied') return setStatus('denied')

      const reg = await navigator.serviceWorker.register('/sw.js')
      const existing = await reg.pushManager.getSubscription()
      setStatus(existing && Notification.permission === 'granted' ? 'on' : 'off')
    })().catch(() => setStatus('unsupported'))

    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const enable = async () => {
    setBusy(true)
    setError(null)
    try {
      const permission = await Notification.requestPermission() // must run from this click
      if (permission !== 'granted') return setStatus(permission === 'denied' ? 'denied' : 'off')
      const reg = await navigator.serviceWorker.ready
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }))
      const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } }
      await save({ data: { endpoint: json.endpoint, keys: json.keys, userAgent: navigator.userAgent } })
      setStatus('on')
    } catch {
      setError('Could not enable notifications. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const disable = async () => {
    setBusy(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await remove({ data: { endpoint: sub.endpoint } })
        await sub.unsubscribe()
      }
      setStatus('off')
    } finally {
      setBusy(false)
    }
  }

  const install = async () => {
    installEvent.prompt()
    await installEvent.userChoice
    setInstallEvent(null)
  }

  if (status === 'loading') return null

  return (
    <div className="bg-white border border-forest/10 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="h-4 w-4 text-gold" />
        <h3 className="font-serif text-lg text-forest">Notifications</h3>
      </div>

      {status === 'ios-install' && (
        <p className="text-sm text-ink/70 flex items-start gap-2">
          <Share className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
          <span>
            To get notifications on iPhone, tap <strong>Share</strong> in Safari, choose{' '}
            <strong>Add to Home Screen</strong>, then open Murivest from your Home Screen and enable notifications here.
          </span>
        </p>
      )}
      {status === 'unsupported' && (
        <p className="text-sm text-ink/70">This browser does not support notifications. Try Chrome, Edge, Firefox or Safari.</p>
      )}
      {status === 'denied' && (
        <p className="text-sm text-ink/70">
          Notifications are blocked. Re-enable them in your browser or phone settings for this site, then return here.
        </p>
      )}
      {status === 'off' && (
        <>
          <p className="text-sm text-ink/70 mb-4">Get alerts for new briefs, order updates and payment confirmations.</p>
          <button onClick={enable} disabled={busy} className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors disabled:opacity-50">
            <Bell className="h-4 w-4" /> {busy ? 'Enabling...' : 'Enable Notifications'}
          </button>
        </>
      )}
      {status === 'on' && (
        <>
          <p className="text-sm text-ink/70 mb-4">Notifications are on for this device.</p>
          <button onClick={disable} disabled={busy} className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors disabled:opacity-50">
            <BellOff className="h-4 w-4" /> Turn Off
          </button>
        </>
      )}

      {installEvent && (
        <button onClick={install} className="mt-4 inline-flex items-center gap-2 bg-gold text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-medium hover:bg-gold-deep transition-colors">
          <Download className="h-4 w-4" /> Install App
        </button>
      )}
      {error && <p role="alert" className="text-xs text-red-600 mt-3">{error}</p>}
    </div>
  )
}