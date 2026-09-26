import { createClient } from '@/lib/supabase/server'

export interface AdminSession {
  supabase: Awaited<ReturnType<typeof createClient>>
  user: { id: string; email?: string }
}

/**
 * Ensures the caller is a signed-in admin before an admin mutation runs.
 * Server action wrappers should call this first and catch the throw to
 * return a user-friendly error.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated. Please sign in to the admin portal.')
  }

  return { supabase, user: { id: user.id, email: user.email ?? undefined } }
}