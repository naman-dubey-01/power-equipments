'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Star, ImagePlus } from 'lucide-react'
import {
  saveProductImage,
  deleteProductImage,
  setProductImagePrimary,
} from '@/lib/actions/products'
import { resolveImageUrl } from '@/lib/utils'
import { FileUploadField } from './FileUploadField'

interface ImageRow {
  id: string
  storage_path: string
  alt_text?: string | null
  is_primary?: boolean
}

export function ProductImages({ productId, images }: { productId: string; images: ImageRow[] }) {
  const router = useRouter()
  const [url, setUrl] = useState('')

  const run = async (
    fn: () => Promise<{ success: boolean; error?: string }>
  ) => {
    const result = await fn()
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Action failed')
    }
  }

  const addImage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    void run(() => saveProductImage(productId, { storage_path: url.trim() }))
    setUrl('')
  }

  const addUploaded = (publicUrl: string) => {
    void run(() => saveProductImage(productId, { storage_path: publicUrl }))
  }

  const remove = (id: string) => {
    if (confirm('Remove this image?')) {
      void run(() => deleteProductImage(id))
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ImagePlus size={16} className="text-blue-600" /> Product Images
        </h3>
        <p className="text-[11px] text-slate-500">
          Upload pictures from your computer, or paste an external image URL. The starred image is the main thumbnail.
        </p>
      </div>

      <FileUploadField
        bucket="product-images"
        folder="products"
        onUploaded={addUploaded}
        buttonText="Upload picture from computer"
      />

      <form onSubmit={addImage} className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Optional: paste an external image URL"
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5"
        >
          <Plus size={14} /> Add
        </button>
      </form>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img) => {
            const src = resolveImageUrl(img.storage_path)
            return (
              <div
                key={img.id}
                className="relative rounded-xl overflow-hidden border border-slate-200 group"
                style={{ aspectRatio: '1/1', background: '#f1f5f9' }}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={img.alt_text || 'Product image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Invalid</div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between gap-1 bg-slate-900/70">
                  <button
                    onClick={() => void run(() => setProductImagePrimary(img.id))}
                    className={`flex items-center gap-1 text-[10px] font-semibold transition-colors ${
                      img.is_primary ? 'text-amber-400' : 'text-white/80 hover:text-amber-400'
                    }`}
                  >
                    <Star size={12} className={img.is_primary ? 'fill-amber-400' : ''} />
                    {img.is_primary ? 'Primary' : 'Set'}
                  </button>
                  <button
                    onClick={() => remove(img.id)}
                    className="text-white/70 hover:text-red-400 transition-colors"
                    aria-label="Delete image"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}