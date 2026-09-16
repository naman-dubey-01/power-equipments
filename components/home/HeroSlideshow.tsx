'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react'

export interface SlideItem {
  id: string
  title: string
  subtitle: string
  image_url: string
  cta_text?: string
  cta_link?: string
  tag?: string
}

const defaultSlides: SlideItem[] = [
  {
    id: 'slide-1',
    title: 'Leading Electrical & Industrial Solutions',
    subtitle: 'Authorized suppliers of VFDs, Heavy Duty Motors, Switchgear & Power Cables across Bhopal, Indore, and Central India.',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    cta_text: 'Explore Product Catalog',
    cta_link: '/products',
    tag: 'Bhopal & Indore Authorized Supplier'
  },
  {
    id: 'slide-2',
    title: 'High Performance VFDs & AC Drives',
    subtitle: 'Advanced industrial automation, motor control panels, and energy-saving ABB & Siemens drive systems for factories.',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
    cta_text: 'View Drives & Automation',
    cta_link: '/products?category=vfds-drives',
    tag: 'Industrial Automation & Drives'
  },
  {
    id: 'slide-3',
    title: 'Commercial & Warehouse LED Lighting',
    subtitle: 'Energy efficient highbay lights, flameproof industrial fittings, and distribution switchgear with full manufacturer warranty.',
    image_url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
    cta_text: 'Get Quotation',
    cta_link: '/contact',
    tag: 'Energy-Efficient Systems'
  }
]

interface HeroSlideshowProps {
  slides?: SlideItem[]
}

export function HeroSlideshow({ slides = [] }: HeroSlideshowProps) {
  const activeSlides = slides.length > 0 ? slides : defaultSlides
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
  }, [activeSlides.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }, [activeSlides.length])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide, isPaused])

  const current = activeSlides[currentIndex]

  return (
    <section
      aria-label="Homepage B2B Showcase Banner"
      className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[520px] lg:min-h-[620px] flex items-center"
      style={{ paddingTop: 'var(--header-height)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Image with subtle zoom transition */}
      <div className="absolute inset-0 z-0">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image_url}
                alt={slide.title}
                fill
                priority={index === 0}
                quality={85}
                sizes="100vw"
                className="object-cover object-center brightness-[0.38] contrast-[1.05]"
              />
              {/* Overlay Gradients for Optimal Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-10 pointer-events-none" />

      {/* Banner Content Container */}
      <div className="container-site relative z-20 py-16 lg:py-24">
        <div className="max-w-2xl">
          {/* Tagline */}
          {current.tag && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 border border-amber-500/30 backdrop-blur-sm">
              <Zap size={14} className="text-amber-400" /> {current.tag}
            </div>
          )}

          {/* Heading */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-5 transition-all duration-500"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.15 }}
          >
            {current.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
            {current.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={current.cta_link || '/products'}
              className="btn btn-primary btn-lg shadow-xl shadow-blue-600/30 hover:scale-105 transition-transform"
            >
              {current.cta_text || 'Explore Catalog'} <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="btn btn-secondary btn-lg text-white border-white/30 hover:bg-white/10"
            >
              Contact Sales
            </Link>
          </div>

          {/* Trust Highlights Strip */}
          <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck size={16} className="text-blue-400 shrink-0" />
              <span>100% Genuine Brands</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Zap size={16} className="text-amber-400 shrink-0" />
              <span>Bhopal &amp; Indore Warehouse</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Award size={16} className="text-emerald-400 shrink-0" />
              <span>ISO Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Arrow Navigation Controls */}
      <div className="absolute right-6 bottom-8 z-30 flex items-center gap-3">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20 hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2 px-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-blue-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20 hover:scale-110 active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}
