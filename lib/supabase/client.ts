import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

function getValidUrl(url?: string): string {
  if (!url) return 'https://placeholder.supabase.co'
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
  } catch {}
  return 'https://placeholder.supabase.co'
}

export function createClient() {
  return createBrowserClient<Database>(
    getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'
  )
}
