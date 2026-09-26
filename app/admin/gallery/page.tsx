import { listAdminGallery } from '@/lib/actions/gallery'
import { GalleryTable } from '@/components/admin/GalleryTable'

export const metadata = { title: 'Gallery — Admin' }

export default async function AdminGalleryPage() {
  let items: Awaited<ReturnType<typeof listAdminGallery>> = []
  let loadError: string | undefined

  try {
    items = await listAdminGallery()
  } catch (e) {
    loadError = (e as Error).message
  }

  return <GalleryTable items={items} loadError={loadError} />
}