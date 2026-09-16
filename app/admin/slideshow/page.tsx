'use client'

import { useState } from 'react'
import { Plus, Image as ImageIcon, Trash2, CheckCircle2, XCircle, ArrowUp, ArrowDown } from 'lucide-react'

export default function AdminSlideshowPage() {
  const [slides, setSlides] = useState([
    {
      id: 'slide-1',
      title: 'Leading Electrical & Industrial Solutions',
      subtitle: 'Authorized suppliers of VFDs, Heavy Duty Motors, Switchgear & Power Cables.',
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
      cta_text: 'Explore Product Catalog',
      cta_link: '/products',
      is_active: true,
      sort_order: 1,
    },
    {
      id: 'slide-2',
      title: 'High Performance VFDs & AC Drives',
      subtitle: 'Advanced industrial automation and drive systems for factories in Bhopal & Indore.',
      image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
      cta_text: 'View Drives & Automation',
      cta_link: '/products?category=vfds-drives',
      is_active: true,
      sort_order: 2,
    },
    {
      id: 'slide-3',
      title: 'Commercial & Warehouse LED Lighting',
      subtitle: 'Energy efficient highbay lights, flameproof industrial fittings & switchgear.',
      image_url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
      cta_text: 'Get Quotation',
      cta_link: '/contact',
      is_active: true,
      sort_order: 3,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    cta_text: 'Explore Products',
    cta_link: '/products',
  })

  const toggleStatus = (id: string) => {
    setSlides(slides.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s))
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this banner slide from homepage?')) {
      setSlides(slides.filter(s => s.id !== id))
    }
  }

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSlide.title || !newSlide.image_url) return

    const created = {
      id: `slide-${Date.now()}`,
      title: newSlide.title,
      subtitle: newSlide.subtitle,
      image_url: newSlide.image_url,
      cta_text: newSlide.cta_text,
      cta_link: newSlide.cta_link,
      is_active: true,
      sort_order: slides.length + 1,
    }

    setSlides([...slides, created])
    setShowModal(false)
    setNewSlide({ title: '', subtitle: '', image_url: '', cta_text: 'Explore Products', cta_link: '/products' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            Homepage Slideshow &amp; Banners
          </h1>
          <p className="text-xs text-slate-500">Manage full-width hero slideshow images, headlines, and call-to-action links</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add New Slide
        </button>
      </div>

      {/* Slide Cards */}
      <div className="grid grid-cols-1 gap-5">
        {slides.map((s, idx) => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-64 h-36 relative rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image_url} alt={s.title} className="w-full h-full object-cover brightness-90" />
              <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Slide #{idx + 1}
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">ID: {s.id}</span>
              <h3 className="font-bold text-slate-900 text-base leading-snug">{s.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{s.subtitle}</p>
              <div className="pt-2 flex items-center gap-3 text-xs text-blue-600 font-medium">
                <span>CTA: {s.cta_text}</span>
                <span>&rarr;</span>
                <span className="font-mono text-slate-500 text-[11px]">{s.cta_link}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => toggleStatus(s.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  s.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {s.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {s.is_active ? 'Active' : 'Disabled'}
              </button>

              <button
                onClick={() => handleDelete(s.id)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                title="Delete Slide"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add Banner Slide</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleAddSlide} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Duty Motors & Automation Panels"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Authorized distributor for Siemens, ABB & Polycab in Madhya Pradesh."
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL (or Supabase Storage URL) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newSlide.image_url}
                  onChange={(e) => setNewSlide({ ...newSlide, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={newSlide.cta_text}
                    onChange={(e) => setNewSlide({ ...newSlide, cta_text: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Button Route</label>
                  <input
                    type="text"
                    value={newSlide.cta_link}
                    onChange={(e) => setNewSlide({ ...newSlide, cta_link: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Save Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
