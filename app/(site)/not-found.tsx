import Link from 'next/link'
import { Zap, Home, Package } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50"
      style={{ paddingTop: 'calc(var(--header-height) + 40px)' }}
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-md">
        <Zap size={32} strokeWidth={2.5} />
      </div>

      <h1
        className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        404 — Page Not Found
      </h1>
      <p className="text-sm md:text-base text-slate-600 max-w-md mb-8 leading-relaxed">
        The requested page or product route could not be found. Explore our electrical equipment catalog or return to the homepage.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="btn btn-primary flex items-center gap-2 text-sm px-5 py-3">
          <Home size={16} /> Return Home
        </Link>
        <Link href="/products" className="btn btn-secondary flex items-center gap-2 text-sm px-5 py-3">
          <Package size={16} /> Browse Products
        </Link>
      </div>
    </div>
  )
}
