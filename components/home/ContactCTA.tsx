import Link from 'next/link'
import { Phone, Mail, ArrowRight } from 'lucide-react'

interface ContactCTAProps {
  phone?: string
  email?: string
}

export function ContactCTA({ phone = '+91 755 400 0001', email = 'contact@powerequipments.in' }: ContactCTAProps) {
  return (
    <section
      className="section-padding"
      style={{
        background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="container-site relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">Get in Touch</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-balance mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Need the Right Electrical Product?
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'var(--color-neutral-300)' }}>
            Talk to Power Equipments. We&apos;ll help you select the right product,
            provide a technical quotation, and ensure reliable supply.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/contact" className="btn btn-amber btn-lg">
              Contact Us <ArrowRight size={16} />
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="btn btn-lg"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <Phone size={16} /> Call Now
            </a>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              <Phone size={14} style={{ color: 'var(--color-blue-400)' }} />
              {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              <Mail size={14} style={{ color: 'var(--color-blue-400)' }} />
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
