import Link from 'next/link'
import { ArrowRight, Layers } from 'lucide-react'
import type { Database } from '@/types/database'

type Category = Database['public']['Tables']['categories']['Row']

// Fallback categories shown before DB is configured
const fallbackCategories: Partial<Category>[] = [
  { id: 'f1', name: 'VFDs & Drives', slug: 'vfds-drives', description: 'Variable frequency drives for precise motor speed control and energy savings.' },
  { id: 'f2', name: 'Electric Motors', slug: 'electric-motors', description: 'Industrial motors for pumps, fans, compressors and manufacturing equipment.' },
  { id: 'f3', name: 'LED Lighting', slug: 'led-lighting', description: 'High-efficiency LED solutions for industrial, commercial and outdoor applications.' },
  { id: 'f4', name: 'Wires & Cables', slug: 'wires-cables', description: 'Power cables, control cables and flexible wires for all electrical installations.' },
  { id: 'f5', name: 'Switchgear', slug: 'switchgear', description: 'MCBs, MCCBs, contactors and protection devices for safe electrical distribution.' },
  { id: 'f6', name: 'Industrial Panels', slug: 'industrial-panels', description: 'MCC, PCC and custom control panels built for industrial automation.' },
]

interface ProductCategoriesProps {
  categories?: Category[]
}

export function ProductCategories({ categories }: ProductCategoriesProps) {
  const items = (categories && categories.length > 0 ? categories : fallbackCategories) as Category[]

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
          {items.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/category/${cat.slug}`}
              className="card-base group flex flex-col overflow-hidden"
            >
              {/* Category image or icon fallback */}
              <div
                className="flex items-center justify-center h-40 shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--color-navy-900) 0%, var(--color-navy-700) 100%)',
                }}
              >
                {cat.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.image_url}
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
          ))}
        </div>
      </div>
    </section>
  )
}
