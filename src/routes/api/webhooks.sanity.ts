import { createFileRoute } from '@tanstack/react-router'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

export const Route = createFileRoute('/api/webhooks/sanity')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.text()
        const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? ''
        if (!(await isValidSignature(body, signature, process.env['SANITY_WEBHOOK_SECRET']!)))
          return new Response('Invalid signature', { status: 401 })

        const brief = JSON.parse(body) as { accessLevel?: string }
        const ranks = ['registered', 'verified', 'premium']
        const eligible = ranks.slice(ranks.indexOf(brief.accessLevel ?? 'registered'))

        const { supabaseAdmin } = await import('@/lib/supabase.server')
        const { sendPushToUsers } = await import('@/lib/push.server')
        const { data } = await supabaseAdmin.from('investor_profiles').select('user_id').in('access_level', eligible)

        await sendPushToUsers((data ?? []).map((r) => r.user_id), {
          title: 'New investment brief',
          body: 'A new opportunity has been added to your deal room.',
          url: '/portal/briefs',
          tag: 'new-brief',
        })
        return new Response('ok')
      },
    },
  },
})