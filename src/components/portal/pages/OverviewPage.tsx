import { useEffect, useState } from 'react'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { SiteLink } from '@/components/portal/SiteLink'
import { supabase } from '@/integrations/supabase/client'
import { overviewQuery } from '@/lib/portal-data'
import {
  Shield,
  Eye,
  EyeOff,
  Building2,
  FileText,
  Download,
  TrendingUp,
  MapPin,
  LogOut,
  Lock,
  Clock,
  Award,
  ChevronRight,
  ArrowRight,
  Briefcase,
  Globe,
  BarChart3,
  Users,
  X,
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import InvestorBriefAccess from '@/components/portal/InvestorBriefAccess'

type Mode = 'login' | 'register'

type Profile = {
  id: string
  email: string
  full_name: string | null
  title: string | null
  organisation: string | null
  phone: string | null
  aum: string | null
  investment_focus: string | null
  investor_status: 'registered' | 'verified' | 'admin' | 'premium'
  last_login?: string
  portfolio_value?: number
}

type Publication = {
  id: string
  title: string
  summary: string | null
  category: string
  fliphtml_url: string | null
  file_url: string | null
  published_at: string
  access_level: 'registered' | 'verified' | 'premium'
}

type MarketSnapshot = {
  region: string
  metric: string
  value: string
  trend: string
  source: string
}

export default function InvestorPortalPage({ initialMode }: { initialMode?: Mode | undefined }) {
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(overviewQuery)
  const authUser = data.user
  const profile = data.profile as Profile | null
  const publications = data.publications as Publication[]
  const [mode, setMode] = useState<Mode>(initialMode ?? 'login')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Mobile UI states
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    organisation: '',
    title: '',
    aum: '',
    investmentFocus: '',
  })

  // Market intelligence data
  const marketSnapshots: MarketSnapshot[] = [
    {
      region: "Nairobi Prime",
      metric: "Price Growth",
      value: "+8.3%",
      trend: "Top 12 Globally",
      source: "Knight Frank 2025"
    },
    {
      region: "Family Office",
      metric: "Direct RE Allocation",
      value: "68%",
      trend: ">$100M AUM",
      source: "Knight Frank 2025"
    },
    {
      region: "African UHNWI",
      metric: ">$100M Net Worth",
      value: "1,746",
      trend: "By 2028",
      source: "Knight Frank"
    },
    {
      region: "Top Challenge",
      metric: "Reliable Partners",
      value: "23%",
      trend: "Primary Concern",
      source: "KF Survey"
    }
  ]

  const institutionalInsights = [
    {
      title: "The Trust Imperative",
      source: "Knight Frank 2025",
      stat: "23%",
      description: "of family offices cite identifying reliable partners as their top challenge—surpassing tax regimes and regulatory barriers.",
      implication: "Partner selection is the critical success factor in African real estate."
    },
    {
      title: "Direct Real Estate Dominance",
      source: "Knight Frank Analysis",
      stat: "68%",
      description: "of family offices with AUM exceeding $250M allocate over $100M to direct real estate investments.",
      implication: "UHNWI prefer direct control and governance oversight."
    },
    {
      title: "Technology Adoption",
      source: "Deloitte 2025",
      stat: "33%",
      description: "of family offices used AI by 2025, with 69% expecting AI deployment for financial reporting within five years.",
      implication: "Investor portals must prioritize clarity over complexity."
    },
    {
      title: "Nairobi's Global Position",
      source: "Knight Frank Index",
      stat: "+8.3%",
      description: "Nairobi prime residential price growth ranks 12th globally, ahead of Miami, London, and New York.",
      implication: "Kenya's capital offers defensive characteristics."
    }
  ]

  useEffect(() => {
    if (initialMode) setMode(initialMode)
  }, [initialMode])

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
        data: {
          full_name: form.fullName,
          phone: form.phone,
          organisation: form.organisation,
          title: form.title,
          aum: form.aum,
          investment_focus: form.investmentFocus,
        },
      },
    })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    setMessage('Registration submitted. Please verify your email.')
    setSubmitting(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    setMessage('Authentication successful.')
    setSubmitting(false)
    await queryClient.invalidateQueries({ queryKey: ['portal'] })
  }

  // Signed-out visitors see the sign-in screen from the portal layout.
  if (!authUser) return null

  return (
    <div className="space-y-8 lg:space-y-16">
      {/* Welcome Hero - Responsive padding and text sizes */}
      <section className="border-b border-border pb-12 lg:pb-16">
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex-1">
              <div className="mb-5">
                <span className="lux-eyebrow">
                  {profile?.investor_status === 'premium'
                    ? 'Premium Access'
                    : profile?.investor_status === 'verified' || profile?.investor_status === 'admin'
                      ? 'Verified Investor'
                      : 'Registered Investor'}
                </span>
              </div>
              <h2 className="font-display text-3xl lg:text-5xl text-foreground mb-4">
                Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
              </h2>
              <p className="text-sm lg:text-base font-light text-muted-foreground max-w-2xl leading-relaxed">
                Access proprietary market intelligence and institutional-grade analytics. 
                68% of family offices with AUM exceeding $250M allocate over $100M to direct real estate.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <span className="lux-meta">
                Status: {profile?.investor_status || 'registered'}
              </span>
              <span className="lux-meta hidden sm:inline-block">
                {profile?.organisation || 'Individual'}
              </span>
            </div>
          </div>

          {/* Quick Stats - Horizontal scroll on mobile, grid on desktop */}
          <div className="mt-12 lg:mt-16">
            <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto pb-2 lg:pb-0 snap-x">
              {marketSnapshots.map((snapshot, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-40 lg:w-auto snap-start"
                >
                  <div className="font-display text-2xl lg:text-3xl text-foreground mb-2">{snapshot.value}</div>
                  <div className="text-xs lg:text-sm font-light text-muted-foreground mb-1">{snapshot.metric}</div>
                  <div className="lux-meta">{snapshot.region}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Insights - Progressive Disclosure on Mobile */}
      <section>
        <div className="flex items-center justify-between mb-4 lg:mb-8">
          <div>
            <h3 className="font-serif text-xl lg:text-2xl text-forest mb-1">Institutional Intelligence</h3>
            <p className="text-xs lg:text-sm text-forest/60">Knight Frank, Deloitte, and McKinsey research</p>
          </div>
          <SiteLink href="/research" className="text-[10px] lg:text-[11px] uppercase tracking-[0.15em] text-gold hover:text-forest transition-colors flex items-center gap-1">
            <span className="hidden sm:inline">View All</span> <ChevronRight className="h-4 w-4" />
          </SiteLink>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {institutionalInsights.map((insight, index) => (
            <div 
              key={index} 
              className="bg-white border border-forest/10 rounded-lg lg:rounded-none p-4 lg:p-6 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.15em] text-gold block mb-1">{insight.source}</span>
                  <h4 className="text-base lg:text-lg font-medium text-forest leading-tight">{insight.title}</h4>
                </div>
                <div className="text-2xl lg:text-3xl font-light text-gold/20 ml-4">{insight.stat}</div>
              </div>
              
              {/* Mobile: Truncate description, Desktop: Full text */}
              <p className="text-sm text-ink/80 leading-relaxed mb-3 lg:mb-4 line-clamp-2 lg:line-clamp-none">
                {insight.description}
              </p>
              
              {/* Mobile: Expandable implication */}
              <div className="lg:hidden">
                <button
                  onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold w-full justify-between py-2 border-t border-forest/5"
                >
                  <span>Strategic Implication</span>
                  {expandedInsight === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedInsight === index && (
                  <p className="text-xs text-forest/60 italic pt-2 pb-1 animate-in slide-in-from-top-2">
                    {insight.implication}
                  </p>
                )}
              </div>
              
              {/* Desktop: Always visible implication */}
              <div className="hidden lg:block pt-4 border-t border-forest/5">
                <p className="text-xs text-forest/60 italic">
                  <span className="font-medium text-gold">Strategic Implication:</span> {insight.implication}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Cards - Responsive Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[
          {
            icon: BarChart3,
            title: "Portfolio Analytics",
            desc: "Track allocations across direct real estate and alternatives with benchmark comparisons.",
            link: "/portal/dashboard" as const,
            cta: "View Dashboard"
          },
          {
            icon: Lock,
            title: "Off-Market Access",
            desc: "Exclusive opportunities not listed publicly. Direct investment and JV structures.",
            link: "/portal/off-market" as const,
            cta: "View Opportunities"
          },
          {
            icon: FileText,
            title: "Investment Briefs",
            desc: "Request detailed memoranda. Digital delivery or hard-copy with M-Pesa integration.",
            link: "/portal/briefs" as const,
            cta: "Request Brief"
          }
        ].map((card, index) => (
          <Link 
            key={index}
            to={card.link}
            className="group bg-white border border-gold/20 p-4 lg:p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 rounded-lg lg:rounded-none"
          >
            <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gold/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
            <card.icon className="h-6 w-6 lg:h-8 lg:w-8 text-gold mb-3 lg:mb-4 relative z-10" />
            <h3 className="font-serif text-lg lg:text-xl text-forest mb-2 relative z-10 group-hover:text-gold transition-colors">{card.title}</h3>
            <p className="text-xs lg:text-sm text-forest/70 mb-3 lg:mb-4 relative z-10 line-clamp-2 lg:line-clamp-none">{card.desc}</p>
            <span className="inline-flex items-center text-[10px] lg:text-[11px] uppercase tracking-[0.15em] text-gold group-hover:text-forest transition-colors relative z-10">
              {card.cta} <ArrowRight className="ml-2 h-3 w-3 lg:h-4 lg:w-4" />
            </span>
          </Link>
        ))}
      </section>

      {/* Investor Brief Access - Full Magazine Flow */}
      <section className="bg-white border border-forest/10 rounded-lg lg:rounded-none p-4 lg:p-8">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gold/10 flex items-center justify-center">
            <Briefcase className="h-5 w-5 lg:h-6 lg:w-6 text-gold" />
          </div>
          <div>
            <h3 className="font-serif text-lg lg:text-2xl text-forest">Nairobi Private Commercial Asset Brief</h3>
            <p className="text-[10px] lg:text-xs text-forest/60">Institutional-grade market intelligence</p>
          </div>
        </div>
        
        <InvestorBriefAccess 
          userEmail={profile?.email || authUser?.email || undefined}
          userName={profile?.full_name || undefined}
          userPhone={profile?.phone || undefined}
          userOrganisation={profile?.organisation || undefined}
        />
      </section>

      {/* Publications Library - Horizontal Scroll on Mobile */}
      <section>
        <div className="flex items-center justify-between mb-4 lg:mb-8">
          <div>
            <h3 className="font-serif text-xl lg:text-2xl text-forest mb-1">Research Library</h3>
            <p className="text-xs lg:text-sm text-forest/60">Knight Frank, McKinsey, and proprietary intelligence</p>
          </div>
          <Link to="/portal/publications" className="text-[10px] lg:text-[11px] uppercase tracking-[0.15em] text-gold hover:text-forest transition-colors flex items-center gap-1">
            <span className="hidden sm:inline">View All</span> <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden flex gap-4 overflow-x-auto pb-4 snap-x -mx-4 px-4">
          {publications.slice(0, 4).map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-72 snap-start bg-white border border-forest/10 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-gold">{item.category}</span>
                  {item.access_level === 'premium' && <Lock className="h-3 w-3 text-gold" />}
                </div>
                <h4 className="font-serif text-base text-forest mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-xs text-forest/70 mb-3 line-clamp-2">{item.summary}</p>
                <div className="flex items-center justify-between pt-3 border-t border-forest/5">
                  <span className="text-[9px] text-forest/40">
                    {new Date(item.published_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex gap-2">
                    {item.fliphtml_url && (
                      <a href={item.fliphtml_url} target="_blank" rel="noreferrer" className="px-2 py-1 bg-forest text-white text-[9px] uppercase tracking-wider rounded-sm">
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.slice(0, 6).map((item) => (
            <div key={item.id} className="bg-white border border-forest/10 hover:border-gold/30 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-gold">{item.category}</span>
                  {item.access_level === 'premium' && <Lock className="h-3 w-3 text-gold" />}
                </div>
                <h4 className="font-serif text-xl text-forest mb-3 group-hover:text-gold transition-colors leading-tight">
                  {item.title}
                </h4>
                <p className="text-sm text-forest/70 mb-4 line-clamp-3">{item.summary}</p>
                <div className="flex items-center justify-between pt-4 border-t border-forest/5">
                  <span className="text-[10px] text-forest/40">
                    {new Date(item.published_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex gap-2">
                    {item.fliphtml_url && (
                      <a href={item.fliphtml_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-forest text-white px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors">
                        <Globe className="h-3 w-3" /> View
                      </a>
                    )}
                    {item.file_url && (
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 border border-forest/20 text-forest px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors">
                        <Download className="h-3 w-3" /> PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Responsive padding */}
      <section className="border-t border-border pt-16 lg:pt-20 text-center">
        <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-4">Ready to discuss allocation?</h3>
        <p className="text-sm lg:text-base font-light text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Murivest advises family offices and institutional investors on African real estate strategy.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
          <SiteLink href="/contact">
            <button className="lux-button w-full sm:w-auto">
              Schedule a consultation
            </button>
          </SiteLink>
          <Link to="/portal/off-market">
            <button className="lux-link w-full sm:w-auto px-8 py-4">
              View opportunities
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}