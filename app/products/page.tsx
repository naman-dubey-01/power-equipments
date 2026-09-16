import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'
import { Search, Package, ChevronRight } from 'lucide-react'

export const metadata = generatePageMetadata({
  title: 'Products',
  description: 'Browse our full range of electrical and industrial products — VFDs, motors, LED lighting, wires & cables, switchgear and more.',
  path: '/products',
})

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const categoryFilter = params.category || ''

  let products: any[] = []
  let categories: any[] = []

  try {
    const supabase = await createClient()

    const [catsResult] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('sort_order'),
    ])
    categories = catsResult.data ?? []

    let productsQuery = supabase
      .from('products')
      .select('id, name, slug, short_description, brand, category_id, featured')
      .eq('is_active', true)

    if (query) {
      productsQuery = productsQuery.ilike('name', `%${query}%`)
    }
    if (categoryFilter) {
      const cat = categories.find((c) => c.slug === categoryFilter)
      if (cat) productsQuery = productsQuery.eq('category_id', cat.id)
    }

    const { data } = await productsQuery.order('sort_order').limit(60)
    products = data ?? []
  } catch {}

  const fallbackProducts = [
    { id: 'f1', name: 'ABB ACS880 VFD', slug: 'abb-acs880', brand: 'ABB', short_description: 'Industrial AC drives for demanding applications.', featured: true },
    { id: 'f2', name: 'Siemens SIMOTICS Motor', slug: 'siemens-motor', brand: 'Siemens', short_description: 'High-efficiency motors for industrial use.', featured: false },
    { id: 'f3', name: 'Philips LED Highbay', slug: 'philips-highbay', brand: 'Philips', short_description: 'Energy-efficient LED lighting for warehouses.', featured: true },
    { id: 'f4', name: 'Polycab FR Wire', slug: 'polycab-fr-wire', brand: 'Polycab', short_description: 'Flame retardant copper conductor wires.', featured: false },
    { id: 'f5', name: 'L&T MCB', slug: 'lt-mcb', brand: 'L&T', short_description: 'Miniature circuit breakers for distribution.', featured: false },
    { id: 'f6', name: 'Schneider Contactor', slug: 'schneider-contactor', brand: 'Schneider', short_description: 'Industrial contactors for motor control.', featured: false },
  ]

  const displayProducts = products.length > 0 ? products : fallbackProducts

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
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="card-base p-4 sticky top-24">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-navy-900)' }}>Categories</h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/products"
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${!categoryFilter ? 'bg-blue-50 text-blue-600 font-medium' : 'text-neutral-700 hover:bg-neutral-100'}`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${categoryFilter === cat.slug ? 'bg-blue-50 text-blue-600 font-medium' : 'text-neutral-700 hover:bg-neutral-100'}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {query && (
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Showing results for <strong>"{query}"</strong>
                {' · '}
                <Link href="/products" className="text-blue-600 hover:underline">Clear</Link>
              </p>
            )}

            {displayProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} strokeWidth={1} className="mx-auto mb-4" style={{ color: 'var(--color-text-subtle)' }} />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-navy-900)' }}>No products found</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Try a different search term or browse all categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayProducts.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="card-base group flex flex-col overflow-hidden"
                  >
                    <div className="h-44 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8eef8)' }}>
                      <Package size={40} strokeWidth={1} style={{ color: 'var(--color-blue-300)' }} />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      {product.brand && (
                        <span className="badge badge-blue mb-2 self-start">{product.brand}</span>
                      )}
                      {product.featured && (
                        <span className="badge badge-amber mb-2 self-start">Featured</span>
                      )}
                      <h3 className="font-semibold text-sm leading-snug mb-2" style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}>
                        {product.name}
                      </h3>
                      {product.short_description && (
                        <p className="text-xs flex-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                          {product.short_description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: 'var(--color-brand)' }}>
                        View Product <ChevronRight size={12} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Enquiry CTA */}
      <section className="py-16" style={{ background: 'var(--color-navy-900)' }}>
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>Can't find what you need?</h2>
          <p className="mb-6" style={{ color: 'var(--color-neutral-300)' }}>Contact us and we'll source it for you.</p>
          <Link href="/contact" className="btn btn-amber">Enquire Now</Link>
        </div>
      </section>
    </div>
  )
}
