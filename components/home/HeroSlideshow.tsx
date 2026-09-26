'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react'

export interface HeroSlide {
  src: string
  alt: string
  title?: string
  subtitle?: string
  cta_text?: string
  cta_link?: string
}

interface HeroSlideshowProps {
  slides?: HeroSlide[]
}

export function HeroSlideshow({ slides = [] }: HeroSlideshowProps) {
  const activeSlides = slides.filter((s) => s.src)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prevCount, setPrevCount] = useState(activeSlides.length)

  // Adjust state during render when the slide collection changes,
  // avoiding a cascading effect update.
  if (prevCount !== activeSlides.length) {
    setPrevCount(activeSlides.length)
    setCurrentIndex(0)
  }

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

  const current = activeSlides.length > 0 ? activeSlides[currentIndex] : null

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
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.src}
                alt={slide.alt}
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

        {/* Static fallback background when no images exist yet */}
        {activeSlides.length === 0 && (
          <div className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 20% 30%, #123a6b 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, #0d2849 0%, transparent 60%), var(--color-navy-950)',
            }}
          >
            <div className="absolute inset-0 grid-pattern opacity-40" />
          </div>
        )}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-10 pointer-events-none" />

      {/* Banner Content Container */}
      <div className="container-site relative z-20 py-16 lg:py-24">
        <div className="max-w-2xl">
          {/* Tagline */}
          {current?.cta_text && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 border border-amber-500/30 backdrop-blur-sm">
              <Zap size={14} className="text-amber-400" /> {current.cta_text}
            </div>
          )}

          {/* Heading */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-5 transition-all duration-500"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.15 }}
          >
            {current?.title ||
              'Power Equipments'}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
            {current?.subtitle ||
              'Genre Leading Distributors of Electrical & Industrial Machines. Genuine VFDs, motors, cables, LED lighting, and switchgear across Central India.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={current?.cta_link || '/products'}
              className="btn btn-primary btn-lg shadow-xl shadow-blue-600/30 hover:scale-105 transition-transform"
            >
              {current?.cta_text || 'Explore Products'} <ArrowRight size={18} />
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
      {activeSlides.length > 1 && (
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
      )}
    </section>
  )
}