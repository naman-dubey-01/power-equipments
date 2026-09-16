import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Phone, Mail, MapPin, Zap, Clock } from 'lucide-react'

export async function Footer() {
  let company: {
    company_name: string
    tagline: string | null
    email: string | null
    primary_phone: string | null
    whatsapp: string | null
    office_hours: string | null
  } = {
    company_name: 'Power Equipments',
    tagline: 'Electrical & Industrial Solutions',
    email: 'contact@powerequipments.in',
    primary_phone: '+91 755 400 0001',
    whatsapp: '+91 98765 43210',
    office_hours: 'Mon–Sat: 9:30 AM – 6:30 PM',
  }

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('company_settings')
      .select('company_name,tagline,email,primary_phone,whatsapp,office_hours')
      .limit(1)
      .single()

    if (data) company = { ...company, ...data }
  } catch {}

  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--color-navy-950)', color: 'var(--color-neutral-300)' }}>
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1e6fd9, #0d2849)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Zap size={18} strokeWidth={2.5} style={{ color: '#f0a500' }} />
              </div>
              <div>
                <span className="block font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {company.company_name}
                </span>
                <span className="block text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                  {company.tagline}
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>
              Your trusted partner for electrical and industrial equipment in Central India. Serving businesses in Bhopal, Indore and across Madhya Pradesh.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Our Products', href: '/products' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Certificates', href: '/certificates' },
                { label: 'Contact Us', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'var(--color-neutral-400)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Products</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                'VFDs & Drives',
                'Electric Motors',
                'LED Lighting',
                'Wires & Cables',
                'Switchgears',
                'Industrial Panels',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/products"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'var(--color-neutral-400)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="flex flex-col gap-3">
              {company.primary_phone && (
                <li>
                  <a
                    href={`tel:${company.primary_phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
                    style={{ color: 'var(--color-neutral-400)' }}
                  >
                    <Phone size={14} className="shrink-0" style={{ color: 'var(--color-blue-400)' }} />
                    {company.primary_phone}
                  </a>
                </li>
              )}
              {company.email && (
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
                    style={{ color: 'var(--color-neutral-400)' }}
                  >
                    <Mail size={14} className="shrink-0" style={{ color: 'var(--color-blue-400)' }} />
                    {company.email}
                  </a>
                </li>
              )}
              <li>
                <div className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--color-neutral-400)' }}>
                  <MapPin size={14} className="shrink-0" style={{ color: 'var(--color-blue-400)' }} />
                  Bhopal &amp; Indore, Madhya Pradesh
                </div>
              </li>
              {company.office_hours && (
                <li>
                  <div className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--color-neutral-400)' }}>
                    <Clock size={14} className="shrink-0" style={{ color: 'var(--color-blue-400)' }} />
                    {company.office_hours}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--color-neutral-500)' }}>
          <span>© {currentYear} {company.company_name}. All rights reserved.</span>
          <span>Electrical &amp; Industrial Solutions — Central India</span>
        </div>
      </div>
    </footer>
  )
}
