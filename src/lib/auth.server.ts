import { getSupabaseServerClient } from '@/lib/supabase.server'

/** Returns the verified user (validated with Supabase, not just decoded from the cookie), or null. */
export async function getSessionUser() {
  const {
    data: { user },
    error,
  } = await getSupabaseServerClient().auth.getUser()
  if (error || !user) return null
  return user
}