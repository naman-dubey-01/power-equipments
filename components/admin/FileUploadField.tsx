'use client'

import { useRef, useState } from 'react'
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { uploadFileToBucket } from '@/lib/actions/storage'

interface FileUploadFieldProps {
  /** Supabase storage bucket, e.g. 'product-images' */
  bucket: string
  /** Folder path inside the bucket, e.g. 'products' */
  folder: string
  /** Called with the uploaded public URL */
  onUploaded: (url: string) => void
  accept?: string
  buttonText?: string
  className?: string
}

export function FileUploadField({
  bucket,
  folder,
  onUploaded,
  accept = 'image/*',
  buttonText = 'Choose file from computer',
  className,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setMessage(null)
    const result = await uploadFileToBucket(bucket, folder, file)
    setUploading(false)

    if (result.success && result.url) {
      onUploaded(result.url)
      setMessage({ type: 'ok', text: 'Uploaded successfully.' })
    } else {
      setMessage({ type: 'err', text: result.error || 'Upload failed.' })
    }
  }

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
        {uploading ? 'Uploading…' : buttonText}
      </button>
      {message && (
        <p
          className={`mt-1.5 flex items-center gap-1 text-[11px] ${
            message.type === 'ok' ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {message.type === 'ok' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          {message.text}
        </p>
      )}
    </div>
  )
}