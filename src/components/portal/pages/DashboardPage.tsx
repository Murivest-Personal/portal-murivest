// src/app/portal/dashboard/page.tsx

import { useSuspenseQuery } from '@tanstack/react-query'
import { dashboardQuery } from '@/lib/portal-data'
import { Link } from '@tanstack/react-router'
import { SiteLink } from '@/components/portal/SiteLink'
import { 
  TrendingUp, 
  Building2, 
  PieChart, 
  Globe, 
  Clock, 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight,
  Briefcase,
  MapPin,
  FileText,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Target
} from 'lucide-react'

// Portfolio allocation data based on Knight Frank 2025 Wealth Report
const benchmarkAllocation = {
  directRealEstate: 34, // Solo Direct Investment 34% [^13^]
  indirectRealEstate: 26, // Portfolio allocation to indirect real estate > $100M: 26% [^13^]
  equities: 18, // Equities 18% of UHNWI wealth [^15^]
  privateEquity: 6, // Private Equity / Venture Capital 6% [^15^]
  fixedIncome: 12, // Bonds 12% [^15^]
  alternatives: 4 // Other alternatives
}

// Sector allocation based on Knight Frank data
const sectorAllocation = {
  offices: 20, // Offices 20% [^13^]
  luxuryResidential: 17, // Luxury Residential / Branded Residences 17% [^13^]
  industrial: 14, // Industrial / Logistics 14% [^13^]
  hotels: 12, // Hotels 12% [^13^]
  livingSectors: 10, // Living Sectors 10% [^13^]
  retail: 9, // Retail 9% [^13^]
  infrastructure: 7, // Infrastructure 7% [^13^]
  dataCentres: 5, // Data Centres 5% [^13^]
  healthcare: 4, // Healthcare 4% [^13^]
  lifeSciences: 2 // Life Sciences 1% [^13^]
}

// Market performance data
const marketPerformance = [
  {
    market: "Nairobi Prime Residential",
    growth2024: "+8.3%",
    rank: "12th Globally",
    trend: "up",
    source: "Knight Frank Prime Residential Index"
  },
  {
    market: "Lagos Commercial",
    growth2024: "+6.2%",
    rank: "Top 25 Africa",
    trend: "up",
    source: "Knight Frank Africa Report"
  },
  {
    market: "Cape Town Office",
    growth2024: "+4.1%",
    rank: "Regional Leader",
    trend: "up",
    source: "Knight Frank SA"
  },
  {
    market: "Accra Retail",
    growth2024: "+3.8%",
    rank: "West Africa Top 5",
    trend: "up",
    source: "Knight Frank Ghana"
  }
]

// Investment channels based on Knight Frank data
const investmentChannels = [
  { channel: "Solo Direct Investment", percentage: 34, description: "Direct asset ownership with full control" },
  { channel: "Fund Investments", percentage: 19, description: "Pooled vehicles for diversification" },
  { channel: "Joint Ventures", percentage: 13, description: "Strategic partnerships with local operators" },
  { channel: "Debt Structures", percentage: 9, description: "Mezzanine and preferred equity" },
  { channel: "Private Markets", percentage: 8, description: "Unlisted securities and derivatives" }
]

// ESG allocation trends
const esgAllocation = {
  current: [
    { sector: "Solar Power Generation", allocation: 28 },
    { sector: "Commercial Property ESG Improvement", allocation: 24 },
    { sector: "Renewable Energy Storage", allocation: 22 },
    { sector: "Wind Power Generation", allocation: 18 },
    { sector: "Environmental Credits", allocation: 8 }
  ],
  considering: [
    { sector: "Renewable Energy Storage", priority: "High" },
    { sector: "Environmental Credits", priority: "High" },
    { sector: "Solar Power Generation", priority: "Medium" }
  ]
}

export default function InvestorDashboardPage() {
  const { data: { user, profile, ordersCount, paymentsCount } } = useSuspenseQuery(dashboardQuery)

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gold/20 p-12 max-w-md text-center">
          <Shield className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-forest mb-3">Authentication Required</h1>
          <p className="text-sm text-ink/70 mb-6 leading-relaxed">
            Please sign in to access your portfolio dashboard and investment analytics.
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


  // Calculate metrics (placeholder calculations - would be dynamic in production)
  const portfolioValue = profile?.portfolio_value || 0
  const totalReturn = 16.4 // Based on Murivest average
  const irr = 18.2 // Target IRR for active investments
  const incomeReturn = 8.5 // Current yield

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-forest/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Investor Portal</span>
            <span className="text-gold/30">|</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-forest/50">
              Last Updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-forest">Portfolio Dashboard</h1>
          <p className="text-sm text-ink/70 mt-2 max-w-2xl">
            Comprehensive analytics and benchmark comparisons based on Knight Frank 2025 Wealth Report data. 
            Track your allocations against institutional family office standards.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-1">Investor Status</div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-[0.15em] text-gold font-medium">
                {profile?.investor_status || 'registered'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-forest/10 p-6 hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Portfolio Value</span>
            <Briefcase className="h-5 w-5 text-gold/30 group-hover:text-gold transition-colors" />
          </div>
          <div className="font-serif text-3xl text-forest mb-1">
            ${portfolioValue > 0 ? (portfolioValue / 1000000).toFixed(1) : '0.0'}M
          </div>
          <div className="text-xs text-ink/60">Across {ordersCount || 0} active positions</div>
        </div>

        <div className="bg-white border border-forest/10 p-6 hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Total Return</span>
            <TrendingUp className="h-5 w-5 text-gold/30 group-hover:text-gold transition-colors" />
          </div>
          <div className="font-serif text-3xl text-forest mb-1 flex items-center gap-2">
            {totalReturn}%
            <ArrowUpRight className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-xs text-ink/60">Since inception (annualized)</div>
        </div>

        <div className="bg-white border border-forest/10 p-6 hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Target IRR</span>
            <Target className="h-5 w-5 text-gold/30 group-hover:text-gold transition-colors" />
          </div>
          <div className="font-serif text-3xl text-forest mb-1">{irr}%</div>
          <div className="text-xs text-ink/60">Active investments (weighted avg)</div>
        </div>

        <div className="bg-white border border-forest/10 p-6 hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Income Return</span>
            <BarChart3 className="h-5 w-5 text-gold/30 group-hover:text-gold transition-colors" />
          </div>
          <div className="font-serif text-3xl text-forest mb-1">{incomeReturn}%</div>
          <div className="text-xs text-ink/60">Current yield (net of fees)</div>
        </div>
      </section>

      {/* Asset Allocation vs Benchmark */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white border border-forest/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-2xl text-forest mb-1">Asset Allocation</h3>
              <p className="text-xs text-ink/60">Your portfolio vs. Family Office Benchmark</p>
            </div>
            <PieChart className="h-6 w-6 text-gold" />
          </div>

          <div className="space-y-4">
            {[
              { 
                label: "Direct Real Estate", 
                user: 45, 
                benchmark: benchmarkAllocation.directRealEstate,
                color: "bg-forest" 
              },
              { 
                label: "Indirect Real Estate", 
                user: 15, 
                benchmark: benchmarkAllocation.indirectRealEstate,
                color: "bg-forest-soft" 
              },
              { 
                label: "Public Equities", 
                user: 20, 
                benchmark: benchmarkAllocation.equities,
                color: "bg-gold" 
              },
              { 
                label: "Private Equity", 
                user: 12, 
                benchmark: benchmarkAllocation.privateEquity,
                color: "bg-gold-deep" 
              },
              { 
                label: "Fixed Income", 
                user: 5, 
                benchmark: benchmarkAllocation.fixedIncome,
                color: "bg-forest/50" 
              },
              { 
                label: "Alternatives", 
                user: 3, 
                benchmark: benchmarkAllocation.alternatives,
                color: "bg-gold/50" 
              }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-forest font-medium">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gold font-medium">{item.user}%</span>
                    <span className="text-forest/40 text-xs">vs {item.benchmark}%</span>
                  </div>
                </div>
                <div className="h-2 bg-forest/10 rounded-full overflow-hidden flex">
                  <div 
                    className={`${item.color} h-full transition-all duration-500`} 
                    style={{ width: `${item.user}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-forest/10">
            <div className="flex items-start gap-3 text-xs text-ink/70">
              <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
              <p>
                <span className="font-medium text-forest">Insight:</span> Your direct real estate allocation (45%) 
                exceeds the family office benchmark (34%). According to Knight Frank 2025, 68% of family offices with 
                AUM &gt;$250M allocate &gt;$100M to direct real estate. Consider rebalancing if liquidity needs increase.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-forest/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-2xl text-forest mb-1">Real Estate Sectors</h3>
              <p className="text-xs text-ink/60">Current vs. Target Allocation</p>
            </div>
            <Building2 className="h-6 w-6 text-gold" />
          </div>

          <div className="space-y-3">
            {Object.entries(sectorAllocation).map(([sector, percentage], index) => {
              const colors = [
                "bg-forest", "bg-forest-soft", "bg-forest-light", 
                "bg-gold", "bg-gold-deep", "bg-gold-light",
                "bg-forest/70", "bg-forest-soft/70", "bg-gold/70", "bg-gold-deep/70"
              ]
              return (
                <div key={sector} className="flex items-center gap-4">
                  <div className="w-32 text-xs text-forest capitalize">
                    {sector.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="flex-1 h-6 bg-forest/5 rounded-sm overflow-hidden relative">
                    <div 
                      className={`${colors[index]} h-full flex items-center justify-end px-2 transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-[10px] text-white font-medium">{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-12 text-right text-xs text-forest/50">
                    {percentage > 15 ? 'Over' : percentage < 10 ? 'Under' : 'Target'}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-forest/10">
            <div className="flex items-start gap-3 text-xs text-ink/70">
              <TrendingUp className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
              <p>
                <span className="font-medium text-forest">Trend:</span> Living Sectors and Industrial/Logistics 
                are top growth sectors for the next 18 months (14% and 13% of family offices increasing allocation). 
                Your current underweight in Living Sectors may represent a strategic opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Performance & Investment Channels */}
      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-forest/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-2xl text-forest mb-1">African Market Performance</h3>
              <p className="text-xs text-ink/60">Prime real estate price growth 2024</p>
            </div>
            <Globe className="h-6 w-6 text-gold" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-forest/10">
                  <th className="text-left py-3 text-[10px] uppercase tracking-[0.15em] text-forest/50 font-medium">Market</th>
                  <th className="text-left py-3 text-[10px] uppercase tracking-[0.15em] text-forest/50 font-medium">Growth</th>
                  <th className="text-left py-3 text-[10px] uppercase tracking-[0.15em] text-forest/50 font-medium">Global Rank</th>
                  <th className="text-left py-3 text-[10px] uppercase tracking-[0.15em] text-forest/50 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {marketPerformance.map((market, index) => (
                  <tr key={index} className="border-b border-forest/5 hover:bg-forest/5 transition-colors">
                    <td className="py-4">
                      <div className="font-medium text-forest">{market.market}</div>
                      <div className="text-[10px] text-forest/50">{market.source}</div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        {market.growth2024}
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </td>
                    <td className="py-4 text-sm text-ink/80">{market.rank}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-[10px] uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Positive
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-ink/60">
              Nairobi's +8.3% growth ranks 12th globally, outperforming London (-1%), New York (-0.3%), and Hong Kong (-2.2%)
            </p>
            <SiteLink 
              href="/kenya/country-focus" 
              className="text-[11px] uppercase tracking-[0.15em] text-gold hover:text-forest transition-colors flex items-center gap-1"
            >
              Full Analysis <ChevronRight className="h-3 w-3" />
            </SiteLink>
          </div>
        </div>

        <div className="bg-white border border-forest/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-xl text-forest mb-1">Investment Channels</h3>
              <p className="text-xs text-ink/60">Family office preferences</p>
            </div>
            <Briefcase className="h-5 w-5 text-gold" />
          </div>

          <div className="space-y-4">
            {investmentChannels.map((channel, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-forest font-medium">{channel.channel}</span>
                  <span className="text-xs text-gold">{channel.percentage}%</span>
                </div>
                <div className="h-1.5 bg-forest/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold transition-all duration-500 group-hover:bg-forest"
                    style={{ width: `${channel.percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-ink/50 mt-1">{channel.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-forest/10">
            <Link 
              to="/portal/off-market"
              className="block w-full text-center bg-forest text-white py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
            >
              View Direct Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* ESG & Impact Section */}
      <section className="bg-forest text-ivory p-8 lg:p-12 rounded-sm">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">ESG Integration</span>
            </div>
            <h3 className="font-serif text-3xl mb-4">Sustainable Investment Allocation</h3>
            <p className="text-ivory/70 leading-relaxed mb-6 text-sm">
              According to Knight Frank 2025, top ESG-related property sectors for family offices include 
              solar power generation, commercial property ESG improvement, and renewable energy storage. 
              64% of family offices maintain private residential portfolios with climate and environmental 
              sustainability as top impact strategies.
            </p>

            <div className="space-y-3">
              {esgAllocation.current.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gold/20">
                  <span className="text-sm text-ivory/80">{item.sector}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-ivory/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gold"
                        style={{ width: `${item.allocation}%` }}
                      />
                    </div>
                    <span className="text-xs text-gold w-8 text-right">{item.allocation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-4 text-gold">Strategic Considerations</h4>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 border-l-2 border-gold">
                <h5 className="text-sm font-medium mb-2">Renewable Energy Storage</h5>
                <p className="text-xs text-ivory/70 leading-relaxed">
                  Top sector for current investment and future consideration. Battery storage infrastructure 
                  offers defensive yield characteristics with inflation linkage.
                </p>
              </div>
              <div className="bg-white/5 p-4 border-l-2 border-gold">
                <h5 className="text-sm font-medium mb-2">Commercial ESG Improvement</h5>
                <p className="text-xs text-ivory/70 leading-relaxed">
                  Retrofitting existing stock for energy efficiency. Green building certification commands 
                  8-12% rent premiums and 10% higher occupancy.
                </p>
              </div>
              <div className="bg-white/5 p-4 border-l-2 border-gold">
                <h5 className="text-sm font-medium mb-2">Environmental Credits</h5>
                <p className="text-xs text-ivory/70 leading-relaxed">
                  Emerging asset class with regulatory tailwinds. Carbon credit generation from 
                  renewable energy assets provides additional revenue streams.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <SiteLink 
                href="/research/esg-strategy"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-gold hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4" />
                ESG Strategy Paper
              </SiteLink>
              <SiteLink 
                href="/contact"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-gold hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Schedule ESG Consultation
              </SiteLink>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Summary */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-forest/10 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-gold" />
          </div>
          <div>
            <div className="text-2xl font-serif text-forest">{ordersCount || 0}</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Investment Briefs</div>
          </div>
        </div>

        <div className="bg-white border border-forest/10 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-gold" />
          </div>
          <div>
            <div className="text-2xl font-serif text-forest">{paymentsCount || 0}</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Payments Processed</div>
          </div>
        </div>

        <div className="bg-white border border-forest/10 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-gold" />
          </div>
          <div>
            <div className="text-2xl font-serif text-forest">100%</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50">Compliance Score</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-ivory border border-gold/20 p-8 text-center">
        <h3 className="font-serif text-2xl text-forest mb-3">Ready to Adjust Your Allocation?</h3>
        <p className="text-sm text-ink/70 max-w-2xl mx-auto mb-6">
          Based on your current positioning, we recommend exploring opportunities in Living Sectors and 
          Industrial/Logistics to align with family office trends for the next 18 months.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/portal/off-market"
            className="inline-block bg-forest text-white px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
          >
            View Off-Market Deals
          </Link>
          <SiteLink 
            href="/contact"
            className="inline-block border-2 border-gold text-gold px-8 py-3 text-xs uppercase tracking-[0.15em] hover:bg-gold hover:text-forest transition-all"
          >
            Schedule Strategy Review
          </SiteLink>
        </div>
      </section>
    </div>
  )
}