import { useSuspenseQuery } from '@tanstack/react-query'
import { criteriaQuery } from '@/lib/portal-data'
import { Target, Shield } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import CriteriaForm from '@/components/portal/CriteriaForm'
import CriteriaActiveToggle from '@/components/portal/CriteriaActiveToggle'


export default function PortalCriteriaPage() {
  const { data: { user, criteria } } = useSuspenseQuery(criteriaQuery)

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gold/20 p-12 max-w-md text-center">
          <Shield className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-forest mb-3">Authentication Required</h1>
          <Link to="/portal" search={{ mode: "login" }} className="inline-block bg-forest text-white px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors">
            Sign In to Portal
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-10">
      <div className="pb-8 border-b border-forest/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Investor Portal</span>
        </div>
        <h1 className="font-serif text-4xl lg:text-5xl text-forest">Acquisition Criteria</h1>
        <p className="text-sm text-ink/70 mt-2 max-w-2xl">
          Define your target markets, asset types, and pricing bands. Your advisor uses this to match you with
          relevant off-market opportunities.
        </p>
      </div>

      {criteria && criteria.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-forest">Your Criteria</h2>
          <div className="bg-white border border-forest/10 divide-y divide-forest/10">
            {criteria.map((c) => (
              <div key={c.id} className="p-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-forest capitalize">
                    {c.markets?.join(', ').replace(/-/g, ' ')}
                  </p>
                  <p className="text-xs text-forest/60 mt-1 capitalize">
                    {c.asset_types?.join(', ').replace(/-/g, ' ')}
                  </p>
                  <p className="text-xs text-forest/40 mt-1">
                    {c.min_price ? `From $${Number(c.min_price).toLocaleString()}` : ''}
                    {c.max_price ? ` to $${Number(c.max_price).toLocaleString()}` : ''}
                    {c.min_yield ? ` · Min yield ${c.min_yield}%` : ''}
                  </p>
                  {c.notes && <p className="text-xs text-forest/50 mt-2">{c.notes}</p>}
                </div>
                <CriteriaActiveToggle id={c.id} isActive={c.is_active} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white border border-forest/10 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl text-forest">Add New Criteria</h2>
        </div>
        <CriteriaForm />
      </section>
    </div>
  )
}
