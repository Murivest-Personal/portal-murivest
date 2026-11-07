import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'

const url = process.env['SUPABASE_URL']
const anonKey = process.env['SUPABASE_ANON_KEY']
const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

if (!url || !anonKey || !serviceKey) {
  throw new Error('Missing SUPABASE_URL, SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY')
}

/**
 * Admin client: bypasses RLS. Use only in server code, and always scope
 * queries to the verified user's id (see portal-access.server.ts).
 */
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

/**
 * Per-request client that reads the signed-in user's session from cookies.
 * Respects RLS. Use it to identify the current user.
 */
export function getSupabaseServerClient() {
  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value: value ?? '' }))
      },
      setAll(cookies: any[]) {
        cookies.forEach((c) => setCookie(c.name, c.value, c.options))
      },
    },
  })
}