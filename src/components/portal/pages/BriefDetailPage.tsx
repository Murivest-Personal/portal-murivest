import type { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { briefDetailQuery } from '@/lib/portal-data'
import { Link } from '@tanstack/react-router'
import { SiteLink } from '@/components/portal/SiteLink'
import {
  ArrowLeft,
  Download,
  FileText,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MapPin,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Briefcase,
  Globe,
  Calculator,
} from 'lucide-react'

interface PageProps {
  slug: string
}

interface BriefDocument {
  id: string
  kind: string
}

type RiskFactor = {
  category?: string
  severity?: 'low' | 'medium' | 'high'
  description?: string
  mitigation?: string
}

// UTC avoids server/client hydration mismatches
const fmtDate = (value?: string | null, long = true) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: long ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const millions = (n?: number | null, digits = 1) =>
  typeof n === 'number' ? `KES ${(n / 1_000_000).toFixed(digits)}M` : '—'

function Row({
  label,
  value,
  accent,
  right,
  py = 'py-2',
}: {
  label: string
  value?: ReactNode
  accent?: boolean
  right?: boolean
  py?: string
}) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className={`flex justify-between items-center ${py} border-b border-forest/10`}>
      <span className="text-sm text-ink/70">{label}</span>
      <span
        className={`font-medium text-sm ${accent ? 'text-gold' : 'text-forest'} ${right ? 'text-right max-w-[60%]' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

const lockedCopy = {
  tier: { text: 'This brief is available to investors with a higher access level.', cta: 'Request Access', href: '/contact?subject=premium-access' },
  nda: { text: 'An executed NDA is required before the full memorandum is disclosed.', cta: 'Execute NDA', href: '/contact?subject=nda-execution' },
  order: { text: 'Order this brief to unlock the full memorandum and documents.', cta: 'Order Brief', href: '' },
} as const

export default function BriefDetailPage({ slug }: PageProps) {
  const { data } = useSuspenseQuery(briefDetailQuery(slug))
  const { brief, access, error } = data

  if (error || !brief) {
    return (
      <div className="space-y-8">
        <div className="bg-ivory border border-gold/20 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gold/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-forest mb-2">{error ? 'Unable to Load Brief' : 'Brief Not Found'}</h3>
          <p className="text-sm text-ink/60 max-w-md mx-auto mb-4">
            {error || 'This brief may have been closed or is no longer available.'}
          </p>
          <Link
            to="/portal/briefs"
            className="inline-block bg-forest text-white px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors"
          >
            Back to Briefs
          </Link>
        </div>
      </div>
    )
  }

  const granted = access.granted
  const lockedReason: keyof typeof lockedCopy =
    access.reason === 'nda' ? 'nda' : access.reason === 'order' ? 'order' : 'tier'
  const isPremium = brief.accessLevel === 'premium'
  const pricing = brief.executiveSummary?.pricing
  const returns = brief.executiveSummary?.returns
  const terms = brief.investmentTerms
  const dd = brief.dueDiligence
  const memorandum: BriefDocument | undefined = brief.documents?.find((d: BriefDocument) => d.kind === 'memorandum') ?? brief.documents?.[0]
  const postedLabel = fmtDate(brief.publishedAt)
  const pct = (part?: number, total?: number) =>
    part && total ? ` (${Math.round((part / total) * 100)}%)` : ''

  return (
    <div className="space-y-12">
      {/* Navigation & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-forest/50">
        <Link to="/portal" className="hover:text-gold transition-colors">Portal</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/portal/briefs" className="hover:text-gold transition-colors">Briefs</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gold uppercase tracking-wider">{brief.assetClass}</span>
      </div>

      {/* Header Section */}
      <header className="bg-forest text-ivory p-8 lg:p-12 rounded-sm relative overflow-hidden">
        {isPremium && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-gold/20 border border-gold/30">
            <Lock className="h-4 w-4 text-gold" />
            <span className="text-[10px] uppercase tracking-wider text-gold font-medium">Premium Access</span>
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
              {brief.investmentType || 'Direct Investment'}
            </span>
            <span className="text-gold/30">|</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/60">{brief.assetClass}</span>
            {brief.status === 'active' ? (
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Active
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-1">
                {brief.status.replace('_', ' ')}
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl lg:text-5xl mb-3 leading-tight">{brief.title}</h1>
          {brief.subtitle && (
            <p className="text-xl text-ivory/80 italic mb-6 font-light">{brief.subtitle}</p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-ivory/60">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              {brief.locationDetail || brief.location}
            </span>
            {postedLabel && (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Posted {postedLabel}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {brief.confidentialityLevel || 'Strictly Confidential'}
            </span>
          </div>
        </div>
      </header>

      {/* Investment Highlights Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-forest/10 p-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-1">Target IRR</div>
          <div className="text-3xl font-light text-gold">{brief.targetIrr || '—'}</div>
        </div>
        <div className="bg-white border border-forest/10 p-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-1">Investment</div>
          <div className="text-3xl font-light text-forest">{millions(brief.priceKes)}</div>
        </div>
        <div className="bg-white border border-forest/10 p-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-1">Target Yield</div>
          <div className="text-3xl font-light text-forest">{brief.targetYield || '—'}</div>
        </div>
        <div className="bg-white border border-forest/10 p-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-1">Hold Period</div>
          <div className="text-3xl font-light text-forest">{brief.holdPeriod || '—'}</div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="bg-ivory border border-gold/20 p-8">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl text-forest">Executive Summary</h2>
        </div>

        <p className="text-ink/80 leading-relaxed text-lg font-light mb-6 whitespace-pre-wrap">
          {(granted && (brief.summary || brief.executiveSummary?.thesis)) || brief.teaser}
        </p>

        {granted && brief.executiveSummary?.highlights && brief.executiveSummary.highlights.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {brief.executiveSummary.highlights.map((highlight: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm text-ink/80">{highlight}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Locked state: memorandum sections are not sent to the browser */}
      {!granted && (
        <section className="bg-amber-50 border border-amber-200 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">Full Memorandum Locked</h3>
                <p className="text-sm text-amber-700/80">{lockedCopy[lockedReason].text}</p>
              </div>
            </div>
            {access.reason === 'order' ? (
              <Link
                to="/portal"
                hash="brief-access"
                className="inline-flex items-center gap-2 bg-forest text-white px-6 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors flex-shrink-0"
              >
                <FileText className="h-4 w-4" />
                {access.orderPriceUsd ? `Order Brief ($${access.orderPriceUsd})` : 'Order Brief'}
              </Link>
            ) : (
              <SiteLink
                href={lockedCopy[lockedReason].href}
                className="inline-flex items-center gap-2 bg-forest text-white px-6 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors flex-shrink-0"
              >
                <Lock className="h-4 w-4" />
                {lockedCopy[lockedReason].cta}
              </SiteLink>
            )}
          </div>
        </section>
      )}

      {/* Investment Structure */}
      {granted && pricing && (
        <section className="bg-white border border-forest/10 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl text-forest">Investment Structure</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.15em] text-forest/50 mb-4">Capital Stack</h3>
              <div className="space-y-3">
                <Row label="Total Investment" value={pricing.totalInvestment ? millions(pricing.totalInvestment) : undefined} />
                <Row
                  label="Equity Required"
                  accent
                  value={pricing.equityRequired ? `${millions(pricing.equityRequired)}${pct(pricing.equityRequired, pricing.totalInvestment)}` : undefined}
                />
                <Row
                  label="Debt Arranged"
                  value={pricing.debtArranged ? `${millions(pricing.debtArranged)}${pct(pricing.debtArranged, pricing.totalInvestment)}` : undefined}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.15em] text-forest/50 mb-4">Return Structure</h3>
              <div className="space-y-3">
                <Row label="Preferred Return" value={returns?.preferredReturn} />
                <Row label="Promote Structure" value={returns?.promoteStructure} />
                <Row label="Target IRR" accent value={brief.targetIrr} />
                <Row label="Equity Multiple" value={returns?.targetEquityMultiple} />
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.15em] text-forest/50 mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <Row label="Price/sqm (KES)" value={pricing.pricePerSqm?.toLocaleString('en-US')} />
                <Row label="Price/sqm (USD)" value={pricing.pricePerSqmUsd ? `$${pricing.pricePerSqmUsd.toLocaleString('en-US')}` : undefined} />
                <Row label="Min. Investment" value={terms?.minimumInvestment ? millions(terms.minimumInvestment) : undefined} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Investment Strategy */}
      {granted && brief.investmentStrategy && (
        <section className="bg-white border border-forest/10 p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl text-forest">Investment Strategy</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              {brief.investmentStrategy.marketContext && (
                <>
                  <h3 className="font-medium text-forest mb-3">Market Context</h3>
                  <p className="text-sm text-ink/70 leading-relaxed mb-6 whitespace-pre-wrap">
                    {brief.investmentStrategy.marketContext}
                  </p>
                </>
              )}

              {brief.investmentStrategy.valueCreation && brief.investmentStrategy.valueCreation.length > 0 && (
                <>
                  <h3 className="font-medium text-forest mb-3">Value Creation</h3>
                  <ul className="space-y-2">
                    {brief.investmentStrategy.valueCreation.map((item: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-ink/70">
                        <ChevronRight className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div>
              {brief.investmentStrategy.competitiveAdvantages && brief.investmentStrategy.competitiveAdvantages.length > 0 && (
                <>
                  <h3 className="font-medium text-forest mb-3">Competitive Advantages</h3>
                  <ul className="space-y-2 mb-6">
                    {brief.investmentStrategy.competitiveAdvantages.map((item: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-ink/70">
                        <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {brief.investmentStrategy.exitOptions && brief.investmentStrategy.exitOptions.length > 0 && (
                <>
                  <h3 className="font-medium text-forest mb-3">Exit Options</h3>
                  <ul className="space-y-2">
                    {brief.investmentStrategy.exitOptions.map((item: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-ink/70">
                        <Globe className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Management Team */}
      {granted && brief.management && (
        <section className="bg-forest/5 border border-forest/10 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl text-forest">Management & Operations</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {brief.management.sponsor?.name && (
              <div className="bg-white p-6 border border-forest/10">
                <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-2">Sponsor</div>
                <div className="font-medium text-forest mb-1">{brief.management.sponsor.name}</div>
                {brief.management.sponsor.trackRecord && (
                  <div className="text-xs text-ink/60 mb-3">{brief.management.sponsor.trackRecord}</div>
                )}
                {brief.management.sponsor.realizedIRR && (
                  <div className="text-sm text-gold font-medium">{brief.management.sponsor.realizedIRR} realized IRR</div>
                )}
              </div>
            )}

            {brief.management.assetManager?.name && (
              <div className="bg-white p-6 border border-forest/10">
                <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-2">Asset Manager</div>
                <div className="font-medium text-forest mb-1">{brief.management.assetManager.name}</div>
                {brief.management.assetManager.role && (
                  <div className="text-xs text-ink/60 mb-3">{brief.management.assetManager.role}</div>
                )}
                {brief.management.assetManager.feeStructure && (
                  <div className="text-xs text-ink/60">{brief.management.assetManager.feeStructure}</div>
                )}
              </div>
            )}

            {brief.management.keyPersonnel && brief.management.keyPersonnel.length > 0 && (
              <div className="bg-white p-6 border border-forest/10">
                <div className="text-[10px] uppercase tracking-[0.15em] text-forest/50 mb-2">Key Personnel</div>
                <div className="space-y-2">
                  {brief.management.keyPersonnel.slice(0, 2).map((person, index) => (
                    <div key={index} className="text-xs">
                      <div className="font-medium text-forest">{person.name}</div>
                      <div className="text-ink/60">{person.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Financial Analysis */}
      {granted && brief.financialAnalysis && (
        <section className="bg-white border border-forest/10 p-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl text-forest">Financial Analysis</h2>
          </div>

          {brief.financialAnalysis.revenueProjections && brief.financialAnalysis.revenueProjections.length > 0 && (
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-forest/10">
                    <th className="text-left py-3 text-[10px] uppercase tracking-[0.15em] text-forest/50 font-medium">Period</th>
                    <th className="text-right py-3 text-[10px] uppercase tracking-[0.15em] text-forest/50 font-medium">Gross Revenue</th>
                    <th className="text-right py-3 text-[10px] uppercase tracking-[0.15em] text-forest/50 font-medium">NOI</th>
                    <th className="text-right py-3 text-[10px] uppercase tracking-[0.15em] text-forest/50 font-medium">Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  {brief.financialAnalysis.revenueProjections.map((row, index) => (
                    <tr key={index} className="border-b border-forest/5">
                      <td className="py-3 text-forest font-medium">{row.period}</td>
                      <td className="py-3 text-right text-ink/70">
                        {row.grossRevenue ? millions(row.grossRevenue) : '-'}
                      </td>
                      <td className="py-3 text-right font-medium text-gold">
                        {row.noi ? millions(row.noi) : '-'}
                      </td>
                      <td className="py-3 text-right text-ink/70">{row.occupancy || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {brief.financialAnalysis.sensitivityAnalysis && brief.financialAnalysis.sensitivityAnalysis.length > 0 && (
            <div className="grid md:grid-cols-4 gap-4">
              {brief.financialAnalysis.sensitivityAnalysis.map((scenario, index) => (
                <div key={index} className={`p-4 border ${index === 0 ? 'border-gold/30 bg-gold/5' : 'border-forest/10'}`}>
                  <div className="text-[10px] uppercase tracking-wider text-forest/50 mb-2">{scenario.scenario}</div>
                  <div className="text-2xl font-light text-forest mb-1">{scenario.irr || '—'}</div>
                  {scenario.moic && <div className="text-xs text-ink/60">MOIC: {scenario.moic}</div>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Risk Factors */}
      {granted && brief.riskFactors && brief.riskFactors.length > 0 && (
        <section className="bg-white border border-forest/10 p-8">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl text-forest">Risk Factors</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {brief.riskFactors.map((risk: RiskFactor, index: number) => (
              <div key={index} className="border-l-2 border-gold/30 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-forest">{risk.category}</span>
                  {risk.severity && (
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        risk.severity === 'low'
                          ? 'bg-green-50 text-green-600'
                          : risk.severity === 'medium'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {risk.severity} Risk
                    </span>
                  )}
                </div>
                {risk.description && <p className="text-sm text-ink/70 mb-2">{risk.description}</p>}
                {risk.mitigation && (
                  <p className="text-xs text-gold">
                    <span className="font-medium">Mitigation:</span> {risk.mitigation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Due Diligence Status */}
      {granted && dd && (
        <section className="bg-forest text-ivory p-8 rounded-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-2xl">Due Diligence Status</h2>
            </div>
            {dd.completion && (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.15em] text-gold mb-1">Completion</div>
                <div className="text-3xl font-light text-gold">{dd.completion}</div>
              </div>
            )}
          </div>

          {dd.areas && dd.areas.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {dd.areas.map((area, index) => (
                <div key={index} className="bg-white/5 border border-gold/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-white/80">{area.category}</span>
                    {area.status && (
                      <span
                        className={`text-[10px] uppercase tracking-wider ${
                          area.status === 'completed' ? 'text-green-400' : 'text-amber-400'
                        }`}
                      >
                        {area.status}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {area.items?.slice(0, 3).map((item, i) => (
                      <li key={i} className="text-[10px] text-white/60 flex items-start gap-1">
                        <div className="w-1 h-1 bg-gold rounded-full mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-6 text-xs text-white/60 pt-6 border-t border-gold/20">
            {dd.legalCounsel && <span>Legal Counsel: {dd.legalCounsel}</span>}
            {dd.taxAdvisor && <span>Tax Advisor: {dd.taxAdvisor}</span>}
            {dd.environmental && <span>Environmental: {dd.environmental}</span>}
            {dd.lastUpdated && <span>Last Updated: {fmtDate(dd.lastUpdated, false)}</span>}
          </div>
        </section>
      )}

      {/* Investment Terms & Timeline */}
      {granted && terms && (
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-forest/10 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-2xl text-forest">Investment Terms</h2>
            </div>

            <div className="space-y-4">
              <Row py="py-3" label="Structure" value={terms.structure} />
              <Row py="py-3" label="Minimum Investment" accent value={terms.minimumInvestment ? millions(terms.minimumInvestment) : undefined} />
              <Row py="py-3" label="Target Raise" value={terms.targetRaise ? millions(terms.targetRaise) : undefined} />
              <Row py="py-3" right label="Investor Qualification" value={terms.investorQualification} />
              <Row py="py-3" right label="Governance" value={terms.governance} />
              <Row py="py-3" right label="Reporting" value={terms.reporting} />
            </div>
          </div>

          {terms.timeline && terms.timeline.length > 0 && (
            <div className="bg-white border border-forest/10 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-gold" />
                <h2 className="font-serif text-2xl text-forest">Timeline</h2>
              </div>

              <div className="space-y-4">
                {terms.timeline.map((item: { label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; date: string | null | undefined }, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gold">{typeof index === 'number' ? index + 1 : ''}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-forest">{item.label}</div>
                      <div className="text-xs text-ink/60">{fmtDate(item.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Confidentiality Notice */}
      <section className="bg-amber-50 border border-amber-200 p-6">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 mb-2">Confidentiality Notice</h3>
            <p className="text-sm text-amber-700/80 leading-relaxed">
              This investment brief is strictly confidential and intended solely for the named recipient.
              The information contained herein constitutes proprietary and commercially sensitive material.
              Any reproduction, distribution, or disclosure to third parties without prior written consent
              is strictly prohibited. This is not an offer to sell or a solicitation of an offer to buy any
              securities. Past performance is not indicative of future results. Investment involves
              substantial risk including possible loss of principal.
            </p>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-forest/10">
        <Link
          to="/portal/briefs"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-forest/60 hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Briefs
        </Link>

        <div className="flex gap-3">
          {granted && memorandum && (
            <a
              href={`/api/documents/${memorandum.id}`}
              className="inline-flex items-center gap-2 border border-forest/20 text-forest px-4 py-2 text-[11px] uppercase tracking-[0.1em] hover:border-gold hover:text-gold transition-colors"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          )}
          <SiteLink
            href={`/contact?subject=investment-inquiry&brief=${encodeURIComponent(brief.slug)}`}
            className="inline-flex items-center gap-2 bg-forest text-white px-6 py-2 text-[11px] uppercase tracking-[0.1em] hover:bg-forest-soft transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Express Interest
          </SiteLink>
        </div>
      </footer>
    </div>
  )
}