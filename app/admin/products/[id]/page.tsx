import { notFound } from 'next/navigation'
import { getAdminProduct } from '@/lib/actions/products'
import { listAdminCategories } from '@/lib/actions/categories'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductImages } from '@/components/admin/ProductImages'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Edit Product — Admin' }

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  let product: Awaited<ReturnType<typeof getAdminProduct>> = null
  let categories: { id: string; name: string; slug: string }[] = []

  try {
    product = await getAdminProduct(id)
    const result = await listAdminCategories()
    categories = result.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
  } catch {}

  if (!product) notFound()

  return (
    <div className="max-w-4xl space-y-6">
      <ProductForm product={product} categories={categories} />
      <ProductImages productId={product.id} images={product.product_images ?? []} />
    </div>
  )
}