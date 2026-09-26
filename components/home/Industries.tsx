const industries = [
  { icon: '🏭', name: 'Manufacturing', desc: 'Drives, motors and automation components for production lines.' },
  { icon: '🏗️', name: 'Construction', desc: 'Cables, switchgear and lighting for building projects.' },
  { icon: '💧', name: 'Water & Utilities', desc: 'Pump drives and monitoring systems for water treatment.' },
  { icon: '🏢', name: 'Commercial Buildings', desc: 'Energy-efficient lighting and electrical distribution solutions.' },
  { icon: '🌾', name: 'Agriculture & Food', desc: 'Motor controls and power solutions for agro-industrial use.' },
  { icon: '🔧', name: 'OEM & Engineering', desc: 'Supplying panel builders and engineering contractors.' },
]

export function Industries() {
  return (
    <section
      className="section-padding grid-pattern"
      style={{ background: 'var(--color-bg-secondary)' }}
    >
      <div className="container-site">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="section-label">Industries Served</span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-balance"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}
          >
            Sectors We Serve
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map(({ icon, name, desc }) => (
            <div
              key={name}
              className="card-base group flex flex-col items-center text-center p-5 gap-3"
            >
              <div className="text-3xl mb-1">{icon}</div>
              <div className="font-semibold text-sm" style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}>
                {name}
              </div>
              <div className="text-xs leading-relaxed hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
