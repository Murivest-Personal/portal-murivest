import type { AccessLevel, AccessReason } from './brief-types'
// TODO: point these two imports at your own server-side auth + Supabase admin client
import { getSessionUser } from '@/lib/auth.server'
import { supabaseAdmin } from '@/lib/supabase.server'

export interface Viewer {
  userId: string
  accessLevel: AccessLevel
}

export interface Entitlements {
  signedNdaBriefIds: Set<string>
  paidBriefIds: Set<string>
}

const RANK: Record<AccessLevel, number> = { registered: 0, verified: 1, premium: 2 }
const PAID_STATUSES = ['payment_confirmed', 'processing', 'shipped', 'delivered']

export async function getViewer(): Promise<Viewer | null> {
  const user = await getSessionUser() // reuse the lookup cancelBriefOrder uses
  if (!user) return null
  const { data } = await supabaseAdmin
    .from('investor_profiles')
    .select('access_level')
    .eq('user_id', user.id)
    .maybeSingle()
  return { userId: user.id, accessLevel: (data?.access_level as AccessLevel) ?? 'registered' }
}

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const [ndas, orders] = await Promise.all([
    supabaseAdmin.from('nda_signatures').select('brief_id').eq('user_id', userId).not('brief_id', 'is', null),
    supabaseAdmin.from('orders').select('brief_id').eq('user_id', userId).in('status', PAID_STATUSES).not('brief_id', 'is', null),
  ])
  return {
    signedNdaBriefIds: new Set((ndas.data ?? []).map((r) => r.brief_id as string)),
    paidBriefIds: new Set((orders.data ?? []).map((r) => r.brief_id as string)),
  }
}

export function evaluateAccess(
  viewer: Viewer,
  gate: { id: string; accessLevel: AccessLevel; requiresNda?: boolean; requiresOrder?: boolean },
  ent: Entitlements,
): AccessReason {
  if (RANK[viewer.accessLevel] < RANK[gate.accessLevel]) return 'tier'
  if (gate.requiresNda && !ent.signedNdaBriefIds.has(gate.id)) return 'nda'
  if (gate.requiresOrder && !ent.paidBriefIds.has(gate.id)) return 'order'
  return 'ok'
}