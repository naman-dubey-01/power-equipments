'use client'

import { useState } from 'react'
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, Package, Filter } from 'lucide-react'

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('ALL')
  const [showAddModal, setShowAddModal] = useState(false)

  const [products, setProducts] = useState([
    { id: '1', name: 'ABB ACS880 VFD Drive 45kW', brand: 'ABB', category: 'VFDs & Drives', featured: true, is_active: true, sku: 'ABB-ACS880-45KW' },
    { id: '2', name: 'Siemens SIMOTICS Industrial Motor 15HP', brand: 'Siemens', category: 'Electric Motors', featured: true, is_active: true, sku: 'SIE-MOT-15HP' },
    { id: '3', name: 'Philips Highbay LED 150W', brand: 'Philips', category: 'Lighting Solutions', featured: false, is_active: true, sku: 'PHI-LED-150W' },
    { id: '4', name: 'Polycab 4-Core Armoured Copper Cable', brand: 'Polycab', category: 'Wires & Cables', featured: true, is_active: true, sku: 'POL-ARM-4C' },
    { id: '5', name: 'L&T 63A 4P MCB Circuit Breaker', brand: 'L&T', category: 'Switchgear', featured: false, is_active: true, sku: 'LT-MCB-63A' },
    { id: '6', name: 'Schneider TeSys D Contactor 32A', brand: 'Schneider', category: 'Switchgear', featured: false, is_active: true, sku: 'SCH-TESYS-32' },
  ])

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'ABB',
    category: 'VFDs & Drives',
    sku: '',
    short_description: '',
    featured: false,
  })

  const toggleStatus = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name) return

    const created = {
      id: Date.now().toString(),
      name: newProduct.name,
      brand: newProduct.brand,
      category: newProduct.category,
      featured: newProduct.featured,
      is_active: true,
      sku: newProduct.sku || `PE-${newProduct.name.substring(0, 3).toUpperCase()}-2026`,
    }

    setProducts([created, ...products])
    setShowAddModal(false)
    setNewProduct({ name: '', brand: 'ABB', category: 'VFDs & Drives', sku: '', short_description: '', featured: false })
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesBrand = selectedBrand === 'ALL' || p.brand === selectedBrand
    return matchesSearch && matchesBrand
  })

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            Products Management
          </h1>
          <p className="text-xs text-slate-500">Manage electrical &amp; industrial product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

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
            <option value="ABB">ABB</option>
            <option value="Siemens">Siemens</option>
            <option value="Philips">Philips</option>
            <option value="Polycab">Polycab</option>
            <option value="L&T">L&amp;T</option>
            <option value="Schneider">Schneider</option>
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
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Package size={16} />
                    </div>
                    <span>{p.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                      {p.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{p.category}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{p.sku}</td>
                  <td className="px-6 py-4">
                    {p.featured ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                        FEATURED
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(p.id)}
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
                      <button
                        onClick={() => handleDelete(p.id)}
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
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABB ACS580 Variable Frequency Drive"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <select
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  >
                    <option value="ABB">ABB</option>
                    <option value="Siemens">Siemens</option>
                    <option value="Philips">Philips</option>
                    <option value="Polycab">Polycab</option>
                    <option value="L&T">L&amp;T</option>
                    <option value="Schneider">Schneider</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  >
                    <option value="VFDs & Drives">VFDs &amp; Drives</option>
                    <option value="Electric Motors">Electric Motors</option>
                    <option value="Lighting Solutions">Lighting Solutions</option>
                    <option value="Wires & Cables">Wires &amp; Cables</option>
                    <option value="Switchgear">Switchgear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SKU / Code</label>
                <input
                  type="text"
                  placeholder="e.g. ABB-VFD-580"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={newProduct.featured}
                  onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="feat" className="font-semibold text-slate-700 cursor-pointer">
                  Feature this product on Home Page
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
