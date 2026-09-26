import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import Image from 'next/image'
import { Image as ImageIcon, Sparkles } from 'lucide-react'
import { resolveImageUrl } from '@/lib/utils'
import Link from 'next/link'
import type { Database } from '@/types/database'

export const metadata = generatePageMetadata({
  title: 'Gallery — Project Installations & Facilities',
  description: 'Explore Power Equipments project installations, industrial motor control panels, and warehouse setups in Bhopal & Indore.',
  path: '/gallery',
})

export default async function GalleryPage() {
  let items: Database['public']['Tables']['gallery_items']['Row'][] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (data && data.length > 0) {
      items = data as Database['public']['Tables']['gallery_items']['Row'][]
    }
  } catch {}

  const displayItems = items

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
          {displayItems.length === 0 ? (
            <div
              className="rounded-2xl flex flex-col items-center justify-center py-24 gap-4"
              style={{ background: 'var(--color-neutral-50)', border: '2px dashed var(--color-border)' }}
            >
              <ImageIcon size={48} strokeWidth={1} style={{ color: 'var(--color-text-subtle)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Gallery images are being uploaded. Please check back soon.
              </p>
              <Link href="/contact" className="btn btn-ghost btn-sm">Contact Us</Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item) => {
              const imageSrc = resolveImageUrl(item.storage_path, 'gallery-images')

              return (
                <div key={item.id} className="card-base overflow-hidden flex flex-col group hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.alt_text || item.title || 'Gallery image'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon size={40} strokeWidth={1} className="text-slate-600" />
                      </div>
                    )}
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
          )}
        </div>
      </section>
    </div>
  )
}
