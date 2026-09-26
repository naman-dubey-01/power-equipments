import { listAdminSubmissions } from '@/lib/actions/contact'
import { EnquiriesInbox } from '@/components/admin/EnquiriesInbox'

export const metadata = { title: 'Enquiries — Admin' }

export default async function AdminEnquiriesPage() {
  let enquiries: Awaited<ReturnType<typeof listAdminSubmissions>> = []
  let loadError: string | undefined

  try {
    enquiries = await listAdminSubmissions()
  } catch (e) {
    loadError = (e as Error).message
  }

  return <EnquiriesInbox enquiries={enquiries} loadError={loadError} />
}