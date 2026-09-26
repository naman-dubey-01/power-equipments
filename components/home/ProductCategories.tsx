import Link from 'next/link'
import { ArrowRight, Layers } from 'lucide-react'
import type { Database } from '@/types/database'
import { resolveImageUrl } from '@/lib/utils'

type Category = Database['public']['Tables']['categories']['Row']

interface ProductCategoriesProps {
  categories?: Category[]
  /** When no categories exist in the database yet, this static list keeps the
   *  home page engaging instead of collapsing to an empty section. */
  fallbackCategories?: Category[]
}

const DEFAULT_FALLBACK_CATEGORIES: Category[] = [
  { id: 'fallback-vfd', name: 'VFD Drives & Soft Starters', slug: 'vfd-drives', description: 'Variable frequency drives and soft starters for precise motor control.', image_url: null, created_at: '', updated_at: '', sort_order: 0, is_active: true },
  { id: 'fallback-motors', name: 'AC/DC Motors', slug: 'ac-dc-motors', description: 'Reliable motor supply and selection for every industrial application.', image_url: null, created_at: '', updated_at: '', sort_order: 1, is_active: true },
  { id: 'fallback-led', name: 'Industrial LED Lighting', slug: 'led-lighting', description: 'Energy-efficient lighting solutions for factories, warehouses and plants.', image_url: null, created_at: '', updated_at: '', sort_order: 2, is_active: true },
  { id: 'fallback-cables', name: 'Wires & Cables', slug: 'wires-cables', description: 'Power cables, control cables and cable management from leading brands.', image_url: null, created_at: '', updated_at: '', sort_order: 3, is_active: true },
  { id: 'fallback-switchgear', name: 'LT Switchgear & Protection', slug: 'lt-switchgear', description: 'Contactors, breakers and protection devices for safe distribution.', image_url: null, created_at: '', updated_at: '', sort_order: 4, is_active: true },
  { id: 'fallback-panels', name: 'Industrial Panels', slug: 'industrial-panels', description: 'Custom MCC, PCC and control panels engineered to your specification.', image_url: null, created_at: '', updated_at: '', sort_order: 5, is_active: true },
]

export function ProductCategories({ categories, fallbackCategories }: ProductCategoriesProps) {
  const fromDb = (categories && categories.length > 0 ? categories : []) as Category[]
  const usingFallback = fromDb.length === 0
  const items = (fromDb.length > 0 ? fromDb : (fallbackCategories ?? DEFAULT_FALLBACK_CATEGORIES)) as Category[]

  if (items.length === 0) return null

  return (
    <section className="section-padding" style={{ background: 'var(--color-bg)' }}>
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Product Categories</span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}
            >
              What We Supply
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium shrink-0"
            style={{ color: 'var(--color-brand)' }}
          >
            All Products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((cat) => {
            const imgSrc = resolveImageUrl(cat.image_url)
            return (
              <Link
                key={cat.id}
                href={usingFallback ? '/products' : `/products/category/${cat.slug}`}
                className="card-base group flex flex-col overflow-hidden"
              >
                {/* Category image or icon fallback */}
                <div
                  className="flex items-center justify-center h-40 shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-navy-900) 0%, var(--color-navy-700) 100%)',
                  }}
                >
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Layers size={40} strokeWidth={1.5} style={{ color: 'var(--color-blue-400)', opacity: 0.8 }} />
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}>
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm flex-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                      {cat.description}
                    </p>
                  )}
                  <div
                    className="flex items-center gap-1 mt-4 text-sm font-medium transition-colors group-hover:gap-2"
                    style={{ color: 'var(--color-brand)' }}
                  >
                    View Products <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
