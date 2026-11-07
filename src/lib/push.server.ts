import * as webpush from 'web-push'
// TODO: point at your own Supabase admin client
import { supabaseAdmin } from '@/lib/supabase.server'

webpush.setVapidDetails(
  process.env['VAPID_SUBJECT']!,
  process.env['VAPID_PUBLIC_KEY']!,
  process.env['VAPID_PRIVATE_KEY']!,
)

export interface PushPayload {
  title: string
  body: string
  url?: string
  tag?: string
}

export async function sendPushToUsers(userIds: string[], payload: PushPayload) {
  if (userIds.length === 0) return
  const { data: subs } = await supabaseAdmin
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .in('user_id', userIds)

  await Promise.all(
    (subs ?? []).map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload),
          { TTL: 60 * 60 * 24 },
        )
      } catch (err: any) {
        // 404/410 = the user uninstalled or revoked permission: clean up
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', s.id)
        } else {
          console.error('[push]', err?.statusCode, err?.body)
        }
      }
    }),
  )
}