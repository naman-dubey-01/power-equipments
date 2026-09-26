'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error)
  }, [error])

  return (
    <div
      className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50"
      style={{ paddingTop: 'calc(var(--header-height) + 40px)' }}
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 shadow-md">
        <AlertTriangle size={32} />
      </div>

      <h1
        className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Something Went Wrong
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8 leading-relaxed">
        An unexpected error occurred while loading this section. You can retry or head back to safety.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="btn btn-primary flex items-center gap-2 text-sm px-5 py-3"
        >
          <RefreshCw size={16} /> Try Again
        </button>
        <Link href="/" className="btn btn-secondary flex items-center gap-2 text-sm px-5 py-3">
          <Home size={16} /> Back to Homepage
        </Link>
      </div>
    </div>
  )
}
