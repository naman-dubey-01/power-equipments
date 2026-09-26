'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, CheckCircle2, XCircle, Image as ImageIcon, Pencil, X } from 'lucide-react'
import {
  saveGalleryItem,
  toggleGalleryStatus,
  deleteGalleryItem,
} from '@/lib/actions/gallery'
import { resolveImageUrl } from '@/lib/utils'
import { FileUploadField } from './FileUploadField'

interface GalleryRow {
  id: string
  title?: string | null
  description?: string | null
  category?: string | null
  storage_path: string
  alt_text?: string | null
  sort_order: number
  is_active: boolean
}

const emptyForm = {
  title: '',
  description: '',
  category: '',
  storage_path: '',
  alt_text: '',
  is_active: true,
  sort_order: 0,
}

export function GalleryTable({ items, loadError }: { items: GalleryRow[]; loadError?: string }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const run = async (fn: () => Promise<{ success: boolean; error?: string }>) => {
    const result = await fn()
    if (result.success) router.refresh()
    else alert(result.error || 'Action failed')
  }

  const openModal = (item?: GalleryRow) => {
    setEditing(item ?? null)
    setForm(
      item
        ? {
            title: item.title ?? '',
            description: item.description ?? '',
            category: item.category ?? '',
            storage_path: item.storage_path,
            alt_text: item.alt_text ?? '',
            is_active: item.is_active,
            sort_order: item.sort_order,
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
    const result = await saveGalleryItem(form, editing?.id)
    if (result.success) {
      setModalOpen(false)
      router.refresh()
    } else {
      setError(result.error || 'Failed to save gallery item')
    }
    setSaving(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this gallery item?')) void run(() => deleteGalleryItem(id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            Gallery Management
          </h1>
          <p className="text-xs text-slate-500">Project photos and facility showcase images</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      {loadError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">{loadError}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Sort</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const src = resolveImageUrl(item.storage_path, 'gallery-images')
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100">
                        {src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={src} alt={item.alt_text || item.title || 'Gallery image'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.title || '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{item.category || '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{item.sort_order}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => void run(() => toggleGalleryStatus(item.id))}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="text-center py-16">
            <ImageIcon size={40} strokeWidth={1} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500">No gallery images yet.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">{editing ? 'Edit Gallery Image' : 'Add Gallery Image'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gallery Image *</label>
                <FileUploadField
                  bucket="gallery-images"
                  folder="gallery"
                  onUploaded={(u) => setForm({ ...form, storage_path: u })}
                  buttonText="Upload image from computer"
                  className="mb-2"
                />
                <input
                  type="text"
                  required
                  value={form.storage_path}
                  onChange={(e) => setForm({ ...form, storage_path: e.target.value })}
                  placeholder="Or paste an image URL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Automation"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 resize-y"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={form.alt_text}
                  onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
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

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}