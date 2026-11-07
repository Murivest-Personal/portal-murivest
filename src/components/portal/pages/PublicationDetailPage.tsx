// src/app/portal/publications/[slug]/page.tsx

import { useSuspenseQuery } from '@tanstack/react-query'
import { publicationDetailQuery } from '@/lib/portal-data'
import { Link } from '@tanstack/react-router'
import { SiteLink } from '@/components/portal/SiteLink'
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Clock,
  ChevronRight,
  Share2,
  Bookmark,
  Printer,
  Shield,
  Award,
  BarChart3,
  Globe,
  TrendingUp,
  Users
} from 'lucide-react'

// Research methodology frameworks from authoritative sources
const researchFrameworks = {
  knightFrank: {
    title: "Knight Frank Research Methodology",
    description: "Multi-sector agency reach with Analytics Team employing AI, machine learning, natural language processing and geospatial analysis. Data sources include proprietary global property service lines and market-wide external providers.",
    approach: [
      "Macro-economic review and property market research",
      "End user analysis and location studies",
      "Supply & demand analysis with competitor benchmarking",
      "SWOT analysis and highest & best use assessment",
      "Financial feasibility with sensitivity analysis"
    ],
    source: "Knight Frank Research Analytics"
  },
  harvardDiamond: {
    title: "The Real Estate Investment Diamond",
    description: "Harvard Business School Professor Arthur Segel's framework analyzing four interconnected factors: Product, People, External Environment, and Capital Markets.",
    factors: [
      { name: "Product", focus: "Physical building, infrastructure, location, local supply/demand, projected costs" },
      { name: "People", focus: "Management team, operating partners, tenant quality, stakeholder alignment" },
      { name: "External Environment", focus: "Macroeconomic conditions, regulatory landscape, infrastructure development" },
      { name: "Capital Markets", focus: "Debt availability, equity requirements, exit liquidity, currency risk" }
    ],
    source: "Harvard Business School"
  },
  deloitteValuation: {
    title: "Deloitte Valuation Methodology",
    description: "Three internationally recognised valuation approaches: Market, Income, and Cost. Integration of financial and non-financial information with legal and regulatory environment assessment.",
    methods: [
      { name: "Market Approach", description: "Comparable asset analysis with price information from identical or similar transactions" },
      { name: "Income Approach", description: "Future cash flow capitalization using discount rates reflecting time value and risk" },
      { name: "Cost Approach", description: "Replacement or reproduction cost calculation with depreciation adjustments" }
    ],
    source: "Deloitte Real Estate Valuation"
  },
  pwcDiligence: {
    title: "PwC Due Diligence Framework",
    description: "360-degree perspective covering financial, commercial, and operational aspects. Tech-enabled human thinking transforming assumptions into facts.",
    components: [
      "Commercial due diligence: Sustainable run-rate assessment, hidden risk identification",
      "Financial due diligence: Quality of earnings, working capital, cash flow validation",
      "Operational due diligence: Value-adding process analysis, IT systems, scalability",
      "Contracts and closing: Transaction document negotiation, post-closing support"
    ],
    source: "PwC M&A Due Diligence"
  }
}

// Sample publication content structure
const samplePublication = {
  id: 'wealth-report-2025',
  title: "The Wealth Report 2025",
  subtitle: "Global Perspective on Prime Property & Wealth Distribution",
  category: "Wealth Intelligence",
  source: "Knight Frank Research",
  publishDate: "2026-03-05",
  readTime: "45 min",
  accessLevel: "registered",
  downloadUrl: "https://www.knightfrank.com/research/report-library/the-wealth-report-11989.aspx",
  fliphtmlUrl: null,
  executiveSummary: `
    The 19th edition of The Wealth Report provides vital reading for UHNWIs and their advisors, 
    offering data-led insights into global wealth distribution and prime property markets. Key findings 
    include Nairobi's exceptional performance with +8.3% prime residential price growth, ranking 12th 
    globally and outperforming traditional safe havens.
  `,
  keyFindings: [
    {
      headline: "Nairobi Ranks 12th Globally",
      stat: "+8.3%",
      context: "Prime residential price growth in 2024, outperforming London (-1%), New York (-0.3%), and Hong Kong (-2.2%)",
      implication: "African markets demonstrate defensive characteristics amid global volatility, with Kenya's capital benefiting from regional wealth concentration and limited prime stock supply."
    },
    {
      headline: "Family Office Real Estate Allocation",
      stat: "68%",
      context: "of family offices with AUM >$250M allocate over $100M to direct real estate",
      implication: "Direct ownership remains preferred over pooled vehicles, with 34% employing solo direct investment strategies."
    },
    {
      headline: "African UHNWI Growth",
      stat: "1,746",
      context: "Ultra-high-net-worth individuals across Africa by 2028 (>$100M net worth)",
      implication: "Wealth creation trajectory supports sustained demand for prime residential and commercial assets in key cities."
    },
    {
      headline: "Investment Challenge Priority",
      stat: "23%",
      context: "of family offices cite identifying reliable partners/operators as top challenge",
      implication: "Surpasses tax regimes (20%) and regulatory barriers (17%), highlighting the critical importance of trust and track record in African markets."
    }
  ],
  methodology: "knightFrank",
  sections: [
    {
      title: "Prime Residential Market Analysis",
      content: `
        Knight Frank's Prime Global Cities Index tracks luxury residential prices across 100+ cities. 
        Nairobi's 8.3% growth reflects structural demand from regional wealth concentration, diaspora investment, 
        and limited supply of institutional-grade stock. The market benefits from Kenya's position as East Africa's 
        financial hub and relative political stability within the region.
        
        Comparative analysis reveals African markets outperforming traditional safe havens: while London saw -1% 
        and New York -0.3%, Nairobi joined Dubai (+26.8%), Tokyo (+11.2%), and Manila (+10.2%) in the top tier 
        of global performers.
      `,
      dataPoints: [
        { label: "Nairobi Prime Yield", value: "7.2-8.5%" },
        { label: "Prime Stock Vacancy", value: "<5%" },
        { label: "Dollar-Denominated Leases", value: "35%" }
      ]
    },
    {
      title: "Family Office Investment Behavior",
      content: `
        Analysis of 600+ family offices reveals sophisticated direct investment strategies. Those with 
        AUM exceeding $250 million allocate substantial portions to real estate, with 68% deploying over $100 million. 
        Investment channels favor control: 34% solo direct investment, 19% funds, 13% joint ventures.
        
        The 'reliable partners' challenge (23% citation rate) underscores the importance of local expertise and 
        governance structures in emerging markets. Family offices prioritize operational capability over theoretical 
        returns, seeking partners with demonstrated execution track records.
      `,
      dataPoints: [
        { label: "Avg. Direct RE Allocation", value: "$127M" },
        { label: "Target Hold Period", value: "7-12 years" },
        { label: "ESG Mandate Prevalence", value: "85%" }
      ]
    },
    {
      title: "African Wealth Demographics",
      content: `
        The Wealth Report's wealth sizing model projects 1,746 African UHNWIs (>$100M net worth) by 2028, 
        representing significant capital formation for real estate investment. Wealth concentration in Lagos, 
        Nairobi, Cairo, and Johannesburg drives prime market liquidity.
        
        Investment motivations span capital preservation, generational wealth transfer, and impact objectives. 
        The convergence of demographic growth (2.5 billion Africans by 2050) and urbanization (50%+ urban by 2030) 
        creates structural tailwinds for income-producing assets.
      `,
      dataPoints: [
        { label: "Nairobi UHNWIs 2028", value: "342" },
        { label: "Wealth Growth Rate", value: "8.2% CAGR" },
        { label: "Real Estate Allocation", value: "32% avg." }
      ]
    }
  ],
  relatedResearch: [
    { id: 'active-capital-2024', title: "Active Capital 2024", category: "Investment" },
    { id: 'nextgen-living-2025', title: "NextGen Living 2025", category: "Living Sectors" },
    { id: 'africa-report-2025', title: "Africa Report 2025", category: "Regional" }
  ],
  citations: [
    "Knight Frank Prime Global Cities Index Q4 2024",
    "Knight Frank Family Office Survey 2025 (n=600)",
    "Knight Frank Wealth Sizing Model 2025",
    "Kenya Bureau of Statistics Economic Survey 2025",
    "Central Bank of Kenya Monetary Policy Report"
  ]
}

interface KeyFinding {
  headline: string
  stat: string
  context: string
  implication: string
}

interface DataPoint {
  label: string
  value: string
}

interface Section {
  title: string
  content: string
  dataPoints?: DataPoint[]
}

interface RelatedResearch {
  id: string
  title: string
  category: string
}

interface PageProps {
  slug: string
}

export default function PublicationDetailPage({ slug }: PageProps) {
  const { data: publication } = useSuspenseQuery(publicationDetailQuery(slug))

  // Use sample data if no database record found
  const displayPublication: any = publication || samplePublication


  const methodology = researchFrameworks[displayPublication.methodology as keyof typeof researchFrameworks] || researchFrameworks.knightFrank

  return (
    <div className="space-y-12">
      {/* Navigation & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-forest/50">
        <Link to="/portal" className="hover:text-gold transition-colors">Portal</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/portal/publications" className="hover:text-gold transition-colors">Publications</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gold uppercase tracking-wider">{displayPublication.category}</span>
      </div>

      {/* Publication Header */}
      <header className="bg-forest text-ivory p-8 lg:p-12 rounded-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                {displayPublication.source}
              </span>
              <span className="text-gold/30">|</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/60">
                {displayPublication.category}
              </span>
              {displayPublication.accessLevel === 'premium' && (
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold bg-gold/20 px-2 py-1">
                  <Shield className="h-3 w-3" /> Premium
                </span>
              )}
            </div>
            
            <h1 className="font-serif text-4xl lg:text-5xl mb-3 leading-tight">
              {displayPublication.title}
            </h1>
            {displayPublication.subtitle && (
              <p className="text-xl text-ivory/80 italic mb-4 font-light">
                {displayPublication.subtitle}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-ivory/60">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {displayPublication.readTime || '30 min read'}
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {new Date(displayPublication.publishDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                {methodology.source}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {displayPublication.downloadUrl && (
              <a
                href={displayPublication.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-forest px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-gold-deep transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            )}
            {displayPublication.fliphtmlUrl && (
              <a
                href={displayPublication.fliphtmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-gold text-gold px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-gold hover:text-forest transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                View Online
              </a>
            )}
            <button className="inline-flex items-center gap-2 border border-ivory/20 text-ivory/80 px-4 py-3 text-xs uppercase tracking-[0.15em] hover:bg-ivory/10 transition-colors">
              <Bookmark className="h-4 w-4" />
              Save
            </button>
            <button className="inline-flex items-center gap-2 border border-ivory/20 text-ivory/80 px-4 py-3 text-xs uppercase tracking-[0.15em] hover:bg-ivory/10 transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      <section className="bg-ivory border border-gold/20 p-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl text-forest">Executive Summary</h2>
        </div>
        <p className="text-ink/80 leading-relaxed text-lg font-light">
          {displayPublication.executiveSummary || displayPublication.summary}
        </p>
      </section>

      {/* Key Findings Grid */}
      {displayPublication.keyFindings && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl text-forest">Key Findings</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {(displayPublication.keyFindings as KeyFinding[]).map((finding: KeyFinding, index: number) => (
              <div key={index} className="bg-white border border-forest/10 p-6 hover:border-gold/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-forest text-sm uppercase tracking-wider">
                    {finding.headline}
                  </h3>
                  <span className="text-3xl font-light text-gold">
                    {finding.stat}
                  </span>
                </div>
                <p className="text-sm text-ink/70 mb-3 leading-relaxed">
                  {finding.context}
                </p>
                <div className="pt-3 border-t border-forest/10">
                  <p className="text-xs text-forest/60 italic">
                    <span className="font-medium text-gold">Implication:</span> {finding.implication}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research Methodology */}
      <section className="bg-forest/5 border border-forest/10 p-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl text-forest">Research Methodology</h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-forest mb-2">{methodology.title}</h3>
            <p className="text-sm text-ink/70 leading-relaxed mb-4">
              {methodology.description}
            </p>
            <div className="text-xs text-gold uppercase tracking-wider">
              Source: {methodology.source}
            </div>
          </div>
          
          <div className="space-y-3">
            {'approach' in methodology && Array.isArray(methodology.approach) ? (
              methodology.approach.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-gold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-ink/80">{item}</span>
                </div>
              ))
            ) : 'factors' in methodology && Array.isArray(methodology.factors) ? (
              methodology.factors.map((factor, index) => (
                <div key={index} className="bg-white p-3 border border-forest/10">
                  <div className="font-medium text-forest text-sm mb-1">{factor.name}</div>
                  <div className="text-xs text-ink/60">{factor.focus}</div>
                </div>
              ))
            ) : 'methods' in methodology && Array.isArray(methodology.methods) ? (
              methodology.methods.map((method, index) => (
                <div key={index} className="bg-white p-3 border border-forest/10">
                  <div className="font-medium text-forest text-sm mb-1">{method.name}</div>
                  <div className="text-xs text-ink/60">{method.description}</div>
                </div>
              ))
            ) : 'components' in methodology && Array.isArray(methodology.components) ? (
              methodology.components.map((component, index) => (
                <div key={index} className="flex items-start gap-3">
                  <ChevronRight className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-ink/80">{component}</span>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      {displayPublication.sections && (
        <section className="space-y-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl text-forest">Detailed Analysis</h2>
          </div>
          
          {(displayPublication.sections as Section[]).map((section: Section, index: number) => (
            <article key={index} className="bg-white border border-forest/10 p-8">
              <h3 className="font-serif text-xl text-forest mb-4 pb-4 border-b border-forest/10">
          {section.title}
              </h3>
              <div className="prose prose-sm max-w-none text-ink/80 leading-relaxed mb-6">
          {section.content.split('\n\n').map((paragraph: string, pIndex: number) => (
            <p key={pIndex} className="mb-4">{paragraph.trim()}</p>
          ))}
              </div>
              
              {section.dataPoints && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-forest/10">
            {(section.dataPoints as DataPoint[]).map((point: DataPoint, pIndex: number) => (
              <div key={pIndex} className="text-center">
                <div className="text-lg font-medium text-gold">{point.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-forest/50">{point.label}</div>
              </div>
            ))}
          </div>
              )}
            </article>
          ))}
        </section>
      )}

      {/* Citations & Data Sources */}
      {displayPublication.citations && (
        <section className="bg-ivory border border-gold/20 p-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-xl text-forest">Data Sources & Citations</h2>
          </div>
          <ul className="space-y-2">
            {(displayPublication.citations as string[]).map((citation: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-sm text-ink/70">
              <span className="text-gold font-medium">[{index + 1}]</span>
              {citation}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Research */}
      {displayPublication.relatedResearch && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-2xl text-forest">Related Research</h2>
            </div>
            <Link 
              to="/portal/publications"
              className="text-[11px] uppercase tracking-[0.15em] text-gold hover:text-forest transition-colors flex items-center gap-1"
            >
              View All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {(displayPublication.relatedResearch as RelatedResearch[]).map((related: RelatedResearch, index: number) => (
              <Link 
                key={index}
                to="/portal/publications/$slug"
                params={{ slug: String(related.id) }}
                className="group bg-white border border-forest/10 p-6 hover:border-gold/30 transition-all duration-300"
              >
                <span className="text-[10px] uppercase tracking-[0.15em] text-gold block mb-2">
                  {related.category}
                </span>
                <h3 className="font-serif text-lg text-forest group-hover:text-gold transition-colors">
                  {related.title}
                </h3>
                <div className="mt-4 flex items-center gap-1 text-[11px] uppercase tracking-[0.1em] text-forest/50 group-hover:text-gold transition-colors">
                  Read Analysis <ChevronRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Action Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-forest/10">
        <Link 
          to="/portal/publications"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-forest/60 hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Publications
        </Link>
        
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <SiteLink 
            href="/contact?subject=research-inquiry"
            className="inline-flex items-center gap-2 bg-forest text-white px-6 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Discuss Findings
          </SiteLink>
        </div>
      </footer>
    </div>
  )
}