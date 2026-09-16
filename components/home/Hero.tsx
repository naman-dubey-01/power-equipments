import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'

export function Hero() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{ background: 'var(--color-navy-950)', paddingTop: 'var(--header-height)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60" />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1e6fd9, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f0a500, transparent)' }}
      />

      <div className="container-site relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Copy */}
          <div className="animate-fade-up">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8" style={{ background: 'var(--color-amber-500)' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-amber-500)' }}>
                Bhopal · Indore · Central India
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
              style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1 }}
            >
              Electrical &amp;{' '}
              <span style={{ color: 'var(--color-blue-400)' }}>Industrial</span>
              <br />Solutions
            </h1>

            <p className="text-lg mb-8 max-w-lg leading-relaxed" style={{ color: 'var(--color-neutral-300)' }}>
              Reliable electrical products, drives, motors, lighting and switchgear for
              industrial applications, manufacturing facilities and commercial businesses
              across Central India.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn btn-primary btn-lg">
                Explore Products <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                Enquire Now
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { value: '15+', label: 'Years Experience' },
                { value: '500+', label: 'Products Available' },
                { value: '2', label: 'Office Locations' },
                { value: 'ISO', label: 'Certified Quality' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-neutral-400)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Main card */}
              <div
                className="rounded-2xl p-8 w-80"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1e6fd9, #0d2849)' }}
                  >
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">Product Catalog</div>
                    <div className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>Updated regularly</div>
                  </div>
                </div>

                {[
                  { name: 'VFDs & Drives', tag: 'Industrial' },
                  { name: 'Electric Motors', tag: 'Power' },
                  { name: 'LED Lighting', tag: 'Energy Saving' },
                  { name: 'Switchgear', tag: 'Safety' },
                ].map(({ name, tag }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--color-neutral-200)' }}>{name}</span>
                    <span className="badge badge-blue text-xs">{tag}</span>
                  </div>
                ))}

                <Link
                  href="/products"
                  className="flex items-center gap-1 mt-4 text-sm font-medium"
                  style={{ color: 'var(--color-blue-400)' }}
                >
                  View all products <ChevronRight size={14} />
                </Link>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -top-4 -right-4 rounded-xl px-4 py-3 text-center"
                style={{
                  background: 'linear-gradient(135deg, #f0a500, #b87800)',
                  color: 'var(--color-navy-950)',
                }}
              >
                <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>B2B</div>
                <div className="text-xs font-semibold">Industrial</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }}
      />
    </section>
  )
}
