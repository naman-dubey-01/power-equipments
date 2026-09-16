import Link from 'next/link'
import { ArrowRight, Image } from 'lucide-react'

export function GalleryPreview({ images }: { images?: { id: string; storage_path: string; alt_text?: string | null; title?: string | null }[] }) {
  const items = images && images.length > 0 ? images.slice(0, 6) : []

  return (
    <section className="section-padding" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Gallery</span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-900)' }}
            >
              Our Work &amp; Projects
            </h2>
          </div>
          <Link href="/gallery" className="flex items-center gap-1 text-sm font-medium shrink-0" style={{ color: 'var(--color-brand)' }}>
            Full Gallery <ArrowRight size={14} />
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-xl ${i === 0 ? 'row-span-2' : ''}`}
                style={{ background: 'var(--color-neutral-200)', aspectRatio: i === 0 ? 'auto' : '4/3' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.storage_path}
                  alt={item.alt_text || item.title || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
            style={{ background: 'var(--color-neutral-100)', border: '2px dashed var(--color-border)' }}
          >
            <Image size={40} strokeWidth={1} style={{ color: 'var(--color-text-subtle)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Gallery images will appear here once added from the admin panel.
            </p>
            <Link href="/gallery" className="btn btn-ghost btn-sm">View Gallery</Link>
          </div>
        )}
      </div>
    </section>
  )
}
