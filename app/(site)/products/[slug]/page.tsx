import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Package, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react'
import { resolveImageUrl } from '@/lib/utils'
import type { Database } from '@/types/database'

type T = Database['public']['Tables']
type ProductWithRel = T['products']['Row'] & {
  categories: { name: string; slug: string } | null
  product_images: T['product_images']['Row'][]
}
type ProductImageWithUrl = T['product_images']['Row'] & { url: string }
type ProductMeta = { name: string; short_description: string | null; seo_title: string | null; seo_description: string | null }

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  let product: ProductMeta | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('name, short_description, seo_title, seo_description')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    product = (data as unknown as ProductMeta | null)
  } catch {}

  const title =
    product?.seo_title ||
    product?.name ||
    slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const description =
    product?.seo_description ||
    product?.short_description ||
    `High quality electrical and industrial product — ${title} from Power Equipments.`

  return generatePageMetadata({
    title,
    description,
    path: `/products/${slug}`,
  })
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  let product: ProductWithRel | null = null
  let relatedProducts: (T['products']['Row'] & { categories: null })[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*, categories(name, slug), product_images(id, storage_path, alt_text, is_primary, sort_order)')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    product = (data as unknown as ProductWithRel)

    if (product?.category_id) {
      const { data: related } = await supabase
        .from('products')
        .select('id, name, slug, brand, short_description')
        .eq('category_id', product.category_id)
        .eq('is_active', true)
        .neq('id', product.id)
        .order('sort_order')
        .limit(3)
      relatedProducts = (related as unknown as (T['products']['Row'] & { categories: null })[]) ?? []
    }
  } catch {}

  if (!product) notFound()

  const categoryName = product.categories?.name ?? 'Products'
  const categorySlug = product.categories?.slug ?? null

  const images = (product.product_images ?? [])
    .map((img) => ({ ...img, url: resolveImageUrl(img.storage_path) }))
    .filter((img) => img.url) as ProductImageWithUrl[]
  images.sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
  const primaryImage = images[0]

  const specifications: { label: string; value: string }[] = Array.isArray(product.specifications)
    ? (product.specifications as unknown as { label: string; value: string }[])
    : []

  return (
    <div style={{ paddingTop: 'var(--header-height)' }}>
      {/* Breadcrumb Header */}
      <section className="py-10" style={{ background: 'linear-gradient(135deg, var(--color-navy-950), var(--color-navy-800))' }}>
        <div className="container-site">
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--color-neutral-400)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            {categorySlug && (
              <>
                <ChevronRight size={12} />
                <Link href={`/products/category/${categorySlug}`} className="hover:text-white transition-colors">
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
          </nav>

          <Link href="/products" className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white transition-colors mb-4">
            <ArrowLeft size={14} /> Back to all products
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h1>
          {product.brand && (
            <span className="badge badge-amber text-xs font-semibold">{product.brand}</span>
          )}
        </div>
      </section>

      {/* Main Details Section */}
      <section className="py-12 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Product Image Preview */}
            <div className="lg:col-span-5">
              {primaryImage ? (
                <div className="card-base p-2 min-h-[340px] flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primaryImage.url}
                    alt={primaryImage.alt_text || product.name}
                    className="w-full h-auto max-h-[420px] object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="card-base p-8 flex flex-col items-center justify-center min-h-[340px] text-center" style={{ background: 'linear-gradient(135deg, #f8fafc, #edf2f7)' }}>
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                    <Package size={48} strokeWidth={1.5} />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-1">Authentic Equipment</span>
                  <span className="text-sm font-semibold text-neutral-700">{product.name}</span>
                </div>
              )}

              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-lg overflow-hidden border border-neutral-200"
                      style={{ aspectRatio: '1/1', background: '#f4f6fa' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.alt_text || product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="card-base p-4 flex items-center gap-3">
                  <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                  <div>
                    <span className="block text-xs font-semibold text-neutral-900">100% Genuine</span>
                    <span className="block text-[11px] text-neutral-500">Authorized Supplier</span>
                  </div>
                </div>
                <div className="card-base p-4 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
                  <div>
                    <span className="block text-xs font-semibold text-neutral-900">Direct Support</span>
                    <span className="block text-[11px] text-neutral-500">Bhopal &amp; Indore</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information & Enquiry Box */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {product.sku && (
                    <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded border border-neutral-200">
                      SKU: {product.sku}
                    </span>
                  )}
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Available for Supply
                  </span>
                </div>

                {product.short_description && (
                  <p className="text-base text-neutral-700 leading-relaxed mb-6">
                    {product.short_description}
                  </p>
                )}

                {product.description && (
                  <div className="mb-6 p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-sm text-neutral-600 leading-relaxed">
                    {product.description}
                  </div>
                )}

                {specifications.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}>
                      Specifications &amp; Features
                    </h3>
                    <div className="border border-neutral-200 rounded-lg overflow-hidden mb-8">
                      <table className="w-full text-sm text-left">
                        <tbody>
                          <tr className="border-b border-neutral-100 bg-neutral-50/50">
                            <td className="px-4 py-2.5 font-medium text-neutral-600 w-1/3">Brand / Manufacturer</td>
                            <td className="px-4 py-2.5 text-neutral-900 font-semibold">{product.brand || 'Power Equipments Partner'}</td>
                          </tr>
                          <tr className="border-b border-neutral-100">
                            <td className="px-4 py-2.5 font-medium text-neutral-600">Category</td>
                            <td className="px-4 py-2.5 text-neutral-900">{categoryName}</td>
                          </tr>
                          {specifications.map((spec, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'border-b border-neutral-100 bg-neutral-50/50' : 'border-b border-neutral-100'}>
                              <td className="px-4 py-2.5 font-medium text-neutral-600">{spec.label}</td>
                              <td className="px-4 py-2.5 text-neutral-900">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              {/* Instant Enquiry Box */}
              <div className="card-base p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-blue-950 mb-1">Require Pricing or Quotation?</h4>
                    <p className="text-xs text-blue-800">Send us an enquiry with your quantity requirements for custom industrial quotes.</p>
                  </div>
                  <Link
                    href={`/contact?subject=Quotation%20Enquiry%20for%20${encodeURIComponent(product.name)}`}
                    className="btn btn-primary shrink-0 flex items-center gap-2 text-sm"
                  >
                    <Send size={14} /> Request Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-neutral-50 border-t border-neutral-200">
          <div className="container-site">
            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}>
              Related Products in {categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedProducts.map((rel) => (
                <Link key={rel.id} href={`/products/${rel.slug}`} className="card-base p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    {rel.brand && <span className="badge badge-blue text-[10px] mb-2 self-start">{rel.brand}</span>}
                    <h4 className="font-semibold text-sm mb-1 text-navy-900">{rel.name}</h4>
                    <p className="text-xs text-neutral-500 line-clamp-2">{rel.short_description}</p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-medium text-blue-600 gap-1">
                    View Details <ChevronRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}