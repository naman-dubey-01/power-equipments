import { createClient } from '@/lib/supabase/server'
import { HeaderClient } from './HeaderClient'
import type { Database } from '@/types/database'

type Category = Database['public']['Tables']['categories']['Row']

export async function Header() {
  let categories: Category[] = []
  let phone: string | null = null
  let companyName: string | null = null

  try {
    const supabase = await createClient()
    const [catsResult, companyResult] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, slug, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(20),
      supabase
        .from('company_settings')
        .select('primary_phone, company_name')
        .limit(1)
        .maybeSingle(),
    ])

    categories = (catsResult.data as Category[] | null) ?? []
    phone = companyResult.data?.primary_phone ?? null
    companyName = companyResult.data?.company_name ?? null
  } catch {
    // Supabase not configured yet — data stays empty
  }

  return (
    <HeaderClient
      categories={categories}
      phone={phone}
      companyName={companyName}
    />
  )
}