'use server'

import { requireAdmin } from '@/lib/auth'
import { companySettingsSchema, type CompanySettingsFormData } from '@/lib/validation/schemas'
import type { Database } from '@/types/database'

type ActionResult = { success: boolean; error?: string }
type CompanySettingsRow = Database['public']['Tables']['company_settings']['Row']

export async function getAdminCompanySettings() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('company_settings').select('*').maybeSingle()
  if (error) throw new Error(error.message)
  return (data ?? null) as CompanySettingsRow | null
}

export async function saveCompanySettings(input: CompanySettingsFormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const parsed = companySettingsSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid settings data' }
    }

    const existing = await supabase.from('company_settings').select('id').maybeSingle()
    if (existing.data) {
      const { error } = await supabase.from('company_settings').update(parsed.data).eq('id', existing.data.id)
      if (error) return { success: false, error: error.message }
    } else {
      const { error } = await supabase.from('company_settings').insert(parsed.data)
      if (error) return { success: false, error: error.message }
    }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}