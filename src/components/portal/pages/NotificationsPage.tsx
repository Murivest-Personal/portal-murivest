import NotificationsList from '@/components/portal/NotificationsList'

export default function PortalNotificationsPage() {
  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-forest/10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Investor Portal</span>
        <h1 className="font-serif text-4xl lg:text-5xl text-forest mt-2">Notifications</h1>
        <p className="text-sm text-ink/70 mt-2 max-w-2xl">
          Updates on your orders, verification status, off-market deals, and new publications.
        </p>
      </div>

      <NotificationsList />
    </div>
  )
}
