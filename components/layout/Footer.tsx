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
  } | null = null
  let categories: { name: string; slug: string }[] = []
  let offices: { name: string | null; address: string | null; city: string | null; state: string | null }[] = []

  try {
    const supabase = await createClient()
    const [companyResult, catsResult, officesResult] = await Promise.all([
      supabase
        .from('company_settings')
        .select('company_name,tagline,email,primary_phone,whatsapp,office_hours')
        .limit(1)
        .maybeSingle(),
      supabase
        .from('categories')
        .select('name, slug')
        .eq('is_active', true)
        .order('sort_order')
        .limit(8),
      supabase
        .from('offices')
        .select('name, address, city, state')
        .eq('is_active', true)
        .order('sort_order')
        .limit(2),
    ])

    company = companyResult.data ?? null
    categories = companyResult.error ? [] : (catsResult.data ?? [])
    offices = companyResult.error ? [] : (officesResult.data ?? [])
  } catch {}

  const currentYear = new Date().getFullYear()
  const companyName = company?.company_name || 'Power Equipments'

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
                  {companyName}
                </span>
                {company?.tagline && (
                  <span className="block text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                    {company.tagline}
                  </span>
                )}
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
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products/category/${cat.slug}`}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'var(--color-neutral-400)' }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/products"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'var(--color-neutral-400)' }}
                  >
                    Browse All Products
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="flex flex-col gap-3">
              {company?.primary_phone && (
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
              {company?.email && (
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
              {offices.length > 0 && (
                <li>
                  <div className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-neutral-400)' }}>
                    <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-blue-400)' }} />
                    <span>
                      {offices.map((office, i) => (
                        <span key={i}>
                          {office.city || office.name}
                          {i < offices.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      , India
                    </span>
                  </div>
                </li>
              )}
              {company?.office_hours && (
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
          <span>© {currentYear} {companyName}. All rights reserved.</span>
          <span>Electrical &amp; Industrial Solutions — Central India</span>
        </div>
      </div>
    </footer>
  )
}