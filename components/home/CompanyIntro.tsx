import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function CompanyIntro() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div
              className="rounded-2xl overflow-hidden h-80 lg:h-96 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-navy-900), var(--color-navy-700))' }}
            >
              <div className="text-center px-8">
                <div className="text-6xl mb-4">⚡</div>
                <div className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Power Equipments
                </div>
                <div style={{ color: 'var(--color-neutral-400)' }} className="text-sm">
                  Established · Trusted · Technical
                </div>
              </div>
            </div>

            {/* Floating stat */}
            <div
              className="absolute -bottom-5 -right-4 sm:-right-6 rounded-xl p-4 shadow-xl"
              style={{ background: 'white', border: '1px solid var(--color-border)' }}
            >
              <div className="text-2xl font-bold" style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}>15+</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Years Serving<br />Central India</div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="section-label">About Power Equipments</span>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-5 text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}
            >
              Your Trusted Electrical &amp; Industrial Partner
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Power Equipments is a Bhopal-based electrical and industrial products supplier
              with over 15 years of experience serving businesses in Central India. We
              stock and supply drives, motors, lighting, cables, switchgear and more —
              with deep technical knowledge to match products to your application.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
              With offices in Bhopal and Indore, we serve manufacturers, contractors,
              facility managers and industrial businesses across Madhya Pradesh.
            </p>

            <ul className="flex flex-col gap-3 mb-8">
              {[
                'Authorized channel partner for leading global brands',
                'Technical team with hands-on application knowledge',
                'Fast quotation and reliable supply from Bhopal & Indore',
                'Custom industrial panels and solutions',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--color-blue-500)' }} />
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/about" className="btn btn-primary">
              Learn More About Us <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
