import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'
import { ChevronRight, Package, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  let product: any = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('name, short_description')
      .eq('slug', slug)
      .single()
    product = data
  } catch {}

  const title = product?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const description = product?.short_description || `High quality electrical and industrial product — ${title} from Power Equipments.`

  return generatePageMetadata({
    title,
    description,
    path: `/products/${slug}`,
  })
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  let product: any = null
  let relatedProducts: any[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .single()

    product = data

    if (product?.category_id) {
      const { data: related } = await supabase
        .from('products')
        .select('id, name, slug, brand, short_description')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(3)
      relatedProducts = related ?? []
    }
  } catch {}

  // Fallback mock product if Supabase is unconfigured or product not found in DB
  const fallbackProduct = {
    id: 'f-detail',
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug: slug,
    brand: 'Premium Industrial',
    short_description: 'Industrial-grade equipment engineered for continuous heavy-duty operation with max efficiency and low maintenance.',
    description: `The ${slug.replace(/-/g, ' ')} is designed to meet strict industrial quality standards in power distribution, automation, and control systems. Trusted by manufacturing plants and commercial facilities across Bhopal, Indore, and Central India.`,
    category_name: 'Industrial Equipment',
    category_slug: 'industrial-equipment',
    sku: `PE-${slug.substring(0, 4).toUpperCase()}-2026`,
    specs: [
      { label: 'Manufacturer Warranty', value: '12 Months' },
      { label: 'Compliance Standard', value: 'IS / IEC Standards' },
      { label: 'Application', value: 'Industrial & Commercial Power Systems' },
      { label: 'Availability', value: 'In Stock / Prompt Delivery' },
    ]
  }

  const currentProduct = product || fallbackProduct
  const categoryName = product?.categories?.name || fallbackProduct.category_name
  const categorySlug = product?.categories?.slug || fallbackProduct.category_slug

  return (
    <div style={{ paddingTop: 'var(--header-height)' }}>
      {/* Breadcrumb Header */}
      <section className="py-10" style={{ background: 'linear-gradient(135deg, var(--color-navy-950), var(--color-navy-800))' }}>
        <div className="container-site">
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--color-neutral-400)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <ChevronRight size={12} />
            <Link href={`/products?category=${categorySlug}`} className="hover:text-white transition-colors">
              {categoryName}
            </Link>
            <ChevronRight size={12} />
            <span className="text-white font-medium truncate max-w-xs">{currentProduct.name}</span>
          </nav>
          
          <Link href="/products" className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white transition-colors mb-4">
            <ArrowLeft size={14} /> Back to all products
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {currentProduct.name}
          </h1>
          {currentProduct.brand && (
            <span className="badge badge-amber text-xs font-semibold">{currentProduct.brand}</span>
          )}
        </div>
      </section>

      {/* Main Details Section */}
      <section className="py-12 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Product Image Preview */}
            <div className="lg:col-span-5">
              <div className="card-base p-8 flex flex-col items-center justify-center min-h-[340px] text-center" style={{ background: 'linear-gradient(135deg, #f8fafc, #edf2f7)' }}>
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                  <Package size={48} strokeWidth={1.5} />
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-1">Authentic Equipment</span>
                <span className="text-sm font-semibold text-neutral-700">{currentProduct.name}</span>
              </div>

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
                  <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded border border-neutral-200">
                    SKU: {currentProduct.sku || `PE-${currentProduct.id.substring(0, 6).toUpperCase()}`}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Available for Supply
                  </span>
                </div>

                <p className="text-base text-neutral-700 leading-relaxed mb-6">
                  {currentProduct.short_description || currentProduct.description}
                </p>

                {currentProduct.description && currentProduct.short_description && (
                  <div className="mb-6 p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-sm text-neutral-600 leading-relaxed">
                    {currentProduct.description}
                  </div>
                )}

                {/* Product Specifications Table */}
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-navy-900)', fontFamily: 'var(--font-display)' }}>
                  Specifications &amp; Features
                </h3>
                <div className="border border-neutral-200 rounded-lg overflow-hidden mb-8">
                  <table className="w-full text-sm text-left">
                    <tbody>
                      <tr className="border-b border-neutral-100 bg-neutral-50/50">
                        <td className="px-4 py-2.5 font-medium text-neutral-600 w-1/3">Brand / Manufacturer</td>
                        <td className="px-4 py-2.5 text-neutral-900 font-semibold">{currentProduct.brand || 'Power Equipments Partner'}</td>
                      </tr>
                      <tr className="border-b border-neutral-100">
                        <td className="px-4 py-2.5 font-medium text-neutral-600">Category</td>
                        <td className="px-4 py-2.5 text-neutral-900">{categoryName}</td>
                      </tr>
                      {fallbackProduct.specs.map((spec, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'border-b border-neutral-100 bg-neutral-50/50' : 'border-b border-neutral-100'}>
                          <td className="px-4 py-2.5 font-medium text-neutral-600">{spec.label}</td>
                          <td className="px-4 py-2.5 text-neutral-900">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instant Enquiry Box */}
              <div className="card-base p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-blue-950 mb-1">Require Pricing or Quotation?</h4>
                    <p className="text-xs text-blue-800">Send us an enquiry with your quantity requirements for custom industrial quotes.</p>
                  </div>
                  <Link
                    href={`/contact?subject=Quotation%20Enquiry%20for%20${encodeURIComponent(currentProduct.name)}`}
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
