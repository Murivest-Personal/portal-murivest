// src/app/portal/off-market/page.tsx

import { useSuspenseQuery } from '@tanstack/react-query'
import { offMarketQuery } from '@/lib/portal-data'
import { Link } from '@tanstack/react-router'
import { SiteLink } from '@/components/portal/SiteLink'
import { 
  Lock, 
  Shield, 
  Eye, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  Globe,
  MapPin,
  AlertCircle,
  CheckCircle2,
  FileText,
  ArrowRight
} from 'lucide-react'

// Off-market intelligence from Knight Frank and industry research
const offMarketIntelligence = {
  globalStats: [
    {
      stat: "30%",
      label: "Off-Market Share",
      description: "Knight Frank Los Angeles: Nearly 30% of 2025 sales conducted off-market, with firm representing both sides of two highest sales",
      source: "Knight Frank 2026"
    },
    {
      stat: "25%",
      label: "Global Luxury",
      description: "Off-market sector accounts for up to 25% of luxury transactions in top global cities",
      source: "Knight Frank 2025"
    },
    {
      stat: "$18.6M",
      label: "Typical Deal Size",
      description: "Ultra-luxury transactions averaging $18.6M, reflecting tilt toward larger trophy acquisitions",
      source: "Knight Frank Q4 2025"
    },
    {
      stat: "555",
      label: "Mega-Deals Q4 2025",
      description: "Homes priced above $10 million changed hands across a dozen major cities, representing $10.3B in aggregate value",
      source: "Knight Frank Global"
    }
  ],
  
  accessCriteria: {
    hnwi: {
      threshold: "$1M",
      label: "High-Net-Worth",
      benefits: ["Priority banking", "Exclusive products", "Personalized advisory"]
    },
    vhnwi: {
      threshold: "$5M",
      label: "Very High-Net-Worth",
      benefits: ["Private equity access", "Hedge funds", "Dedicated wealth teams"]
    },
    uhnwi: {
      threshold: "$30M",
      label: "Ultra High-Net-Worth",
      benefits: ["Family office services", "Direct deal flow", "Co-investment rights", "Bespoke structures"]
    }
  },

  dealStructures: [
    {
      type: "SPV (Single Deal)",
      description: "Special Purpose Vehicle for clean cap table and risk isolation",
      bestFor: "Clear ownership, tailored governance",
      adminLoad: "Medium-High"
    },
    {
      type: "Club Deal",
      description: "Multiple families investing together with lead organizer",
      bestFor: "Larger checks, shared diligence",
      adminLoad: "High"
    },
    {
      type: "Sidecar Vehicle",
      description: "Parallel investment alongside sponsor's main fund",
      bestFor: "Repeat access, programmatic approach",
      adminLoad: "Medium"
    }
  ]
}

// Sample off-market deals with realistic African real estate opportunities
const sampleDeals = [
  {
    id: 'om-001',
    title: "Nairobi CBD Trophy Office",
    asset_class: "Commercial Office",
    location: "Nairobi, Kenya",
    location_detail: "Central Business District, Upper Hill",
    indicative_price: 45000000, // USD 45M
    price_kes: 5850000000,
    teaser: "Rare opportunity to acquire 28,000 sqm Grade A office tower with 95% occupancy and weighted average lease term of 8.5 years. Anchor tenants include multinational banking and telecom headquarters. Net operating income of $4.2M annually with 3% escalations.",
    status: "active",
    access_level: "premium",
    created_at: "2026-03-20",
    highlights: [
      "95% occupancy with credit-rated tenants",
      "8.5-year WALT with USD-denominated leases",
      "4.2% going-in cap rate",
      "LEED Gold certification",
      "Direct CBD location with expressway access"
    ],
    metrics: {
      sqm: "28,000",
      occupancy: "95%",
      walt: "8.5 years",
      noi: "$4.2M",
      capRate: "4.2%"
    },
    structure: "Club Deal",
    minimumTicket: 2500000, // USD 2.5M
    confidentiality: "Strictly Confidential - NDA Required"
  },
  {
    id: 'om-002',
    title: "Mombasa Port Logistics Hub",
    asset_class: "Industrial/Logistics",
    location: "Mombasa, Kenya",
    location_detail: "Kipevu Free Trade Zone, 2km from Port",
    indicative_price: 18000000, // USD 18M
    price_kes: 2340000000,
    teaser: "Strategic logistics facility serving East African trade corridor. 45,000 sqm modern warehousing with cold storage capability and direct rail siding. Long-term lease to regional logistics operator with inflation-linked escalations.",
    status: "active",
    access_level: "verified",
    created_at: "2026-03-18",
    highlights: [
      "45,000 sqm with 12m eaves height",
      "Cold storage and rail siding",
      "15-year lease with CPI escalations",
      "Kipevu FTZ tax incentives",
      "Strategic port-adjacent location"
    ],
    metrics: {
      sqm: "45,000",
      leaseTerm: "15 years",
      yield: "9.5%",
      occupancy: "100%",
      tenant: "Regional Logistics"
    },
    structure: "SPV",
    minimumTicket: 500000, // USD 500K
    confidentiality: "Verified Investor Access"
  },
  {
    id: 'om-003',
    title: "Kigali Innovation City Land",
    asset_class: "Development Land",
    location: "Kigali, Rwanda",
    location_detail: "Kigali Innovation City Special Economic Zone",
    indicative_price: 8500000, // USD 8.5M
    price_kes: 1105000000,
    teaser: "Prime development land within government-backed technology and innovation district. 12 hectares with infrastructure completed (roads, power, fiber). Zoning permits mixed-use with density up to 4.0 FAR. Government co-investment and tax holidays available.",
    status: "under-offer",
    access_level: "premium",
    created_at: "2026-03-15",
    highlights: [
      "12 hectares in SEZ with full infrastructure",
      "4.0 FAR permitting 480,000 sqm GFA",
      "10-year tax holiday eligibility",
      "Government co-investment structures",
      "Tech sector demand from Kigali Heights"
    ],
    metrics: {
      hectares: "12",
      far: "4.0",
      gfaPotential: "480,000 sqm",
      taxHoliday: "10 years",
      infrastructure: "Complete"
    },
    structure: "Joint Venture",
    minimumTicket: 1500000, // USD 1.5M
    confidentiality: "Premium Tier - Strategic Opportunity"
  },
  {
    id: 'om-004',
    title: "Dar es Salaam Residential Portfolio",
    asset_class: "Residential/Multi-Family",
    location: "Dar es Salaam, Tanzania",
    location_detail: "Masaki and Oyster Bay prime nodes",
    indicative_price: 12000000, // USD 12M
    price_kes: 1560000000,
    teaser: "Portfolio of 48 luxury apartments across two buildings in Dar es Salaam's premier residential district. 85% occupancy with expatriate and diplomatic tenant base. NOI growth of 12% YoY driven by supply constraints in prime nodes.",
    status: "active",
    access_level: "verified",
    created_at: "2026-03-12",
    highlights: [
      "48 units across two prime buildings",
      "85% occupancy, 12% NOI growth",
      "Expatriate/diplomatic tenant base",
      "Masaki/Oyster Bay supply constraints",
      "Dollar-denominated lease potential"
    ],
    metrics: {
      units: "48",
      occupancy: "85%",
      noiGrowth: "12% YoY",
      yield: "8.2%",
      avgRent: "$2,400/unit"
    },
    structure: "Club Deal",
    minimumTicket: 750000, // USD 750K
    confidentiality: "Verified Access"
  }
]

export default function InvestorOffMarketPage() {
  const { data: { user, profile, deals, error } } = useSuspenseQuery(offMarketQuery)

  // Authentication check with styled message
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gold/20 p-12 max-w-md text-center">
          <Lock className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-forest mb-3">Authentication Required</h1>
          <p className="text-sm text-ink/70 mb-6 leading-relaxed">
            Off-market opportunities are visible only to verified investors. Please sign in to access confidential deal flow.
          </p>
          <Link 
            to="/portal" search={{ mode: "login" }} 
            className="inline-block bg-forest text-white px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
          >
            Sign In to Portal
          </Link>
        </div>
      </div>
    )
  }

  const isVerified = profile?.investor_status === 'verified' || profile?.investor_status === 'admin' || profile?.investor_status === 'premium'

  // Unauthorized view with upgrade path
  if (!isVerified) {
    return (
      <div className="space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-forest/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Off-Market Deal Room</span>
              <span className="text-gold/30">|</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-forest/50">Access Restricted</span>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl text-forest">Off-Market Opportunities</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-forest text-ivory p-8 lg:p-12 rounded-sm">
            <Lock className="h-10 w-10 text-gold mb-4" />
            <h2 className="font-serif text-3xl mb-4">Verified Investor Access Required</h2>
            <p className="text-ivory/70 leading-relaxed mb-6">
              Off-market opportunities are visible only to verified investors with demonstrated capacity 
              and commitment. These transactions represent the most exclusive tier of our deal flow, 
              requiring confidentiality protocols and sophisticated evaluation capabilities.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Direct Deal Flow</div>
                  <div className="text-sm text-ivory/60">Access to pre-market and off-market opportunities</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Co-Investment Rights</div>
                  <div className="text-sm text-ivory/60">Participate alongside Murivest and institutional partners</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Bespoke Structures</div>
                  <div className="text-sm text-ivory/60">SPVs, club deals, and sidecar vehicles tailored to requirements</div>
                </div>
              </div>
            </div>

            <SiteLink 
              href="/contact?subject=verification-request"
              className="inline-flex items-center gap-2 bg-gold text-forest px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-gold-deep transition-colors"
            >
              <Shield className="h-4 w-4" />
              Request Verification
            </SiteLink>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-forest">Access Tiers</h3>
            
            <div className="space-y-4">
              {Object.entries(offMarketIntelligence.accessCriteria).map(([key, tier]) => (
                <div key={key} className="bg-white border border-forest/10 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-gold mb-1">{tier.label}</div>
                      <div className="font-serif text-2xl text-forest">{tier.threshold}+</div>
                    </div>
                    <div className={`w-12 h-12 flex items-center justify-center ${
                      key === 'uhnwi' ? 'bg-gold/20' : 'bg-forest/5'
                    }`}>
                      <Users className={`h-6 w-6 ${
                        key === 'uhnwi' ? 'text-gold' : 'text-forest/40'
                      }`} />
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-ink/70">
                        <div className="w-1 h-1 bg-gold rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Use sample data if no database records
  const displayDeals: any[] = deals?.length ? deals : sampleDeals

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-forest/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Off-Market Deal Room</span>
            <span className="text-gold/30">|</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-forest/50">
              {displayDeals.filter(d => d.status === 'active').length} Active Opportunities
            </span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-forest">Off-Market Opportunities</h1>
          <p className="text-sm text-ink/70 mt-3 max-w-2xl leading-relaxed">
            Exclusive direct real estate opportunities not publicly marketed. According to Knight Frank, 
            30% of luxury transactions now occur off-market, with typical deal sizes averaging $18.6 million 
            as buyers prioritize privacy and qualified counterparty access [^45^].
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-1">Your Status</div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30">
              <Shield className="h-3 w-3 text-gold" />
              <span className="text-xs uppercase tracking-[0.15em] text-gold font-medium">
                {profile?.investor_status === 'premium' ? 'Premium Access' : 'Verified Investor'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Intelligence */}
      <section className="bg-forest text-ivory p-8 lg:p-12 rounded-sm">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-2">Global Intelligence</span>
          <h2 className="font-serif text-3xl mb-2">The Off-Market Advantage</h2>
          <p className="text-sm text-ivory/70 max-w-3xl">
            Off-market transactions offer exclusivity, privacy, and access to trophy assets unavailable through 
            public channels. Knight Frank data shows 555 mega-deals ($10M+) closed in Q4 2025, with liquidity 
            at the top remaining "surprisingly deep, but increasingly selective" [^45^].
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {offMarketIntelligence.globalStats.map((item, index) => (
            <div key={index} className="bg-white/5 border border-gold/20 p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-light text-gold mb-2">{item.stat}</div>
              <div className="text-xs uppercase tracking-wider text-white/80 mb-2">{item.label}</div>
              <p className="text-xs text-white/60 leading-relaxed mb-3">{item.description}</p>
              <div className="text-[10px] text-gold/70 uppercase tracking-wider">{item.source}</div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gold/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-sm text-ivory/70 max-w-2xl">
                <span className="text-white font-medium">Confidentiality Protocol:</span> All opportunities require 
                executed NDA before detailed disclosure. Proof of funds may be required for premium tier assets. 
                Deal flow is relationship-based; your reputation and track record determine access quality.
              </p>
            </div>
            <SiteLink 
              href="/contact?subject=nda-execution"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-gold hover:text-white transition-colors flex-shrink-0"
            >
              Execute NDA <ChevronRight className="h-3 w-3" />
            </SiteLink>
          </div>
        </div>
      </section>

      {/* Deal Structures */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-forest mb-1">Investment Structures</h2>
            <p className="text-xs text-ink/60">Flexible vehicles for co-investment and direct participation</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {offMarketIntelligence.dealStructures.map((structure, index) => (
            <div key={index} className="bg-white border border-forest/10 p-6 hover:border-gold/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Briefcase className="h-6 w-6 text-gold" />
                <span className="text-[10px] uppercase tracking-wider text-forest/50">{structure.adminLoad} Admin</span>
              </div>
              <h3 className="font-serif text-lg text-forest mb-2">{structure.type}</h3>
              <p className="text-sm text-ink/70 mb-3 leading-relaxed">{structure.description}</p>
              <div className="text-xs text-gold">
                <span className="font-medium">Best for:</span> {structure.bestFor}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Deals Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl text-forest mb-1">Current Opportunities</h2>
            <p className="text-xs text-ink/60">
              {displayDeals.filter(d => d.status === 'active').length} active | {displayDeals.filter(d => d.access_level === 'premium').length} premium tier
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Filter:</span>
            <select className="bg-white border border-forest/20 text-xs text-forest px-3 py-2 focus:border-gold focus:outline-none">
              <option>All Structures</option>
              <option>SPV</option>
              <option>Club Deal</option>
              <option>Joint Venture</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 text-red-700">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">System Error</span>
            </div>
            <p className="text-sm">Failed to load deals: {error.message}</p>
            <p className="text-xs mt-2 text-red-600/70">Displaying sample opportunities for demonstration</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayDeals.map((deal) => {
              const isPremium = deal.access_level === 'premium'
              const isUnderOffer = deal.status === 'under-offer'
              
              return (
                <div 
                  key={deal.id} 
                  className={`group bg-white border ${isPremium ? 'border-gold/30' : 'border-forest/10'} hover:border-gold/50 transition-all duration-300 flex flex-col`}
                >
                  {/* Card Header */}
                  <div className={`p-6 ${isPremium ? 'bg-gold/5' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-gold">
                          {deal.asset_class}
                        </span>
                        {isUnderOffer && (
                          <span className="text-[10px] uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1">
                            Under Offer
                          </span>
                        )}
                        {isPremium && (
                          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold bg-gold/10 px-2 py-1">
                            <Lock className="h-3 w-3" /> Premium
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 ${isPremium ? 'text-gold' : 'text-forest/40'}`}>
                        {isPremium ? <Lock className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="text-[10px] uppercase tracking-wider">{deal.access_level}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-forest group-hover:text-gold transition-colors mb-2">
                      {deal.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-ink/60 mb-4">
                      <MapPin className="h-4 w-4 text-gold" />
                      {deal.location_detail || deal.location}
                    </div>

                    <p className="text-sm text-ink/80 leading-relaxed line-clamp-3 mb-4">
                      {deal.teaser}
                    </p>

                    {/* Quick Metrics */}
                    {deal.metrics && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {Object.entries(deal.metrics).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="bg-ivory p-2 text-center">
                            <div className="text-xs font-medium text-forest">{String(value)}</div>
                            <div className="text-[10px] text-forest/50 uppercase tracking-wider">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Highlights */}
                    {deal.highlights && (
                        <div className="space-y-1">
                        {(deal.highlights as string[]).slice(0, 3).map((highlight: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-ink/70">
                          <CheckCircle2 className="h-3 w-3 text-gold mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                          </div>
                        ))}
                        </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-auto p-6 pt-4 border-t border-forest/5 flex items-center justify-between bg-ivory/50">
                    <div>
                      <div className="text-xs text-forest/50 mb-1">Indicative Price</div>
                      <div className="font-serif text-xl text-forest">
                        ${deal.indicative_price ? (deal.indicative_price / 1000000).toFixed(1) + 'M' : 'Contact'}
                        <span className="text-xs text-forest/50 ml-2">
                          ({deal.price_kes ? (deal.price_kes / 1000000000).toFixed(1) + 'B KES' : 'Price on request'})
                        </span>
                      </div>
                      {deal.minimumTicket && (
                        <div className="text-[10px] text-gold mt-1">
                          Min. Ticket: ${(deal.minimumTicket / 1000000).toFixed(1)}M
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to="/portal/enquiries"
                        search={{ subject: `Off-market enquiry: ${deal.title}` }}
                        className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors"
                      >
                        View Details
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Confidentiality Notice */}
                  {deal.confidentiality && (
                    <div className="px-6 py-2 bg-amber-50 border-t border-amber-100">
                      <p className="text-[10px] text-amber-700 flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        {deal.confidentiality}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {displayDeals.length === 0 && (
          <div className="bg-ivory border border-gold/20 p-12 text-center">
            <Briefcase className="h-12 w-12 text-gold/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-forest mb-2">No Active Opportunities</h3>
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

      {/* Co-Investment Philosophy */}
      <section className="bg-ivory border border-gold/20 p-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-2xl text-forest">Co-Investment Philosophy</h2>
            </div>
            <div className="space-y-4 text-sm text-ink/80 leading-relaxed">
              <p>
                According to PwC's Global Family Office Deals Study 2025, family offices are increasingly 
                engaging in direct investments and co-investments to enhance deal flow through partnerships 
                with funds and other investors [^89^]. This approach not only diversifies portfolios but also 
                strengthens investment networks.
              </p>
              <p>
                Co-investing allows selectivity, fee efficiency, and access, but shifts real work to the 
                investor: structuring, diligence, funding mechanics, and repeatable reporting [^81^]. Murivest 
                manages this operational complexity, enabling family offices to participate with confidence.
              </p>
              <p>
                The "best" structure depends on your constraints. SPVs provide clean isolation, club deals 
                enable larger checks with shared diligence, and sidecars offer repeat access with one setup [^81^].
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-forest mb-4">Why Co-Invest With Murivest?</h3>
            
            <div className="flex items-start gap-4 p-4 bg-white border border-forest/10">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-forest mb-1">Proven Track Record</h4>
                <p className="text-xs text-ink/70">
                  $340M developed across 12 projects with 18.2% realized IRR. Operational capability 
                  de-risks execution.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white border border-forest/10">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-forest mb-1">Network Access</h4>
                <p className="text-xs text-ink/70">
                  Relationships with estate attorneys, wealth managers, and family office principals 
                  provide 2-5 year advance visibility on opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white border border-forest/10">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-forest mb-1">Alignment of Interests</h4>
                <p className="text-xs text-ink/70">
                  Significant co-investment by Murivest principals on every transaction. No deal fees—
                  compensation solely through performance-based carried interest.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white border border-forest/10">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-forest mb-1">Operational Efficiency</h4>
                <p className="text-xs text-ink/70">
                  Established SPV structures, standardized diligence processes, and quarterly reporting 
                  cadence reduce administrative burden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 border-t border-forest/10">
        <h3 className="font-serif text-2xl text-forest mb-3">Require Bespoke Deal Sourcing?</h3>
        <p className="text-sm text-ink/70 max-w-2xl mx-auto mb-6">
          Murivest undertakes custom sourcing for institutional clients with specific sector, geographic, 
          or return requirements. Our team maintains active networks across East Africa's property markets 
          and can identify off-market opportunities aligned with your investment criteria.
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
            to="/portal/briefs"
            className="inline-flex items-center gap-2 border-2 border-forest text-forest px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest hover:text-white transition-all"
          >
            <FileText className="h-4 w-4" />
            View Investment Briefs
          </Link>
        </div>
      </section>
    </div>
  )
}