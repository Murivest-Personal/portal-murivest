export type AccessLevel = 'registered' | 'verified' | 'premium'
export type BriefStatus = 'active' | 'under_offer'
export type AccessReason = 'ok' | 'tier' | 'nda' | 'order'

export interface BriefSummary {
  id: string
  slug: string
  title: string
  assetClass: string
  location: string
  locationDetail?: string
  teaser: string
  priceKes?: number
  priceUsd?: number
  requiresNda: boolean
  requiresOrder: boolean
  orderPriceUsd?: number
  accessLevel: AccessLevel
  status: BriefStatus
  confidentiality?: string
  highlights?: string[]
  metrics?: { label: string; value: string }[]
  publishedAt?: string
  hasAccess: boolean
}

export interface DealRoomSettings {
  dealFlowHeading?: string
  dealFlowIntro?: string
  dealFlowInsights?: { stat: string; label: string; description?: string; source: string; sourceUrl?: string }[]
}

export interface ViewerInfo {
  accessLevel: AccessLevel
}

export interface BriefsPayload {
  briefs: BriefSummary[]
  viewer: ViewerInfo | null
  settings: DealRoomSettings | null
  error: string | null
}

export interface BriefDocumentRef {
  id: string
  title: string
  kind: string
  version?: string
}

export interface BriefDetail {
  id: string
  slug: string
  title: string
  subtitle?: string
  assetClass: string
  investmentType?: string
  status: BriefStatus
  accessLevel: AccessLevel
  location: string
  locationDetail?: string
  teaser: string
  summary?: string
  publishedAt?: string
  confidentialityLevel?: string
  targetIrr?: string
  targetYield?: string
  holdPeriod?: string
  priceKes?: number
  // Gated: only present when access.granted
  executiveSummary?: {
    thesis?: string
    highlights?: string[]
    pricing?: {
      totalInvestment?: number
      equityRequired?: number
      debtArranged?: number
      pricePerSqm?: number
      pricePerSqmUsd?: number
    }
    returns?: { preferredReturn?: string; promoteStructure?: string; targetEquityMultiple?: string }
  }
  investmentStrategy?: {
    marketContext?: string
    valueCreation?: string[]
    competitiveAdvantages?: string[]
    exitOptions?: string[]
  }
  management?: {
    sponsor?: { name?: string; trackRecord?: string; realizedIRR?: string }
    assetManager?: { name?: string; role?: string; feeStructure?: string }
    keyPersonnel?: { name?: string; role?: string; experience?: string }[]
  }
  financialAnalysis?: {
    revenueProjections?: { period: string; grossRevenue?: number; noi?: number; occupancy?: string }[]
    sensitivityAnalysis?: { scenario: string; irr?: string; moic?: string }[]
  }
  riskFactors?: { category: string; description?: string; mitigation?: string; severity?: 'low' | 'medium' | 'high' }[]
  dueDiligence?: {
    completion?: string
    legalCounsel?: string
    taxAdvisor?: string
    environmental?: string
    lastUpdated?: string
    areas?: { category: string; status?: string; items?: string[] }[]
  }
  investmentTerms?: {
    structure?: string
    minimumInvestment?: number
    targetRaise?: number
    investorQualification?: string
    governance?: string
    reporting?: string
    timeline?: { label: string; date: string }[]
  }
  documents?: BriefDocumentRef[]
}

export interface BriefDetailPayload {
  brief: BriefDetail | null
  access: { granted: boolean; reason: AccessReason; requiredLevel?: AccessLevel; orderPriceUsd?: number }
  error: string | null
}