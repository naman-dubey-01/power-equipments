'use server'

import { requireAdmin } from '@/lib/auth'
import { productSchema, type ProductFormData } from '@/lib/validation/schemas'
import { slugify } from '@/lib/utils'
import type { Database } from '@/types/database'

type ActionResult = { success: boolean; error?: string; id?: string }
type ProductRow = Database['public']['Tables']['products']['Row']

export async function listAdminProducts() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, slug, brand, sku, featured, is_active, sort_order, category_id, categories(name, slug)'
    )
    .order('sort_order')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as (Pick<ProductRow, 'id' | 'name' | 'slug' | 'brand' | 'sku' | 'featured' | 'is_active' | 'sort_order' | 'category_id'> & {
    categories: { name: string; slug: string } | null
  })[]
}

export async function getAdminProduct(id: string) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug), product_images(id, storage_path, alt_text, sort_order, is_primary)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as unknown as (Omit<ProductRow, 'specifications'> & {
    specifications: { label: string; value: string }[] | null
    categories: { id: string; name: string; slug: string } | null
    product_images: { id: string; storage_path: string; alt_text: string | null; sort_order: number; is_primary: boolean }[]
  }) | null
}

export async function saveProduct(input: ProductFormData, id?: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = productSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid product data' }
    }

    const data = {
      ...parsed.data,
      slug: slugify(parsed.data.name),
      category_id: parsed.data.category_id || null,
      specifications: parsed.data.specifications ?? [],
    }

    if (id) {
      const { error } = await supabase.from('products').update(data).eq('id', id)
      if (error) return { success: false, error: error.message }
      return { success: true, id }
    }

    const { data: created, error } = await supabase.from('products').insert(data).select('id').single()
    if (error) return { success: false, error: error.message }
    return { success: true, id: created.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleProductStatus(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { data: current } = await supabase.from('products').select('is_active, featured').eq('id', id).maybeSingle()
    if (!current) return { success: false, error: 'Product not found' }
    const { error } = await supabase
      .from('products')
      .update({ is_active: !current.is_active })
      .eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleProductFeatured(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { data: current } = await supabase.from('products').select('is_active, featured').eq('id', id).maybeSingle()
    if (!current) return { success: false, error: 'Product not found' }
    const { error } = await supabase
      .from('products')
      .update({ featured: !current.featured })
      .eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function saveProductImage(
  productId: string,
  image: { storage_path: string; alt_text?: string | null },
  isPrimary = false
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    if (isPrimary) {
      await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId)
    }
    const { error } = await supabase.from('product_images').insert({
      product_id: productId,
      storage_path: image.storage_path,
      alt_text: image.alt_text ?? image.storage_path,
      is_primary: isPrimary,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function setProductImagePrimary(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { data: img } = await supabase.from('product_images').select('product_id').eq('id', id).maybeSingle()
    if (!img) return { success: false, error: 'Image not found' }
    await supabase.from('product_images').update({ is_primary: false }).eq('product_id', img.product_id)
    const { error } = await supabase.from('product_images').update({ is_primary: true }).eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteProductImage(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('product_images').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}