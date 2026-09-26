import { listAdminCategories } from '@/lib/actions/categories'
import { CategoriesTable } from '@/components/admin/CategoriesTable'

export const metadata = { title: 'Categories — Admin' }

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof listAdminCategories>> = []
  let loadError: string | undefined

  try {
    categories = await listAdminCategories()
  } catch (e) {
    loadError = (e as Error).message
  }

  return <CategoriesTable categories={categories} loadError={loadError} />
}