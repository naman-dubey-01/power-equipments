import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { ContactForm } from '@/components/contact/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import type { Database } from '@/types/database'

type T = Database['public']['Tables']

export const metadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Power Equipments for industrial electrical solutions, product enquiries, and technical support in Central India.',
  path: '/contact',
})

interface ContactPageProps {
  searchParams: Promise<{ subject?: string }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { subject } = await searchParams
  let company: T['company_settings']['Row'] | null = null
  let offices: T['offices']['Row'][] = []

  try {
    const supabase = await createClient()
    const [companyRes, officesRes] = await Promise.all([
      supabase.from('company_settings').select('*').limit(1).maybeSingle(),
      supabase.from('offices').select('*').eq('is_active', true).order('sort_order'),
    ])

    company = companyRes.data as T['company_settings']['Row'] | null
    offices = (officesRes.data as T['offices']['Row'][]) ?? []
  } catch {}

  return (
    <div style={{ paddingTop: 'var(--header-height)' }}>
      <section
        className="py-16 md:py-20"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
        }}
      >
        <div className="container-site">
          <div className="max-w-2xl">
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Contact Us
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-neutral-300)' }}>
              We&apos;re here to help with your electrical and industrial requirements. Reach out to our team today.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Contact Information & Offices */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {offices.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}>
                    Our Offices
                  </h2>
                  <div className="flex flex-col gap-6">
                    {offices.map((office) => (
                      <div key={office.id} className="card-base p-6 border-l-4 border-l-blue-600">
                        <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-navy-900)' }}>{office.name}</h3>
                        <ul className="flex flex-col gap-3">
                          {office.address && (
                            <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                              <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-brand)' }} />
                              <span>
                                {office.address}
                                {(office.city || office.state || office.postal_code) && (
                                  <><br />{office.city} {office.state} {office.postal_code}</>
                                )}
                              </span>
                            </li>
                          )}
                          {office.phone && (
                            <li className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                              <Phone size={16} className="shrink-0" style={{ color: 'var(--color-brand)' }} />
                              <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="hover:text-blue-600 transition-colors">
                                {office.phone}
                              </a>
                            </li>
                          )}
                          {office.email && (
                            <li className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                              <Mail size={16} className="shrink-0" style={{ color: 'var(--color-brand)' }} />
                              <a href={`mailto:${office.email}`} className="hover:text-blue-600 transition-colors">
                                {office.email}
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {company?.office_hours && (
                <div className="card-base p-6 bg-white">
                  <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--color-navy-900)' }}>Business Hours</h3>
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <Clock size={16} className="shrink-0" style={{ color: 'var(--color-brand)' }} />
                    {company.office_hours}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm initialSubject={subject} />
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}