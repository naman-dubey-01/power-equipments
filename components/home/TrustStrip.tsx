import { MapPin, Award, Zap, Users, Clock } from 'lucide-react'

const trustItems = [
  { icon: MapPin, label: 'Central India Presence', sub: 'Bhopal & Indore offices' },
  { icon: Clock, label: '15+ Years in Business', sub: 'Established & experienced' },
  { icon: Zap, label: 'Electrical Specialists', sub: 'Drives, motors, lighting' },
  { icon: Award, label: 'Quality Products', sub: 'Trusted brands & ISO certified' },
  { icon: Users, label: 'B2B Focus', sub: 'Industrial & commercial clients' },
]

export function TrustStrip() {
  return (
    <section style={{ background: 'var(--color-navy-900)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container-site py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
          {trustItems.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-2 px-2"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-1"
                style={{ background: 'rgba(30, 111, 217, 0.15)', border: '1px solid rgba(30, 111, 217, 0.2)' }}
              >
                <Icon size={18} style={{ color: 'var(--color-blue-400)' }} />
              </div>
              <div className="text-sm font-semibold text-white">{label}</div>
              <div className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
