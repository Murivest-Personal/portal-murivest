import { Key, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { briefsQuery } from '@/lib/portal-data'
import { Link } from '@tanstack/react-router'
import { SiteLink } from '@/components/portal/SiteLink'
import {
  Lock,
  Eye,
  FileText,
  MapPin,
  TrendingUp,
  Clock,
  Shield,
  ChevronRight,
  Download,
  Briefcase,
  Users,
  Award,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

// Access tier presentation (static configuration)
const accessTiers = {
  registered: {
    label: 'Registered',
    color: 'bg-forest/10',
    textColor: 'text-forest/60',
    description: 'Public deal summaries and market commentary',
  },
  verified: {
    label: 'Verified',
    color: 'bg-gold/10',
    textColor: 'text-gold',
    description: 'Full investment memoranda and financial models',
  },
  premium: {
    label: 'Premium',
    color: 'bg-gold',
    textColor: 'text-forest',
    description: 'Off-market opportunities and co-investment rights',
  },
}

const viewerLabels = {
  registered: 'Registered Investor',
  verified: 'Verified Investor',
  premium: 'Premium Investor',
}

const ALL_CLASSES = 'All Asset Classes'
const ASSET_CLASSES = [
  ALL_CLASSES,
  'Commercial Office',
  'Industrial/Logistics',
  'Residential',
  'Mixed-Use',
  'Land',
  'Retail',
  'Hospitality',
]

export default function InvestorBriefsPage() {
  const { data } = useSuspenseQuery(briefsQuery)
  const { briefs, error, viewer, settings } = data
  const [assetFilter, setAssetFilter] = useState(ALL_CLASSES)

  const displayBriefs =
    assetFilter === ALL_CLASSES ? briefs : briefs.filter((b: { assetClass: string }) => b.assetClass === assetFilter)
  const insights = settings?.dealFlowInsights ?? []

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-forest/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Off-Market Deal Room</span>
            <span className="text-gold/30">|</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-forest/50">
              Exclusive Opportunities
            </span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-forest">Investment Briefs</h1>
          <p className="text-sm text-ink/70 mt-3 max-w-2xl leading-relaxed">
            Direct real estate opportunities not publicly marketed. Family offices and institutional
            investors increasingly source real estate through trusted networks rather than traditional
            brokerage. Access is tier-based.
          </p>
        </div>

        {viewer && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-1">Your Access Level</div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30">
                <Shield className="h-3 w-3 text-gold" />
                <span className="text-xs uppercase tracking-[0.15em] text-gold font-medium">
                  {viewerLabels[viewer.accessLevel as keyof typeof viewerLabels]}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deal Flow Intelligence (managed in Sanity: Deal Room Settings) */}
      {insights.length > 0 && (
        <section className="bg-forest text-ivory p-8 lg:p-12 rounded-sm">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-2">Market Intelligence</span>
            <h2 className="font-serif text-3xl mb-2">{settings?.dealFlowHeading || 'The Off-Market Advantage'}</h2>
            {settings?.dealFlowIntro && (
              <p className="text-sm text-ivory/70 max-w-3xl">{settings.dealFlowIntro}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white/5 border border-gold/20 p-6 hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl font-light text-gold mb-2">{insight.stat}</div>
                <div className="text-xs uppercase tracking-wider text-white/80 mb-2">{insight.label}</div>
                {insight.description && (
                  <p className="text-xs text-white/60 leading-relaxed mb-3">{insight.description}</p>
                )}
                <div className="text-[10px] text-gold/70 uppercase tracking-wider">
                  {insight.sourceUrl ? (
                    <a href={insight.sourceUrl} target="_blank" rel="noreferrer noopener" className="hover:text-gold">
                      {insight.source}
                    </a>
                  ) : (
                    insight.source
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-sm text-ivory/70 max-w-2xl">
                <span className="text-white font-medium">Confidentiality Protocol:</span> All opportunities require
                executed NDA before detailed disclosure. Proof of funds may be required for premium tier assets.
                Deal flow is relationship-based; reputation determines access.
              </p>
            </div>
            <SiteLink
              href="/contact?subject=nda-execution"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-gold hover:text-white transition-colors flex-shrink-0"
            >
              Execute NDA <ChevronRight className="h-3 w-3" />
            </SiteLink>
          </div>
        </section>
      )}

      {/* Access Tiers */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-forest mb-1">Access Tiers</h2>
            <p className="text-xs text-ink/60">Progressive disclosure based on verification and relationship depth</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(accessTiers).map(([key, tier]) => (
            <div
              key={key}
              className={`border border-forest/10 p-6 ${key === 'verified' ? 'bg-gold/5 border-gold/30' : 'bg-white'}`}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${tier.color} ${tier.textColor} mb-4`}>
                {key === 'premium' && <Lock className="h-3 w-3" />}
                {key === 'verified' && <Shield className="h-3 w-3" />}
                {key === 'registered' && <Eye className="h-3 w-3" />}
                <span className="text-[10px] uppercase tracking-wider font-medium">{tier.label}</span>
              </div>
              <p className="text-sm text-ink/70 leading-relaxed">{tier.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Briefs Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl text-forest mb-1">Current Opportunities</h2>
            <p className="text-xs text-ink/60">
              {briefs.filter((b: { status: string }) => b.status === 'active').length} active briefs |{' '}
              {briefs.filter((b: { accessLevel: string }) => b.accessLevel === 'premium').length} premium access
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Filter:</span>
            <select
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value)}
              className="bg-white border border-forest/20 text-xs text-forest px-3 py-2 focus:border-gold focus:outline-none"
            >
              {ASSET_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 text-red-700">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Unable to load briefs</span>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayBriefs.map((brief) => {
              const tier = accessTiers[brief.accessLevel as keyof typeof accessTiers] || accessTiers.registered
              const isPremium = brief.accessLevel === 'premium'
              const needsGate = (isPremium || brief.requiresOrder) && !brief.hasAccess
              const orderLabel = brief.orderPriceUsd ? `Order ($${brief.orderPriceUsd})` : 'Order'

              return (
                <div
                  key={brief.id}
                  className={`group bg-white border ${isPremium ? 'border-gold/30' : 'border-forest/10'} hover:border-gold/50 transition-all duration-300 flex flex-col`}
                >
                  {/* Card Header */}
                  <div className={`p-6 ${isPremium ? 'bg-gold/5' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-[0.15em] px-2 py-1 ${tier.color} ${tier.textColor}`}>
                          {brief.assetClass}
                        </span>
                        {brief.status === 'under_offer' && (
                          <span className="text-[10px] uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1">
                            Under Offer
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 ${tier.textColor}`}>
                        {isPremium ? (
                          <Lock className="h-4 w-4" />
                        ) : brief.accessLevel === 'verified' ? (
                          <Shield className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="text-[10px] uppercase tracking-wider">{tier.label}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-forest group-hover:text-gold transition-colors mb-2">
                      {brief.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-ink/60 mb-4">
                      <MapPin className="h-4 w-4 text-gold" />
                      {brief.locationDetail || brief.location}
                      {brief.confidentiality && (
                        <span className="text-[10px] text-gold ml-2">({brief.confidentiality})</span>
                      )}
                    </div>

                    <p className="text-sm text-ink/80 leading-relaxed line-clamp-3 mb-4">{brief.teaser}</p>

                    {/* Quick Metrics */}
                    {brief.metrics && brief.metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {brief.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-ivory p-2 text-center">
                            <div className="text-xs font-medium text-forest">{metric.value}</div>
                            <div className="text-[10px] text-forest/50 uppercase tracking-wider">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Highlights */}
                    <div className="space-y-1">
                      {brief.highlights?.slice(0, 3).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-ink/70">
                          <CheckCircle2 className="h-3 w-3 text-gold mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-auto p-6 pt-4 border-t border-forest/5 flex items-center justify-between bg-ivory/50">
                    <div>
                      <div className="text-xs text-forest/50 mb-1">Investment Required</div>
                      <div className="font-serif text-lg text-forest">
                        {brief.priceUsd ? `$${(brief.priceUsd / 1000000).toFixed(1)}M` : 'Contact'}
                        <span className="text-xs text-forest/50 ml-2">
                          ({brief.priceKes ? `${(brief.priceKes / 1000000).toFixed(0)}M KES` : 'Price on request'})
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {needsGate ? (
                        isPremium ? (
                          <SiteLink
                            href="/contact?subject=premium-access"
                            className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors"
                          >
                            <Lock className="h-3 w-3" />
                            Request Access
                          </SiteLink>
                        ) : (
                          <Link
                            to="/portal"
                            hash="brief-access"
                            className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            Order Brief
                          </Link>
                        )
                      ) : (
                        <Link
                          to="/portal/briefs/$slug"
                          params={{ slug: brief.slug }}
                          className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Link>
                      )}

                      {brief.requiresOrder && !isPremium && !brief.hasAccess && (
                        <Link
                          to="/portal"
                          hash="brief-access"
                          className="inline-flex items-center gap-2 bg-gold text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-medium hover:bg-gold-deep transition-colors"
                        >
                          <Download className="h-3 w-3" />
                          {orderLabel}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!error && displayBriefs.length === 0 && (
          <div className="bg-ivory border border-gold/20 p-12 text-center">
            <Briefcase className="h-12 w-12 text-gold/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-forest mb-2">No Active Briefs</h3>
            <p className="text-sm text-ink/60 max-w-md mx-auto mb-4">
              Current opportunities are under review or reserved for premium tier investors.
              Join our deal flow network to receive early notification of new briefs.
            </p>
            <SiteLink
              href="/contact?subject=deal-flow-network"
              className="inline-block bg-forest text-white px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
            >
              Join Deal Flow Network
            </SiteLink>
          </div>
        )}
      </section>

      {/* Deal Sourcing Philosophy */}
      <section className="bg-ivory border border-gold/20 p-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="font-serif text-2xl text-forest mb-4">How Murivest Sources Opportunities</h3>
            <div className="space-y-4 text-sm text-ink/80 leading-relaxed">
              <p>
                Ultra-high-net-worth individuals and family offices increasingly source real estate
                opportunities through trusted networks rather than traditional brokerage channels. The transaction
                doesn't happen on the polo field—it happens after the match, during conversations where developers
                mention they're "consolidating holdings" and qualified buyers signal liquidity through sophisticated
                questions.
              </p>
              <p>
                Family offices use a range of deal sourcing strategies: personal networks, investment banks and
                brokers, professional networks, direct outreach, and industry research. Reputation determines
                access—those known for sophisticated evaluation and rapid execution receive opportunities others
                never see.
              </p>
              <p>
                The economics favor off-market transactions: no carrying costs from extended listings, no marketing
                spend on staging and photography, and no contingency-laden offers. Sellers benefit from faster
                closings with pre-vetted, liquid buyers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-forest mb-4">Our Sourcing Channels</h4>

            <div className="flex items-start gap-4 p-4 bg-white border border-forest/10">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h5 className="font-medium text-forest mb-1">Network Effect</h5>
                <p className="text-xs text-ink/70">
                  Estate attorneys, wealth managers, and family office principals signal opportunities
                  well before formal market entry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white border border-forest/10">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h5 className="font-medium text-forest mb-1">Reputation Access</h5>
                <p className="text-xs text-ink/70">
                  Families who prove themselves as valuable partners develop reputations that attract
                  future opportunities. The network has long memories.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white border border-forest/10">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h5 className="font-medium text-forest mb-1">Proprietary Research</h5>
                <p className="text-xs text-ink/70">
                  Direct outreach to developers and distressed asset holders based on our
                  market intelligence and zoning tracking systems.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white border border-forest/10">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h5 className="font-medium text-forest mb-1">Patient Capital</h5>
                <p className="text-xs text-ink/70">
                  We maintain long-dated positions and relationships, enabling us to access
                  generational transfers before formal marketing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 border-t border-forest/10">
        <h3 className="font-serif text-2xl text-forest mb-3">Require Bespoke Sourcing?</h3>
        <p className="text-sm text-ink/70 max-w-2xl mx-auto mb-6">
          Murivest undertakes custom deal sourcing for institutional clients with specific sector,
          geographic, or return requirements. Our team maintains active networks across East Africa's
          property markets and can identify off-market opportunities aligned with your investment criteria.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SiteLink
            href="/contact?subject=custom-sourcing"
            className="inline-flex items-center gap-2 bg-gold text-forest px-8 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-gold-deep transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Request Custom Sourcing
          </SiteLink>
          <Link
            to="/portal/off-market"
            className="inline-flex items-center gap-2 border-2 border-forest text-forest px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest hover:text-white transition-all"
          >
            <Lock className="h-4 w-4" />
            View Off-Market Pipeline
          </Link>
        </div>
      </section>
    </div>
  )
}