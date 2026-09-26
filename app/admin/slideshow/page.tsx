import { listAdminSlides } from '@/lib/actions/slides'
import { SlidesTable } from '@/components/admin/SlidesTable'

export const metadata = { title: 'Slideshow — Admin' }

export default async function AdminSlideshowPage() {
  let slides: Awaited<ReturnType<typeof listAdminSlides>> = []
  let loadError: string | undefined

  try {
    slides = await listAdminSlides()
  } catch (e) {
    loadError = (e as Error).message
  }

  return <SlidesTable slides={slides} loadError={loadError} />
}