import { createClient } from '@/lib/supabase/server'
import { HeaderClient } from './HeaderClient'

export async function Header() {
  let categories: { id: string; name: string; slug: string; sort_order: number }[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(20)

    categories = (data as any) ?? []
  } catch {
    // Supabase not configured yet — categories will be empty
  }

  return <HeaderClient categories={categories as any} />
}
