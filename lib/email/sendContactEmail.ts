/**
 * Sends the contact enquiry notification email via Resend.
 * Best-effort: returns false silently when the API key is not configured
 * so the contact form submission still succeeds on the public site.
 */
export async function sendContactEmail(input: {
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  subject?: string | null
  message: string
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'contact@powerequipments.in'

  if (!apiKey || !apiKey.startsWith('re_')) {
    return false
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: 'Power Equipments <onboarding@resend.dev>',
      to: [receiver],
      replyTo: input.email || undefined,
      subject: `New enquiry: ${input.subject || 'Website contact form'}`,
      text: [
        `Name: ${input.name}`,
        input.email ? `Email: ${input.email}` : null,
        input.phone ? `Phone: ${input.phone}` : null,
        input.company ? `Company: ${input.company}` : null,
        `Subject: ${input.subject || '—'}`,
        '',
        input.message,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    return !error
  } catch {
    return false
  }
}