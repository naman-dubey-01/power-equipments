import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'
import { Search, Package, ChevronRight } from 'lucide-react'
import { CategorySidebar } from '@/components/products/CategorySidebar'
import { ProductCard } from '@/components/products/ProductCard'
import type { Database } from '@/types/database'

type T = Database['public']['Tables']
type ProductWithImage = T['products']['Row'] & { product_images: T['product_images']['Row'][] }

export const metadata = generatePageMetadata({
  title: 'Products',
  description: 'Browse our full range of electrical and industrial products — VFDs, motors, LED lighting, wires & cables, switchgear and more.',
  path: '/products',
})

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''

  let products: ProductWithImage[] = []
  let categories: T['categories']['Row'][] = []

  try {
    const supabase = await createClient()

    const [catsResult] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('sort_order'),
    ])
    categories = (catsResult.data as unknown as T['categories']['Row'][]) ?? []

    let productsQuery = supabase
      .from('products')
      .select(
        'id, name, slug, short_description, brand, category_id, featured, product_images(id, storage_path, alt_text, is_primary)'
      )
      .eq('is_active', true)

    if (query) {
      productsQuery = productsQuery.ilike('name', `%${query}%`)
    }

    const { data } = await productsQuery.order('sort_order').limit(60)
    products = (data as unknown as ProductWithImage[]) ?? []
  } catch {}

  return (
    <div style={{ paddingTop: 'var(--header-height)' }}>
      {/* Hero */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, var(--color-navy-950), var(--color-navy-800))' }}>
        <div className="container-site">
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--color-neutral-500)' }}>
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white">Products</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Our Products
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--color-neutral-300)' }}>
            Electrical and industrial products from trusted brands. All for businesses across Central India.
          </p>

          {/* Search */}
          <form method="GET" className="flex gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-neutral-500)' }} />
              <input
                name="q"
                defaultValue={query}
                type="search"
                placeholder="Search products..."
                className="form-input pl-10"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.15)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary shrink-0">Search</button>
          </form>
        </div>
      </section>

      <div className="container-site py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <CategorySidebar categories={categories} />

          {/* Products Grid */}
          <main className="flex-1">
            {query && (
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Showing results for <strong>&quot;{query}&quot;</strong>
                {' · '}
                <Link href="/products" className="text-blue-600 hover:underline">Clear</Link>
              </p>
            )}

            {products.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} strokeWidth={1} className="mx-auto mb-4" style={{ color: 'var(--color-text-subtle)' }} />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-navy-900)' }}>No products found</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Try a different search term or browse all categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Enquiry CTA */}
      <section className="py-16" style={{ background: 'var(--color-navy-900)' }}>
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>Can&apos;t find what you need?</h2>
          <p className="mb-6" style={{ color: 'var(--color-neutral-300)' }}>Contact us and we&apos;ll source it for you.</p>
          <Link href="/contact" className="btn btn-amber">Enquire Now</Link>
        </div>
      </section>
    </div>
  )
}