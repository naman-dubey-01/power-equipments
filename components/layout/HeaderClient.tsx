'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, ChevronDown, Phone, Zap } from 'lucide-react'
import type { Database } from '@/types/database'

type Category = Database['public']['Tables']['categories']['Row']

interface HeaderProps {
  categories?: Category[]
  phone?: string | null
  companyName?: string | null
}

export function HeaderClient({ categories = [], phone, companyName }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [prevPath, setPrevPath] = useState(pathname)

  // Adjust state during render when the route changes, avoiding an effect update.
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setMobileOpen(false)
    setDropdownOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isProductActive = pathname.startsWith('/products')

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-sm shadow-lg border-b border-white/10'
          : 'bg-navy-950 border-b border-white/5'
      }`}
      style={{ height: 'var(--header-height)', background: 'var(--color-navy-950)' }}
    >
      <div className="container-site h-full flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1e6fd9, #0d2849)' }}
          >
            <Zap size={18} strokeWidth={2.5} style={{ color: '#f0a500' }} />
          </div>
          <div className="leading-tight">
            <span className="block font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {companyName || 'Power Equipments'}
            </span>
            <span className="block text-xs text-slate-300 tracking-wide">
              Electrical &amp; Industrial
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-3" aria-label="Main navigation">
          {/* Home */}
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-md text-sm font-medium tracking-wide transition-colors duration-150 ${
              isActive('/') && pathname === '/'
                ? 'text-white bg-white/15'
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            Home
          </Link>

          {/* About */}
          <Link
            href="/about"
            className={`px-3.5 py-2 rounded-md text-sm font-medium tracking-wide transition-colors duration-150 ${
              isActive('/about')
                ? 'text-white bg-white/15'
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            About Us
          </Link>

          {/* Products dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onKeyDown={(e) => { if (e.key === 'Escape') setDropdownOpen(false) }}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium tracking-wide transition-colors duration-150 ${
                isProductActive
                  ? 'text-white bg-white/15'
                  : 'text-white hover:text-white hover:bg-white/10'
              }`}
            >
              Our Product
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-56 bg-navy-900 rounded-xl border border-white/10 shadow-xl py-1.5 z-50"
                style={{ background: 'var(--color-navy-900)' }}
                role="menu"
              >
                <Link
                  href="/products"
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  role="menuitem"
                >
                  All Products
                </Link>
                {categories.length > 0 && (
                  <>
                    <div className="my-1 mx-3 border-t border-white/10" />
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products/category/${cat.slug}`}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-100 hover:bg-white/10 hover:text-white transition-colors"
                        role="menuitem"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Gallery */}
          <Link
            href="/gallery"
            className={`px-3.5 py-2 rounded-md text-sm font-medium tracking-wide transition-colors duration-150 ${
              isActive('/gallery')
                ? 'text-white bg-white/15'
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            Gallery
          </Link>

          {/* Certificate */}
          <Link
            href="/certificates"
            className={`px-3.5 py-2 rounded-md text-sm font-medium tracking-wide transition-colors duration-150 ${
              isActive('/certificates')
                ? 'text-white bg-white/15'
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            Certificate
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className={`px-3.5 py-2 rounded-md text-sm font-medium tracking-wide transition-colors duration-150 ${
              isActive('/contact')
                ? 'text-white bg-white/15'
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href={phone ? `tel:${phone.replace(/\s+/g, '')}` : '/contact'}
            className="hidden sm:flex items-center gap-2 text-sm font-medium tracking-wide text-white hover:text-white/80"
            aria-label="Call us"
          >
            <Phone size={14} />
            {phone && <span className="hidden xl:block">{phone}</span>}
          </a>
          <Link
            href="/contact"
            className="hidden md:flex btn btn-primary btn-sm"
          >
            Enquire Now
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md border border-white/20 text-slate-200 transition-colors hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-navy-950 text-white z-40 flex flex-col"
          style={{ top: 'var(--header-height)', background: 'var(--color-navy-950)' }}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
            <Link href="/" className={`flex items-center px-4 py-3 rounded-lg text-base font-medium ${pathname === '/' ? 'bg-white/10 text-amber-400' : 'text-slate-200 hover:bg-white/5'}`}>
              Home
            </Link>
            <Link href="/about" className={`flex items-center px-4 py-3 rounded-lg text-base font-medium ${isActive('/about') ? 'bg-white/10 text-amber-400' : 'text-slate-200 hover:bg-white/5'}`}>
              About Us
            </Link>

            {/* Mobile Products */}
            <div>
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium ${isProductActive ? 'bg-white/10 text-amber-400' : 'text-slate-200 hover:bg-white/5'}`}
              >
                Our Product
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {mobileProductsOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-0.5">
                  <Link href="/products" className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5">
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products/category/${cat.slug}`}
                      className="px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-white/5"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/gallery" className={`flex items-center px-4 py-3 rounded-lg text-base font-medium ${isActive('/gallery') ? 'bg-white/10 text-amber-400' : 'text-slate-200 hover:bg-white/5'}`}>
              Gallery
            </Link>
            <Link href="/certificates" className={`flex items-center px-4 py-3 rounded-lg text-base font-medium ${isActive('/certificates') ? 'bg-white/10 text-amber-400' : 'text-slate-200 hover:bg-white/5'}`}>
              Certificate
            </Link>
            <Link href="/contact" className={`flex items-center px-4 py-3 rounded-lg text-base font-medium ${isActive('/contact') ? 'bg-white/10 text-amber-400' : 'text-slate-200 hover:bg-white/5'}`}>
              Contact Us
            </Link>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link href="/contact" className="btn btn-primary w-full text-center">
                Enquire Now
              </Link>
              <a href={phone ? `tel:${phone.replace(/\s+/g, '')}` : '/contact'} className="btn btn-ghost w-full text-center flex items-center justify-center gap-2 text-slate-200 border border-white/20">
                <Phone size={14} /> {phone ? `Call ${phone}` : 'Call Us'}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
