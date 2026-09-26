'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, X, Plus, ImagePlus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { saveProduct, saveProductImage } from '@/lib/actions/products'
import { FileUploadField } from './FileUploadField'
import type { ProductFormData } from '@/lib/validation/schemas'

interface Product {
  id?: string
  name: string
  brand?: string | null
  sku?: string | null
  category_id?: string | null
  short_description?: string | null
  description?: string | null
  featured?: boolean
  is_active?: boolean
  sort_order?: number
  seo_title?: string | null
  seo_description?: string | null
  specifications?: { label: string; value: string }[] | null
}

interface ProductFormProps {
  product?: Product | null
  categories: { id: string; name: string; slug: string }[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [pendingImages, setPendingImages] = useState<string[]>([])

  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? '',
    category_id: product?.category_id ?? null,
    brand: product?.brand ?? '',
    sku: product?.sku ?? '',
    specifications: product?.specifications ?? [],
    short_description: product?.short_description ?? '',
    description: product?.description ?? '',
    featured: product?.featured ?? false,
    is_active: product?.is_active ?? true,
    sort_order: product?.sort_order ?? 0,
    seo_title: product?.seo_title ?? '',
    seo_description: product?.seo_description ?? '',
  })

  const set = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const addSpec = () => set('specifications', [...(form.specifications ?? []), { label: '', value: '' }])
  const updateSpec = (idx: number, key: 'label' | 'value', value: string) => {
    const specs = [...(form.specifications ?? [])]
    specs[idx] = { ...specs[idx], [key]: value }
    set('specifications', specs)
  }
  const removeSpec = (idx: number) =>
    set(
      'specifications',
      (form.specifications ?? []).filter((_, i) => i !== idx)
    )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload: ProductFormData = {
      ...form,
      brand: form.brand || null,
      sku: form.sku || null,
      category_id: form.category_id || null,
      short_description: form.short_description || null,
      description: form.description || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      specifications: (form.specifications ?? []).filter((s) => s.label && s.value),
    }

    const result = await saveProduct(payload, product?.id)
    if (result.success && result.id) {
      if (!product?.id && pendingImages.length > 0) {
        for (let i = 0; i < pendingImages.length; i++) {
          const res = await saveProductImage(result.id, { storage_path: pendingImages[i] }, i === 0)
          if (!res.success) {
            setError(`Product saved, but image ${i + 1} failed: ${res.error || 'unknown error'}`)
            setSaving(false)
            return
          }
        }
      }
      router.push('/admin/products')
      router.refresh()
    } else {
      setError(result.error || 'Failed to save product')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          {product?.id ? 'Edit Product' : 'Add New Product'}
        </h2>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium"
        >
          <ArrowLeft size={14} /> Back to list
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      {/* Core */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. ABB ACS880 VFD Drive"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Category</label>
          <select
            value={form.category_id ?? ''}
            onChange={(e) => set('category_id', e.target.value || null)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
          >
            <option value="">— Uncategorized —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Brand</label>
          <input
            type="text"
            value={form.brand ?? ''}
            onChange={(e) => set('brand', e.target.value)}
            placeholder="e.g. ABB, Siemens"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">SKU / Code</label>
          <input
            type="text"
            value={form.sku ?? ''}
            onChange={(e) => set('sku', e.target.value)}
            placeholder="e.g. ABB-ACS880-45KW"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Sort Order</label>
          <input
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(e) => set('sort_order', Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
          <textarea
            rows={2}
            value={form.short_description ?? ''}
            onChange={(e) => set('short_description', e.target.value)}
            placeholder="One-line summary shown on cards"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600 resize-y"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Full Description</label>
          <textarea
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Detailed description for the product page"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600 resize-y"
          />
        </div>
      </div>

      {/* Specifications */}
      <div>
        <h3 className="font-bold text-slate-900 text-sm mb-3">Specifications</h3>
        <div className="flex flex-col gap-2">
          {(form.specifications ?? []).map((spec, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => updateSpec(idx, 'label', e.target.value)}
                placeholder="Label (e.g. Power Range)"
                className="px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                placeholder="Value (e.g. 0.55 – 200 kW)"
                className="px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => removeSpec(idx)}
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                aria-label="Remove specification"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpec}
            className="self-start inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 font-medium"
          >
            <Plus size={14} /> Add Specification
          </button>
        </div>
      </div>

      {/* Product Images */}
      {!product?.id && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ImagePlus size={16} className="text-blue-600" /> Product Images
            </h3>
            <p className="text-[11px] text-slate-500">
              Upload pictures now — they will be attached to the product when you save it. The first image becomes the main thumbnail.
            </p>
          </div>

          <FileUploadField
            bucket="product-images"
            folder="products"
            onUploaded={(url) => setPendingImages((prev) => [...prev, url])}
            buttonText="Upload picture from computer"
          />

          {pendingImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {pendingImages.map((src, idx) => (
                <div
                  key={src}
                  className="relative rounded-xl overflow-hidden border border-slate-200 bg-white group"
                  style={{ aspectRatio: '1/1' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPendingImages((prev) => prev.filter((s) => s !== src))}
                    className="absolute top-1 right-1 p-1 bg-slate-900/70 text-white rounded-lg hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <Trash2 size={12} />
                  </button>
                  {idx === 0 && (
                    <span className="absolute left-1 top-1 px-1.5 py-0.5 bg-amber-400 text-slate-900 text-[9px] font-bold rounded-md">
                      PRIMARY
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SEO */}
      <div>
        <h3 className="font-bold text-slate-900 text-sm mb-3">SEO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">SEO Title (max 70)</label>
            <input
              type="text"
              maxLength={70}
              value={form.seo_title ?? ''}
              onChange={(e) => set('seo_title', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">SEO Description (max 160)</label>
            <input
              type="text"
              maxLength={160}
              value={form.seo_description ?? ''}
              onChange={(e) => set('seo_description', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Featured on Home Page
        </label>
        <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set('is_active', e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Active (visible on website)
        </label>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 disabled:opacity-60"
        >
          <Save size={16} /> {saving ? 'Saving...' : product?.id ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}