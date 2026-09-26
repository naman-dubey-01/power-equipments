'use server'

import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'
import type { Database } from '@/types/database'

type ActionResult = { success: boolean; error?: string; id?: string }
type SlideRow = Database['public']['Tables']['slides']['Row']

const slideSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().max(500).optional().nullable(),
  image_url: z.string().min(1, 'Image is required'),
  cta_text: z.string().max(100).optional().nullable(),
  cta_link: z.string().max(200).optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
})

export type SlideFormData = z.infer<typeof slideSchema>

export async function listAdminSlides() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('slides').select('*').order('sort_order')
  if (error) throw new Error(error.message)
  return (data ?? []) as SlideRow[]
}

export async function saveSlide(input: SlideFormData, id?: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = slideSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid slide data' }
    }

    if (id) {
      const { error } = await supabase.from('slides').update(parsed.data).eq('id', id)
      if (error) return { success: false, error: error.message }
      return { success: true, id }
    }

    const { data: created, error } = await supabase.from('slides').insert(parsed.data).select('id').single()
    if (error) return { success: false, error: error.message }
    return { success: true, id: created.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleSlideStatus(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { data: current } = await supabase.from('slides').select('is_active').eq('id', id).maybeSingle()
    if (!current) return { success: false, error: 'Slide not found' }
    const { error } = await supabase.from('slides').update({ is_active: !current.is_active }).eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteSlide(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('slides').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}