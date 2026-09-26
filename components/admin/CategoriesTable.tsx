'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Plus, Trash2, CheckCircle2, XCircle, FolderTree, X } from 'lucide-react'
import { saveCategory, toggleCategoryStatus, deleteCategory } from '@/lib/actions/categories'
import type { CategoryFormData } from '@/lib/validation/schemas'
import { FileUploadField } from './FileUploadField'

interface CategoryRow {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  sort_order: number
  is_active: boolean
  products?: { count: number }[]
}

const emptyForm: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  image_url: '',
  sort_order: 0,
  is_active: true,
}

export function CategoriesTable({ categories, loadError }: { categories: CategoryRow[]; loadError?: string }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryRow | null>(null)
  const [form, setForm] = useState<CategoryFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const run = async (fn: () => Promise<{ success: boolean; error?: string }>) => {
    const result = await fn()
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Action failed')
    }
  }

  const openModal = (cat?: CategoryRow) => {
    setEditing(cat ?? null)
    setForm(
      cat
        ? {
            name: cat.name,
            slug: cat.slug,
            description: cat.description ?? '',
            image_url: cat.image_url ?? '',
            sort_order: cat.sort_order,
            is_active: cat.is_active,
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
    const result = await saveCategory(form, editing?.id)
    if (result.success) {
      setModalOpen(false)
      router.refresh()
    } else {
      setError(result.error || 'Failed to save category')
    }
    setSaving(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? Products will become uncategorized.`)) {
      void run(() => deleteCategory(id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            Category Management
          </h1>
          <p className="text-xs text-slate-500">Organize industrial products into active store categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loadError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          {loadError}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Sort</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FolderTree size={16} />
                    </div>
                    <div>
                      <span>{cat.name}</span>
                      {cat.description && (
                        <span className="block text-[11px] text-slate-400 font-normal truncate max-w-xs">{cat.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                      {cat.products?.[0]?.count ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{cat.sort_order}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => void run(() => toggleCategoryStatus(cat.id))}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        cat.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(cat)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Edit category"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && (
          <div className="text-center py-16">
            <FolderTree size={40} strokeWidth={1} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500">No categories yet. Add your first one.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editing ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. VFDs & Drives"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  />
                </div>
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
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description ?? ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description shown on the website"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 resize-y"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Image (optional)</label>
                <FileUploadField
                  bucket="site-assets"
                  folder="categories"
                  onUploaded={(u) => setForm({ ...form, image_url: u })}
                  buttonText="Upload image from computer"
                  className="mb-2"
                />
                <input
                  type="text"
                  value={form.image_url ?? ''}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="Or paste an image URL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>
              <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Active (visible on website)
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}