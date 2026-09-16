import { createClient } from '@/lib/supabase/server'
import { ShieldCheck, Award } from 'lucide-react'

const fallbackBrands = [
  { id: 'b1', name: 'ABB', tag: 'Drives & Automation' },
  { id: 'b2', name: 'Siemens', tag: 'Motors & Controls' },
  { id: 'b3', name: 'Philips', tag: 'Commercial Lighting' },
  { id: 'b4', name: 'Polycab', tag: 'Wires & Cables' },
  { id: 'b5', name: 'L&T Switchgear', tag: 'Power Distribution' },
  { id: 'b6', name: 'Schneider Electric', tag: 'Protection & Relays' },
]

interface BrandsSectionProps {
  brands?: any[]
}

export async function BrandsSection({ brands = [] }: BrandsSectionProps) {
  let activeBrands: any[] = brands

  if (!activeBrands || activeBrands.length === 0) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (data && data.length > 0) {
        activeBrands = data
      }
    } catch {}
  }

  const displayBrands = activeBrands.length > 0 ? activeBrands : fallbackBrands

  return (
    <section className="py-16 bg-white border-y border-neutral-100">
      <div className="container-site">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} /> Authorized &amp; Trusted Partners
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900" style={{ fontFamily: 'var(--font-display)' }}>
            Authorized Brands &amp; Strategic Partnerships
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            We partner with global electrical and industrial manufacturing pioneers to deliver genuine, high-grade products across Bhopal &amp; Indore.
          </p>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayBrands.map((b) => (
            <div
              key={b.id || b.name}
              className="card-base p-6 flex flex-col items-center justify-center text-center hover:border-blue-300 hover:shadow-md transition-all group bg-gradient-to-b from-neutral-50/50 to-white"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100/60 text-blue-800 flex items-center justify-center font-bold text-lg mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {b.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-sm text-neutral-900 group-hover:text-blue-600 transition-colors">
                {b.name}
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5">
                {b.tag || 'Industrial Partner'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
