import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import Image from 'next/image'
import { Image as ImageIcon, Sparkles } from 'lucide-react'

export const metadata = generatePageMetadata({
  title: 'Gallery — Project Installations & Facilities',
  description: 'Explore Power Equipments project installations, industrial motor control panels, and warehouse setups in Bhopal & Indore.',
  path: '/gallery',
})

const defaultGallery = [
  {
    id: 'g-1',
    title: 'Industrial VFD & Panel Assembly',
    category: 'Automation',
    description: 'Custom ABB drive panel installation for manufacturing plant in Pithampur Industrial Area.',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-2',
    title: 'Warehouse Highbay LED Installation',
    category: 'Commercial Lighting',
    description: 'Philips 150W LED highbay lighting retrofit for logistics facility in Mandideep.',
    image_url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-3',
    title: 'Motor Control Center (MCC) Panel',
    category: 'Switchgear & MCC',
    description: 'High capacity Siemens motor control panel commissioning for water utility project.',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-4',
    title: 'Heavy Copper Cable Laying & Wiring',
    category: 'Power Cables',
    description: 'Polycab 4-core armoured cable installation for commercial building in Bhopal.',
    image_url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-5',
    title: 'Power Equipments Distribution Warehouse',
    category: 'Warehouse & Inventory',
    description: 'Central stock repository in MP Nagar Bhopal carrying 500+ ready electrical units.',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-6',
    title: 'Substation Control Panel Testing',
    category: 'Testing & Quality',
    description: 'Routine insulation and load testing of switchgear units prior to dispatch.',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
  },
]

export default async function GalleryPage() {
  let items: any[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (data && data.length > 0) {
      items = data
    }
  } catch {}

  const displayItems = items.length > 0 ? items : defaultGallery

  return (
    <div style={{ paddingTop: 'var(--header-height)' }}>
      <section
        className="py-16 md:py-20 text-white"
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
        }}
      >
        <div className="container-site">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/20">
              <Sparkles size={14} /> Industrial Showcase
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Project &amp; Facility Gallery
            </h1>
            <p className="text-lg leading-relaxed text-slate-300">
              Explore our project installations, motor control panel builds, lighting retrofits, and warehouse operations in Bhopal &amp; Indore.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item) => {
              const imageSrc =
                item.image_url ||
                (item.storage_path
                  ? item.storage_path.startsWith('http')
                    ? item.storage_path
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.storage_path}`
                  : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80')

              return (
                <div key={item.id} className="card-base overflow-hidden flex flex-col group hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={item.alt_text || item.title || 'Gallery image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {item.category && (
                      <span className="badge badge-blue mb-2 self-start">{item.category}</span>
                    )}
                    {item.title && (
                      <h3 className="font-bold text-base mb-1.5 text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
