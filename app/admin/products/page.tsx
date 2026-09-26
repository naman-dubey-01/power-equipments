import { listAdminProducts } from '@/lib/actions/products'
import { ProductsTable } from '@/components/admin/ProductsTable'

export const metadata = { title: 'Products — Admin' }

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof listAdminProducts>> = []
  let loadError: string | undefined

  try {
    products = await listAdminProducts()
  } catch (e) {
    loadError = (e as Error).message
  }

  return <ProductsTable products={products} loadError={loadError} />
}