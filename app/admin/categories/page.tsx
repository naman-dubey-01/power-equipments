'use client'

import { useState } from 'react'
import { Plus, FolderTree, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 'c1', name: 'VFDs & Drives', slug: 'vfds-drives', sort_order: 1, is_active: true, count: 4 },
    { id: 'c2', name: 'Electric Motors', slug: 'electric-motors', sort_order: 2, is_active: true, count: 3 },
    { id: 'c3', name: 'Lighting Solutions', slug: 'lighting-solutions', sort_order: 3, is_active: true, count: 2 },
    { id: 'c4', name: 'Wires & Cables', slug: 'wires-cables', sort_order: 4, is_active: true, count: 5 },
    { id: 'c5', name: 'Switchgear & Controls', slug: 'switchgear-controls', sort_order: 5, is_active: true, count: 6 },
    { id: 'c6', name: 'Transformers & Distribution', slug: 'transformers', sort_order: 6, is_active: true, count: 2 },
  ])

  const [showModal, setShowModal] = useState(false)
  const [catName, setCatName] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName) return
    const created = {
      id: Date.now().toString(),
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sort_order: categories.length + 1,
      is_active: true,
      count: 0,
    }
    setCategories([...categories, created])
    setCatName('')
    setShowModal(false)
  }

  const toggleStatus = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c))
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
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Sort Order</th>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400">#{c.sort_order}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2.5">
                    <FolderTree size={16} className="text-indigo-600" />
                    <span>{c.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{c.slug}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        c.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {c.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {c.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setCategories(categories.filter(x => x.id !== c.id))}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add New Category</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Power & Inverters"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
