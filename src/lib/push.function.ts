import { createServerFn } from '@tanstack/react-start'

interface SubInput {
  endpoint: string
  keys: { p256dh: string; auth: string }
  userAgent?: string
}

export const savePushSubscription = createServerFn({ method: 'POST' })
  .inputValidator((d: SubInput) => {
    if (!d?.endpoint?.startsWith('https://') || !d.keys?.p256dh || !d.keys?.auth) throw new Error('Invalid subscription')
    return d
  })
  .handler(async ({ data }) => {
    const { getSessionUser } = await import('./auth.server')
    const { supabaseAdmin } = await import('@/lib/supabase.server')
    const user = await getSessionUser()
    if (!user) throw new Error('Unauthorized')
    const { error } = await supabaseAdmin.from('push_subscriptions').upsert(
      {
        user_id: user.id,
        endpoint: data.endpoint,
        p256dh: data.keys.p256dh,
        auth: data.keys.auth,
        user_agent: data.userAgent?.slice(0, 300),
      },
      { onConflict: 'endpoint' },
    )
    if (error) throw new Error('Could not save subscription')
    return { ok: true }
  })

export const removePushSubscription = createServerFn({ method: 'POST' })
  .inputValidator((d: { endpoint: string }) => d)
  .handler(async ({ data }) => {
    const { getSessionUser } = await import('./auth.server')
    const { supabaseAdmin } = await import('@/lib/supabase.server')
    const user = await getSessionUser()
    if (!user) throw new Error('Unauthorized')
    await supabaseAdmin.from('push_subscriptions').delete().eq('user_id', user.id).eq('endpoint', data.endpoint)
    return { ok: true }
  })