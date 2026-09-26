'use server'

import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'
import type { Database } from '@/types/database'

type ActionResult = { success: boolean; error?: string; id?: string }
type GalleryRow = Database['public']['Tables']['gallery_items']['Row']

const gallerySchema = z.object({
  title: z.string().max(200).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  storage_path: z.string().min(1, 'Image is required'),
  alt_text: z.string().max(200).optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
})

export type GalleryFormData = z.infer<typeof gallerySchema>

export async function listAdminGallery() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('gallery_items').select('*').order('sort_order')
  if (error) throw new Error(error.message)
  return (data ?? []) as GalleryRow[]
}

export async function saveGalleryItem(input: GalleryFormData, id?: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = gallerySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid gallery item' }
    }

    if (id) {
      const { error } = await supabase.from('gallery_items').update(parsed.data).eq('id', id)
      if (error) return { success: false, error: error.message }
      return { success: true, id }
    }

    const { data: created, error } = await supabase.from('gallery_items').insert(parsed.data).select('id').single()
    if (error) return { success: false, error: error.message }
    return { success: true, id: created.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleGalleryStatus(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { data: current } = await supabase.from('gallery_items').select('is_active').eq('id', id).maybeSingle()
    if (!current) return { success: false, error: 'Gallery item not found' }
    const { error } = await supabase.from('gallery_items').update({ is_active: !current.is_active }).eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('gallery_items').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function isSupabaseConfigured(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && anon && !url.includes('placeholder') && !anon.includes('placeholder'))
}