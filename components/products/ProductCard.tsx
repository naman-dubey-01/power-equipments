import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { resolveImageUrl } from '@/lib/utils'

interface ProductCardItem {
  id: string
  name: string
  slug: string
  short_description?: string | null
  brand?: string | null
  featured?: boolean
  product_images?: {
    id: string
    storage_path: string
    alt_text?: string | null
    is_primary?: boolean
  }[]
}

export function ProductCard({ product }: { product: ProductCardItem }) {
  const primary = product.product_images?.find((img) => img.is_primary)
  const imageSrc = resolveImageUrl(primary?.storage_path ?? product.product_images?.[0]?.storage_path)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-base group flex flex-col overflow-hidden"
    >
      <div
        className="h-44 flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8eef8)' }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={primary?.alt_text || product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Package size={40} strokeWidth={1} style={{ color: 'var(--color-blue-300)' }} />
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {product.brand && <span className="badge badge-blue">{product.brand}</span>}
          {product.featured && <span className="badge badge-amber">Featured</span>}
        </div>
        <h3
          className="font-semibold text-sm leading-snug mb-2"
          style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}
        >
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
  )
}