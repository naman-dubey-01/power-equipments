import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Package, ChevronRight, Search } from 'lucide-react'
import { CategorySidebar } from '@/components/products/CategorySidebar'
import { ProductCard } from '@/components/products/ProductCard'
import type { Database } from '@/types/database'

type T = Database['public']['Tables']
type ProductWithImage = T['products']['Row'] & { product_images: T['product_images']['Row'][] }

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return generatePageMetadata({
    title: category?.name ? `${category.name} — Products` : 'Category Products',
    description: category?.description || `Browse ${category?.name ?? 'our'} product range.`,
    path: `/products/category/${slug}`,
  })
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { q } = await searchParams
  const query = q || ''

  let products: ProductWithImage[] = []
  let categories: T['categories']['Row'][] = []
  let category: T['categories']['Row'] | null = null

  try {
    const supabase = await createClient()

    const [catResult, catsResult, productsResult] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle(),
      supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('sort_order'),
      (async () => {
        const categoryIdResult = await supabase
          .from('categories')
          .select('id')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle()
        if (!categoryIdResult.data) return { data: [] }
        let productsQuery = supabase
          .from('products')
          .select(
            'id, name, slug, short_description, brand, category_id, featured, product_images(id, storage_path, alt_text, is_primary)'
          )
          .eq('category_id', categoryIdResult.data.id)
          .eq('is_active', true)
        if (query) {
          productsQuery = productsQuery.ilike('name', `%${query}%`)
        }
        return productsQuery.order('sort_order').limit(60)
      })(),
    ])

    category = (catResult.data as unknown as T['categories']['Row'] | null)
    categories = (catsResult.data as unknown as T['categories']['Row'][]) ?? []
    products = (productsResult.data as unknown as ProductWithImage[]) ?? []
  } catch {}

  if (!category) notFound()

  const categoryLabel = category.name.toUpperCase()

  return (
    <div style={{ paddingTop: 'var(--header-height)' }}>
      {/* Hero */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, var(--color-navy-950), var(--color-navy-800))' }}>
        <div className="container-site">
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--color-neutral-500)' }}>
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-white">Products</Link>
            <ChevronRight size={12} />
            <span className="text-white">{category.name}</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-amber uppercase tracking-wide text-xs">{categoryLabel}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg mb-8 max-w-2xl" style={{ color: 'var(--color-neutral-300)' }}>
              {category.description}
            </p>
          )}

          <form method="GET" className="flex gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-neutral-500)' }} />
              <input
                name="q"
                defaultValue={query}
                type="search"
                placeholder={`Search in ${category.name.toLowerCase()}...`}
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
          <CategorySidebar categories={categories} activeSlug={slug} />

          <main className="flex-1">
            {query && (
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Showing results for <strong>&quot;{query}&quot;</strong>
                {' · '}
                <Link href={`/products/category/${slug}`} className="text-blue-600 hover:underline">Clear</Link>
              </p>
            )}

            {products.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} strokeWidth={1} className="mx-auto mb-4" style={{ color: 'var(--color-text-subtle)' }} />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-navy-900)' }}>No products in this category</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Check back soon — new products are added regularly.
                </p>
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
    </div>
  )
}