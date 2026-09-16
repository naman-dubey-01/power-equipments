import { Shield, Headphones, Package, MapPin, Award, Clock } from 'lucide-react'

const reasons = [
  {
    icon: Package,
    title: 'Wide Product Range',
    desc: 'VFDs, motors, LED lighting, cables, switchgear and industrial panels — all from one reliable source.',
  },
  {
    icon: Shield,
    title: 'Genuine Products Only',
    desc: 'We supply authentic products from authorized distribution channels. No counterfeits.',
  },
  {
    icon: Headphones,
    title: 'Technical Know-How',
    desc: 'Our team understands electrical applications and can recommend the right product for your need.',
  },
  {
    icon: MapPin,
    title: 'Local Presence',
    desc: 'Bhopal and Indore offices mean fast quotation, quick delivery and easy after-sales support.',
  },
  {
    icon: Clock,
    title: 'Responsive Service',
    desc: 'Prompt enquiry responses and accurate technical quotations — your time matters.',
  },
  {
    icon: Award,
    title: 'Trusted by Industry',
    desc: 'Years of consistent service to manufacturers, contractors and businesses across Central India.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-navy-900)' }}>
      <div className="container-site">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="section-label">Why Power Equipments</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 hover:translate-y-[-2px]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(30, 111, 217, 0.2)', border: '1px solid rgba(30, 111, 217, 0.3)' }}
              >
                <Icon size={18} style={{ color: 'var(--color-blue-400)' }} />
              </div>
              <div>
                <h3 className="font-semibold text-base text-white mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
