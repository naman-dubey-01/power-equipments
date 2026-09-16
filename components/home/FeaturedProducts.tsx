import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import type { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']

interface FeaturedProductsProps {
  products?: Product[]
}

const fallbackProducts: Partial<Product>[] = [
  {
    id: 'f1',
    name: 'ABB ACS880 Variable Frequency Drive',
    brand: 'ABB',
    short_description: 'Industrial AC drives for demanding applications. Precise speed control, energy savings and built-in safety.',
    slug: 'abb-acs880-vfd',
  },
  {
    id: 'f2',
    name: 'Siemens SIMOTICS Low Voltage Motor',
    brand: 'Siemens',
    short_description: 'Highly efficient IE3/IE4 class motors for pumps, fans, compressors and general industrial use.',
    slug: 'siemens-simotics-motor',
  },
  {
    id: 'f3',
    name: 'Philips Highbay LED Luminaire',
    brand: 'Philips',
    short_description: 'Industrial-grade LED highbay with 150 lm/W efficacy, ideal for warehouses and manufacturing floors.',
    slug: 'philips-highbay-led',
  },
]

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const items = (products && products.length > 0 ? products : fallbackProducts) as Product[]

  return (
    <section className="section-padding" style={{ background: '#f8f9fb' }}>
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Featured Products</span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}
            >
              Highlighted Products
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium shrink-0"
            style={{ color: 'var(--color-brand)' }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="card-base group flex flex-col overflow-hidden"
            >
              {/* Product image */}
              <div
                className="h-48 flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eef8 100%)' }}
              >
                <Package size={48} strokeWidth={1} style={{ color: 'var(--color-blue-300)' }} />
              </div>

              <div className="p-5 flex flex-col flex-1">
                {product.brand && (
                  <span className="badge badge-blue mb-3 self-start">{product.brand}</span>
                )}
                <h3
                  className="font-semibold text-base mb-2 leading-snug"
                  style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}
                >
                  {product.name}
                </h3>
                {product.short_description && (
                  <p className="text-sm flex-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {product.short_description}
                  </p>
                )}
                <div
                  className="flex items-center gap-1 mt-4 text-sm font-medium transition-all group-hover:gap-2"
                  style={{ color: 'var(--color-brand)' }}
                >
                  View Product <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
