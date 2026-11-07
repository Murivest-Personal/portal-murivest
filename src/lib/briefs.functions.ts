import { createServerFn } from '@tanstack/react-start'
import type {
  AccessLevel,
  BriefDetail,
  BriefDetailPayload,
  BriefSummary,
  BriefsPayload,
  DealRoomSettings,
} from './brief-types'

const LIVE = `status in ["active","under_offer"]`

const BRIEFS_QUERY = `*[_type == "brief" && defined(slug.current) && ${LIVE}] | order(publishedAt desc) {
  "id": _id, "slug": slug.current, title, assetClass, location, locationDetail, teaser,
  priceKes, priceUsd, requiresNda, requiresOrder, orderPriceUsd, accessLevel, status,
  confidentiality, highlights, metrics, publishedAt
}`

const SETTINGS_QUERY = `*[_type == "dealRoomSettings"][0]{
  dealFlowHeading, dealFlowIntro,
  dealFlowInsights[]{ stat, label, description, source, sourceUrl }
}`

const DETAIL_QUERY = `*[_type == "brief" && slug.current == $slug && ${LIVE}][0]{
  ...,
  "id": _id, "slug": slug.current,
  "documents": *[_type == "portalDocument" && relatedBrief._ref == ^._id]{ "id": _id, title, kind, version }
}`

export const fetchBriefs = createServerFn({ method: 'GET' }).handler(async (): Promise<BriefsPayload> => {
  const [{ sanity }, access] = await Promise.all([
    // @ts-ignore -- sanity.server is supplied by the server runtime.
    import('./sanity.server'),
    // @ts-ignore -- portal-access.server is supplied by the server runtime.
    import('./portal-access.server'),
  ])
  try {
    const viewer = await access.getViewer()
    if (!viewer) return { briefs: [], viewer: null, settings: null, error: 'Please sign in to view investment briefs.' }

    const [raw, settings, ent] = await Promise.all([
      sanity.fetch(BRIEFS_QUERY) as Promise<Omit<BriefSummary, 'hasAccess'>[]>,
      sanity.fetch(SETTINGS_QUERY) as Promise<DealRoomSettings | null>,
      access.getEntitlements(viewer.userId),
    ])

    const briefs: BriefSummary[] = raw.map((b) => {
      const { locationDetail, ...summary } = b
      const accessLevel = (b.accessLevel ?? 'registered') as AccessLevel
      const hasAccess =
        access.evaluateAccess(viewer, { ...b, accessLevel }, ent) === 'ok'
      return {
        ...summary,
        accessLevel,
        requiresNda: !!b.requiresNda,
        requiresOrder: !!b.requiresOrder,
        // Don't leak the precise location before the NDA is signed
        ...(!b.requiresNda || ent.signedNdaBriefIds.has(b.id)
          ? locationDetail === undefined ? {} : { locationDetail }
          : {}),
        hasAccess,
      }
    })

    return { briefs, viewer: { accessLevel: viewer.accessLevel }, settings, error: null }
  } catch (err) {
    console.error('[fetchBriefs]', err)
    return { briefs: [], viewer: null, settings: null, error: 'We could not load investment briefs right now.' }
  }
})

export const fetchBriefDetail = createServerFn({ method: 'GET' })
  .validator((slug: string) => {
    if (typeof slug !== 'string' || !/^[a-z0-9-]{1,120}$/.test(slug)) throw new Error('Invalid brief')
    return slug
  })
  .handler(async ({ data: slug }): Promise<BriefDetailPayload> => {
    const [{ sanity }, access] = await Promise.all([
      // @ts-ignore -- sanity.server is supplied by the server runtime.
      import('./sanity.server'),
      // @ts-ignore -- portal-access.server is supplied by the server runtime.
      import('./portal-access.server'),
    ])
    try {
      const viewer = await access.getViewer()
      if (!viewer) return { brief: null, access: { granted: false, reason: 'tier' }, error: 'Please sign in to view this brief.' }

      const result: unknown = await sanity.fetch(DETAIL_QUERY, { slug })
      const full = result as
        | (BriefDetail & { requiresNda?: boolean; requiresOrder?: boolean; orderPriceUsd?: number })
        | null
      if (!full) return { brief: null, access: { granted: false, reason: 'tier' }, error: null }

      const ent = await access.getEntitlements(viewer.userId)
      const accessLevel = (full.accessLevel ?? 'registered') as AccessLevel
      const reason = access.evaluateAccess(viewer, { ...full, accessLevel }, ent)
      const meta = {
        requiredLevel: accessLevel,
        ...(full.orderPriceUsd === undefined ? {} : { orderPriceUsd: full.orderPriceUsd }),
      }

      if (reason !== 'ok') {
        // Public subset only: no memorandum sections, no documents
        const pub: BriefDetail = {
          id: full.id, slug: full.slug, title: full.title,
          assetClass: full.assetClass, status: full.status, accessLevel,
          ...(full.subtitle === undefined ? {} : { subtitle: full.subtitle }),
          ...(full.investmentType === undefined ? {} : { investmentType: full.investmentType }),
          location: full.location,
          ...(!full.requiresNda && full.locationDetail !== undefined
            ? { locationDetail: full.locationDetail }
            : {}),
          teaser: full.teaser ?? '',
          ...(full.publishedAt === undefined ? {} : { publishedAt: full.publishedAt }),
          ...(full.confidentialityLevel === undefined
            ? {}
            : { confidentialityLevel: full.confidentialityLevel }),
          ...(full.targetIrr === undefined ? {} : { targetIrr: full.targetIrr }),
          ...(full.targetYield === undefined ? {} : { targetYield: full.targetYield }),
          ...(full.holdPeriod === undefined ? {} : { holdPeriod: full.holdPeriod }),
          ...(full.priceKes === undefined ? {} : { priceKes: full.priceKes }),
        }
        return { brief: pub, access: { granted: false, reason, ...meta }, error: null }
      }

      const { requiresNda: _n, requiresOrder: _o, orderPriceUsd: _p, ...brief } = full
      return { brief: { ...brief, accessLevel }, access: { granted: true, reason: 'ok', ...meta }, error: null }
    } catch (err) {
      console.error('[fetchBriefDetail]', err)
      return { brief: null, access: { granted: false, reason: 'tier' }, error: 'We could not load this brief right now.' }
    }
  })