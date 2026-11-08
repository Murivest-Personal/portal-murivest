import { useEffect, useState } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { authUserQuery, myProfileQuery } from '@/lib/portal-data'
import { SiteLink } from '@/components/portal/SiteLink'
import { Wordmark } from '@/components/portal/Wordmark'
import AuthScreen, { type AuthMode } from '@/components/portal/AuthScreen'
import NotificationBell from '@/components/portal/NotificationBell'

// Only pages included in the migrated portal are listed.
const navItems = [
  { href: '/portal', label: 'Overview' },
  { href: '/portal/dashboard', label: 'Dashboard' },
  { href: '/portal/briefs', label: 'Briefs' },
  { href: '/portal/off-market', label: 'Off-Market' },
  { href: '/portal/publications', label: 'Intelligence' },
  { href: '/portal/orders', label: 'Orders' },
  { href: '/portal/criteria', label: 'Mandates' },
  { href: '/portal/documents', label: 'Documents' },
  { href: '/portal/nda', label: 'NDAs' },
  { href: '/portal/enquiries', label: 'Enquiries' },
  { href: '/portal/payments', label: 'Payments' },
] as const

// Pages that render their own full-screen, frameless layout.
const FRAMELESS = new Set(['/portal/login', '/portal/reset-password'])

export default function InvestorPortalLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, '') || '/' })
  const search = useRouterState({ select: (s) => s.location.search as Record<string, unknown> })
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: user, isPending } = useQuery(authUserQuery)
  const { data: profile } = useQuery({ ...myProfileQuery, enabled: !!user })

  useEffect(() => setMenuOpen(false), [pathname])

  if (FRAMELESS.has(pathname)) return <>{children}</>
  if (isPending) return <PortalLoading />
  if (!user) {
    const mode: AuthMode = search['mode'] === 'register' ? 'register' : 'signin'
    return <AuthScreen initialMode={mode} />
  }

  const active =
    [...navItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((i) => pathname === i.href || pathname.startsWith(i.href + '/'))?.href ?? null
  const firstName = profile?.full_name?.split(' ')[0] || 'Profile'

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate({ to: '/portal/login' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex h-20 items-center justify-between">
            <Link to="/portal" aria-label="Murivest portal overview">
              <Wordmark size="sm" />
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              <Link to="/portal/profile" className="lux-nav" data-active={pathname === '/portal/profile'}>
                {firstName}
              </Link>
              <NotificationBell />
              <button type="button" onClick={handleSignOut} className="lux-nav">
                Sign out
              </button>
            </div>

            <button type="button" onClick={() => setMenuOpen((v) => !v)} className="lux-nav lg:hidden" aria-expanded={menuOpen}>
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          <nav className="-mb-px hidden gap-8 overflow-x-auto lg:flex" aria-label="Portal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                data-active={active === item.href}
                className="lux-nav whitespace-nowrap border-b border-transparent pb-4 pt-1 data-[active=true]:border-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 top-20 z-30 overflow-y-auto bg-background lg:hidden">
          <nav className="px-6 py-10" aria-label="Portal">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    data-active={active === item.href}
                    className="block py-3 font-display text-xl text-muted-foreground data-[active=true]:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 space-y-5 border-t border-border pt-8">
              <Link to="/portal/profile" className="lux-nav block">Profile</Link>
              <Link to="/portal/notifications" className="lux-nav block">Notifications</Link>
              <button type="button" onClick={handleSignOut} className="lux-nav block">Sign out</button>
            </div>
          </nav>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">{children}</main>

      <footer className="mt-16 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span className="lux-meta">© {new Date().getFullYear()} Murivest Group · Strictly confidential</span>
          <span className="lux-meta">
            <a href="mailto:office@murivest.com" className="hover:text-foreground">office@murivest.com</a>
            {' · '}
            <SiteLink href="/" className="hover:text-foreground">murivest.com</SiteLink>
          </span>
        </div>
      </footer>
    </div>
  )
}

export function PortalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Wordmark size="md" className="animate-pulse" />
    </div>
  )
}
