import { generatePageMetadata } from '@/lib/seo/metadata'
import { CheckCircle, MapPin, Phone, Mail, Clock, Users, Award } from 'lucide-react'
import Link from 'next/link'

export const metadata = generatePageMetadata({
  title: 'About Us',
  description: 'Learn about Power Equipments — a trusted electrical and industrial products supplier in Central India with 15+ years of experience serving Bhopal, Indore and beyond.',
  path: '/about',
})

const timeline = [
  { year: '2008', event: 'Founded in Bhopal, Madhya Pradesh with a focus on industrial electrical products.' },
  { year: '2012', event: 'Expanded product portfolio to include VFDs and motor control systems.' },
  { year: '2015', event: 'Opened Indore branch to better serve clients across Central India.' },
  { year: '2018', event: 'Established authorized channel partnerships with leading global brands.' },
  { year: '2022', event: 'Launched custom panel-building services for industrial automation projects.' },
  { year: 'Today', event: 'Supplying 500+ products across drives, motors, lighting, cables and switchgear.' },
]

const capabilities = [
  'Variable Frequency Drives & Soft Starters',
  'AC/DC Motor Supply & Selection',
  'Industrial LED Lighting Design',
  'Wires, Cables & Cable Management',
  'LT Switchgear & Protection Devices',
  'Motor Control Centres (MCC)',
  'Power Control Centres (PCC)',
  'Custom Industrial Panels',
  'Energy Audit & Power Quality',
  'After-Sales Technical Support',
]

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 'var(--header-height)' }}>
      {/* Page Hero */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
        }}
      >
        <div className="container-site">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-neutral-500)' }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">About Us</span>
            </nav>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              About Power Equipments
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-neutral-300)' }}>
              A trusted electrical and industrial products supplier serving businesses
              across Central India since 2008.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="text-3xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}>
                Electrical Expertise, Built Over Years
              </h2>
              <div className="prose-content">
                <p>
                  Power Equipments was established in Bhopal with a clear purpose: to be
                  the reliable, technically knowledgeable electrical products supplier that
                  Central India's industrial businesses needed.
                </p>
                <p>
                  We focus on the products that matter most to our customers — drives,
                  motors, lighting, cables and switchgear — and we invest in understanding
                  them deeply. Our team doesn't just supply products; we understand
                  applications and help customers make the right choice.
                </p>
                <p>
                  Today we operate from two offices — Bhopal (head office) and Indore —
                  serving manufacturers, contractors, OEMs and facility managers across
                  Madhya Pradesh and beyond.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '15+', label: 'Years in Business' },
                { value: '2', label: 'Office Locations' },
                { value: '500+', label: 'Products in Portfolio' },
                { value: 'MP', label: 'Madhya Pradesh Focus' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="card-base p-6 text-center"
                >
                  <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-display)' }}>{value}</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="section-label">History</span>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}>
              Our Journey
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {timeline.map(({ year, event }, i) => (
              <div key={year} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: 'var(--color-navy-900)', color: 'white' }}
                  >
                    {year.slice(-2)}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="flex-1 w-px mt-2" style={{ background: 'var(--color-border)' }} />
                  )}
                </div>
                <div className="pt-2 pb-6">
                  <div className="font-semibold text-sm mb-1" style={{ color: 'var(--color-brand)' }}>{year}</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="section-label">What We Do</span>
              <h2 className="text-3xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}>
                Our Capabilities
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--color-blue-500)' }} />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{ background: 'var(--color-navy-900)' }}
            >
              <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Industries We Serve
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  '🏭 Manufacturing & Process Industries',
                  '🏗️ Construction & Infrastructure',
                  '💧 Water Treatment & Utilities',
                  '🏢 Commercial Buildings & Facilities',
                  '🌾 Agriculture & Food Processing',
                  '🔧 OEMs & Panel Builders',
                  '🔌 Electrical Contractors',
                ].map((item) => (
                  <li key={item} className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="section-padding" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="section-label">Our Locations</span>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}>
              Where to Find Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                name: 'Head Office — Bhopal',
                address: 'Bhopal, Madhya Pradesh, India',
                phone: '+91 755 400 0001',
                email: 'bhopal@powerequipments.in',
                hours: 'Mon–Sat: 9:30 AM – 6:30 PM',
                isHQ: true,
              },
              {
                name: 'Branch Office — Indore',
                address: 'Indore, Madhya Pradesh, India',
                phone: '+91 731 400 0002',
                email: 'indore@powerequipments.in',
                hours: 'Mon–Sat: 9:30 AM – 6:30 PM',
                isHQ: false,
              },
            ].map(({ name, address, phone, email, hours, isHQ }) => (
              <div key={name} className="card-base p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={16} style={{ color: 'var(--color-brand)' }} />
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}>{name}</h3>
                  {isHQ && <span className="badge badge-blue ml-auto">HQ</span>}
                </div>
                <ul className="flex flex-col gap-2.5">
                  <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <MapPin size={13} className="mt-0.5 shrink-0" /> {address}
                  </li>
                  <li>
                    <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                      <Phone size={13} /> {phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                      <Mail size={13} /> {email}
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <Clock size={13} /> {hours}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ background: 'var(--color-navy-900)' }}>
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Work Together?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--color-neutral-300)' }}>
            Get in touch with our team for product enquiries, technical support or a quotation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-amber btn-lg">Contact Us</Link>
            <Link href="/products" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
