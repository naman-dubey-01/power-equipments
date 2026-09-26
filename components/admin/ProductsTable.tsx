'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, Trash2, CheckCircle2, XCircle, Package, Star, Filter } from 'lucide-react'
import { toggleProductStatus, toggleProductFeatured, deleteProduct } from '@/lib/actions/products'

interface ProductRow {
  id: string
  name: string
  slug: string
  brand?: string | null
  sku?: string | null
  featured: boolean
  is_active: boolean
  category_id?: string | null
  categories?: { name: string } | null
}

export function ProductsTable({ products, loadError }: { products: ProductRow[]; loadError?: string }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('ALL')

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[],
    [products]
  )

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesBrand = selectedBrand === 'ALL' || p.brand === selectedBrand
    return matchesSearch && matchesBrand
  })

  const run = async (fn: () => Promise<{ success: boolean; error?: string }>) => {
    const result = await fn()
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Action failed')
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      void run(() => deleteProduct(id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            Products Management
          </h1>
          <p className="text-xs text-slate-500">Manage electrical &amp; industrial product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      {loadError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          {loadError}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400" />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white outline-none focus:border-blue-600"
          >
            <option value="ALL">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:text-blue-600">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Package size={16} />
                      </div>
                      <span>{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {p.brand && (
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        {p.brand}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{p.categories?.name ?? '—'}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{p.sku || '—'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => void run(() => toggleProductFeatured(p.id))}
                      title={p.featured ? 'Unfeature product' : 'Feature product'}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        p.featured ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <Star size={12} className={p.featured ? 'fill-amber-400 text-amber-400' : ''} />
                      {p.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => void run(() => toggleProductStatus(p.id))}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        p.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {p.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete product"
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
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package size={40} strokeWidth={1} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500">No products match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}