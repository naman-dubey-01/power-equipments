'use server'

import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'
import type { Database } from '@/types/database'

type ActionResult = { success: boolean; error?: string; id?: string }
type CertificateRow = Database['public']['Tables']['certificates']['Row']

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  issuer: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  image_path: z.string().optional().nullable(),
  document_path: z.string().optional().nullable(),
  valid_from: z.string().max(20).optional().nullable(),
  valid_until: z.string().max(20).optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
})

export type CertificateFormData = z.infer<typeof certificateSchema>

export async function listAdminCertificates() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('certificates').select('*').order('sort_order')
  if (error) throw new Error(error.message)
  return (data ?? []) as CertificateRow[]
}

export async function saveCertificate(input: CertificateFormData, id?: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = certificateSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid certificate data' }
    }

    const data = {
      ...parsed.data,
      document_path: parsed.data.document_path || null,
      image_path: parsed.data.image_path || null,
    }

    if (id) {
      const { error } = await supabase.from('certificates').update(data).eq('id', id)
      if (error) return { success: false, error: error.message }
      return { success: true, id }
    }

    const { data: created, error } = await supabase.from('certificates').insert(data).select('id').single()
    if (error) return { success: false, error: error.message }
    return { success: true, id: created.id }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleCertificateStatus(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { data: current } = await supabase.from('certificates').select('is_active').eq('id', id).maybeSingle()
    if (!current) return { success: false, error: 'Certificate not found' }
    const { error } = await supabase.from('certificates').update({ is_active: !current.is_active }).eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('certificates').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}