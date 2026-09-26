import { listAdminCategories } from '@/lib/actions/categories'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata = { title: 'Add Product — Admin' }

export default async function AdminNewProductPage() {
  let categories: { id: string; name: string; slug: string }[] = []
  try {
    const result = await listAdminCategories()
    categories = result.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
  } catch {}

  return (
    <div className="max-w-4xl">
      <ProductForm categories={categories} />
    </div>
  )
}