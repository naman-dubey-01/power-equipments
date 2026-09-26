'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { contactFormSchema, type ContactFormData } from '@/lib/validation/schemas'
import { sendContactEmail } from '@/lib/email/sendContactEmail'
import type { Database } from '@/types/database'

type ActionResult = { success: boolean; error?: string }
type SubmissionRow = Database['public']['Tables']['contact_submissions']['Row']

/**
 * Public contact form handler.
 * Validates on the server, stores the enquiry in Supabase, and sends a
 * best-effort notification email. Returns success even when the email
 * provider is unconfigured — the enquiry is still saved.
 */
export async function submitContact(input: ContactFormData): Promise<ActionResult> {
  try {
    const parsed = contactFormSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' }
    }

    const data = parsed.data

    // Honeypot filled -> silently drop, never reveal.
    if (data.honeypot) {
      return { success: true }
    }

    const supabase = await createClient()
    const { error } = await supabase.from('contact_submissions').insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      subject: data.subject || null,
      message: data.message,
    })

    // Surface real storage failures; when the Supabase tables are not yet
    // created we fall back to email-only rather than silent data loss.
    if (error && error.code !== 'PGRST204' && error.code !== 'PGRST205') {
      if (error.code === '42P01') {
        void sendContactEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          subject: data.subject,
          message: data.message,
        })
        return { success: true }
      }
      return { success: false, error: 'Enquiry could not be saved. Please try again.' }
    }

    void sendContactEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      subject: data.subject,
      message: data.message,
    })

    return { success: true }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function listAdminSubmissions() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw new Error(error.message)
  return (data ?? []) as SubmissionRow[]
}

const allowedStatuses = ['new', 'read', 'replied', 'archived'] as const

export async function updateSubmissionStatus(id: string, status: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
      return { success: false, error: 'Invalid status' }
    }
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status: status as 'new' | 'read' | 'replied' | 'archived' })
      .eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}