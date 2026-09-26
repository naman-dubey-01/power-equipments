'use server'

import { requireAdmin } from '@/lib/auth'
import { categorySchema, type CategoryFormData } from '@/lib/validation/schemas'
import type { Database } from '@/types/database'

type ActionResult = { success: boolean; error?: string; id?: string }
type CategoryRow = Database['public']['Tables']['categories']['Row']

export async function listAdminCategories() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('categories')
    .select('*, products(count)')
    .order('sort_order')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as (CategoryRow & { products: { count: number }[] })[]
}

export async function saveCategory(input: CategoryFormData, id?: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = categorySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid category data' }
    }

    const data = {
      name: parsed.data.name,
      slug: parsed.data.slug || slugify(parsed.data.name),
      description: parsed.data.description || null,
      image_url: parsed.data.image_url || null,
      sort_order: parsed.data.sort_order,
      is_active: parsed.data.is_active,
    }

    if (id) {
      const { error } = await supabase.from('categories').update(data).eq('id', id)
      if (error) return { success: false, error: error.message }
      return { success: true, id }
    }

    const { data: created, error } = await supabase.from('categories').insert(data).select('id').single()
    if (error) return { success: false, error: error.message }
    return { success: true, id: created.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleCategoryStatus(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { data: current } = await supabase.from('categories').select('is_active').eq('id', id).maybeSingle()
    if (!current) return { success: false, error: 'Category not found' }
    const { error } = await supabase.from('categories').update({ is_active: !current.is_active }).eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}