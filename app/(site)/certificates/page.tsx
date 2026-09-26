import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Award, FileText, Calendar, ShieldCheck } from 'lucide-react'
import { resolveImageUrl } from '@/lib/utils'
import type { Database } from '@/types/database'

export const metadata = generatePageMetadata({
  title: 'Certificates & Accreditation',
  description: 'View Power Equipments industry certifications, authorizations, and compliance documents for Bhopal & Indore.',
  path: '/certificates',
})

export default async function CertificatesPage() {
  let certificates: Database['public']['Tables']['certificates']['Row'][] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (data && data.length > 0) {
      certificates = data as Database['public']['Tables']['certificates']['Row'][]
    }
  } catch {}

  const displayCertificates = certificates

  return (
    <div style={{ paddingTop: 'var(--header-height)' }}>
      <section
        className="py-16 md:py-20 text-white"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
        }}
      >
        <div className="container-site">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/20">
              <ShieldCheck size={14} /> Verified Quality &amp; Compliance
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Certificates &amp; Credentials
            </h1>
            <p className="text-lg leading-relaxed text-slate-300">
              Official channel partner accreditations, ISO quality certifications, and CPRI compliance credentials for industrial equipment across Central India.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site">
          {displayCertificates.length === 0 ? (
            <div className="text-center py-24">
              <Award size={48} strokeWidth={1} className="mx-auto mb-4" style={{ color: 'var(--color-text-subtle)' }} />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-navy-900)' }}>No certificates listed yet</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Certification documents will be added here as they are verified.
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCertificates.map((cert) => {
              const documentUrl = resolveImageUrl(cert.document_path, 'certificate-files')
              return (
              <div key={cert.id} className="card-base p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Award size={26} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight mb-1 text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                        {cert.title}
                      </h3>
                      {cert.issuer && (
                        <p className="text-xs font-semibold text-blue-600">
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                  </div>

                  {cert.description && (
                    <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                      {cert.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  {(cert.valid_from || cert.valid_until) && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar size={14} className="text-slate-400" />
                      <span>
                        {cert.valid_from && `From: ${cert.valid_from}`}
                        {cert.valid_from && cert.valid_until && ' — '}
                        {cert.valid_until && `Valid until: ${cert.valid_until}`}
                      </span>
                    </div>
                  )}

                  {documentUrl ? (
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm"
                    >
                      <FileText size={16} /> View Official Document
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500">
                      <ShieldCheck size={16} /> Document available on request
                    </div>
                  )}
                </div>
              </div>
              )
            })}
          </div>
          )}
        </div>
      </section>
    </div>
  )
}
