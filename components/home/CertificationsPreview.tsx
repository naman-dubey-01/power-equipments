import Link from 'next/link'
import { ArrowRight, Award } from 'lucide-react'
import type { Database } from '@/types/database'

type Certificate = Database['public']['Tables']['certificates']['Row']

interface CertificationsPreviewProps {
  certificates?: Certificate[]
}

const fallbackCerts = [
  { id: 'f1', title: 'ISO 9001:2015 Quality Management', issuer: 'Bureau Veritas', description: 'Certified quality management system for electrical products supply.' },
  { id: 'f2', title: 'Authorized Channel Partner', issuer: 'ABB India', description: 'Authorized distribution partner for ABB drives and automation products.' },
  { id: 'f3', title: 'Trade License', issuer: 'Municipal Corporation Bhopal', description: 'Valid trade registration for electrical equipment supply business.' },
]

export function CertificationsPreview({ certificates }: CertificationsPreviewProps) {
  const items = (certificates && certificates.length > 0 ? certificates : fallbackCerts)

  return (
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Credentials</span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}
            >
              Certificates &amp; Accreditations
            </h2>
          </div>
          <Link href="/certificates" className="flex items-center gap-1 text-sm font-medium shrink-0" style={{ color: 'var(--color-brand)' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((cert) => (
            <div key={cert.id} className="card-base p-5 flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-blue-100)' }}
              >
                <Award size={18} style={{ color: 'var(--color-brand)' }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-navy-900)' }}>
                  {cert.title}
                </h3>
                {cert.issuer && (
                  <div className="text-xs mb-2 font-medium" style={{ color: 'var(--color-brand)' }}>{cert.issuer}</div>
                )}
                {cert.description && (
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{cert.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
