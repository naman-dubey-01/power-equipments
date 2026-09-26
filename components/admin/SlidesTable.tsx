'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, CheckCircle2, XCircle, LayoutTemplate, X, Pencil } from 'lucide-react'
import { saveSlide, toggleSlideStatus, deleteSlide } from '@/lib/actions/slides'
import { resolveImageUrl } from '@/lib/utils'
import { FileUploadField } from './FileUploadField'

interface SlideRow {
  id: string
  title: string
  subtitle?: string | null
  image_url: string
  cta_text?: string | null
  cta_link?: string | null
  is_active: boolean
  sort_order: number
}

const emptyForm = {
  title: '',
  subtitle: '',
  image_url: '',
  cta_text: '',
  cta_link: '',
  is_active: true,
  sort_order: 0,
}

export function SlidesTable({ slides, loadError }: { slides: SlideRow[]; loadError?: string }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SlideRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const run = async (fn: () => Promise<{ success: boolean; error?: string }>) => {
    const result = await fn()
    if (result.success) router.refresh()
    else alert(result.error || 'Action failed')
  }

  const openModal = (slide?: SlideRow) => {
    setEditing(slide ?? null)
    setForm(
      slide
        ? {
            title: slide.title,
            subtitle: slide.subtitle ?? '',
            image_url: slide.image_url,
            cta_text: slide.cta_text ?? '',
            cta_link: slide.cta_link ?? '',
            is_active: slide.is_active,
            sort_order: slide.sort_order,
          }
        : emptyForm
    )
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const result = await saveSlide(form, editing?.id)
    if (result.success) {
      setModalOpen(false)
      router.refresh()
    } else {
      setError(result.error || 'Failed to save slide')
    }
    setSaving(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this banner slide?')) void run(() => deleteSlide(id))
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
          onClick={() => openModal()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add New Slide
        </button>
      </div>

      {loadError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">{loadError}</div>
      )}

      <div className="grid grid-cols-1 gap-5">
        {slides.map((s, idx) => {
          const src = resolveImageUrl(s.image_url, 'slides')
          return (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-64 h-36 relative rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={s.title} className="w-full h-full object-cover brightness-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <LayoutTemplate size={28} />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Slide #{idx + 1}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-bold text-slate-900 text-base leading-snug">{s.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{s.subtitle || '—'}</p>
                {s.cta_text && (
                  <div className="pt-1 flex items-center gap-2 text-xs text-blue-600 font-medium">
                    <span>CTA: {s.cta_text}</span>
                    <span>&rarr;</span>
                    <span className="font-mono text-slate-500 text-[11px]">{s.cta_link}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                <button
                  onClick={() => void run(() => toggleSlideStatus(s.id))}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    s.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {s.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {s.is_active ? 'Active' : 'Disabled'}
                </button>
                <button
                  onClick={() => openModal(s)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50"
                  title="Edit Slide"
                >
                  <Pencil size={18} />
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
          )
        })}
      </div>

      {slides.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-sm border-dashed">
          <LayoutTemplate size={40} strokeWidth={1} className="mx-auto mb-3 text-slate-300" />
          No slides yet — the hero section hides when empty. Add your first banner.
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">{editing ? 'Edit Banner Slide' : 'Add Banner Slide'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Duty Motors & Automation Panels"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Authorized distributor for Siemens, ABB & Polycab in Madhya Pradesh."
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Image *</label>
                <FileUploadField
                  bucket="site-assets"
                  folder="slides"
                  onUploaded={(u) => setForm({ ...form, image_url: u })}
                  buttonText="Upload image from computer"
                  className="mb-2"
                />
                <input
                  type="url"
                  required
                  placeholder="Or paste an image URL"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={form.cta_text}
                    onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Button Route</label>
                  <input
                    type="text"
                    value={form.cta_link}
                    onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  />
                </div>
                <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}