import { listAdminCertificates } from '@/lib/actions/certificates'
import { CertificatesTable } from '@/components/admin/CertificatesTable'

export const metadata = { title: 'Certificates — Admin' }

export default async function AdminCertificatesPage() {
  let certificates: Awaited<ReturnType<typeof listAdminCertificates>> = []
  let loadError: string | undefined

  try {
    certificates = await listAdminCertificates()
  } catch (e) {
    loadError = (e as Error).message
  }

  return <CertificatesTable certificates={certificates} loadError={loadError} />
}