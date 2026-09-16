import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Award, FileText, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react'

export const metadata = generatePageMetadata({
  title: 'Certificates & Accreditation',
  description: 'View Power Equipments industry certifications, authorizations, and compliance documents for Bhopal & Indore.',
  path: '/certificates',
})

const defaultCertificates = [
  {
    id: 'cert-1',
    title: 'ISO 9001:2015 Quality Management Certificate',
    issuer: 'International Organization for Standardization',
    description: 'Certified for quality control and technical compliance in electrical distribution and industrial equipment supply.',
    valid_from: '2023',
    valid_until: '2028',
    document_path: 'https://powerequipments.in/docs/iso-certificate.pdf',
  },
  {
    id: 'cert-2',
    title: 'ABB Authorized Channel Partner & Distributor Certificate',
    issuer: 'ABB India Limited',
    description: 'Authorized distributor and service partner for ABB Variable Frequency Drives (VFDs) and Low Voltage Switchgear.',
    valid_from: '2020',
    valid_until: '2026',
    document_path: 'https://powerequipments.in/docs/abb-authorization.pdf',
  },
  {
    id: 'cert-3',
    title: 'CPRI Type-Test Compliance Certification',
    issuer: 'Central Power Research Institute (CPRI)',
    description: 'Verified type-test compliance for Motor Control Centres (MCC) and Power Control Panels.',
    valid_from: '2022',
    valid_until: '2027',
    document_path: 'https://powerequipments.in/docs/cpri-certification.pdf',
  },
]

export default async function CertificatesPage() {
  let certificates: any[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (data && data.length > 0) {
      certificates = data
    }
  } catch {}

  const displayCertificates = certificates.length > 0 ? certificates : defaultCertificates

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCertificates.map((cert) => (
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

                  <a
                    href={
                      cert.document_path && cert.document_path.startsWith('http')
                        ? cert.document_path
                        : '#contact'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm"
                  >
                    <FileText size={16} /> View Official Document
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
