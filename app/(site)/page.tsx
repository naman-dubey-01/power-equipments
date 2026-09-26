import { HeroSlideshow } from '@/components/home/HeroSlideshow'
import { CompanyIntro } from '@/components/home/CompanyIntro'
import { ProductCategories } from '@/components/home/ProductCategories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Industries } from '@/components/home/Industries'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { BrandsSection } from '@/components/home/BrandsSection'
import { CertificationsPreview } from '@/components/home/CertificationsPreview'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { ContactCTA } from '@/components/home/ContactCTA'
import { createClient } from '@/lib/supabase/server'
import { getFolderSlides, type FolderSlide } from '@/lib/slideshow'
import type { Metadata } from 'next'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: 'Power Equipments — Electrical & Industrial Solutions | Bhopal, Indore',
  description:
    'Power Equipments is a leading supplier of electrical and industrial products in Central India. VFDs, motors, LED lighting, wires, cables, and switchgear in Bhopal & Indore.',
  openGraph: {
    title: 'Power Equipments — Electrical & Industrial Solutions',
    description: 'Reliable electrical products for industrial applications. Serving Bhopal, Indore and Central India.',
    type: 'website',
  },
}

export default async function HomePage() {
  // Fetch data concurrently from Supabase with safe fallback defaults
  type T = Database['public']['Tables']
  let categories: T['categories']['Row'][] = []
  let featuredProducts: (T['products']['Row'] & { product_images: T['product_images']['Row'][] })[] = []
  let certificates: T['certificates']['Row'][] = []
  let galleryItems: T['gallery_items']['Row'][] = []
  let company: { primary_phone: string | null; email: string | null } | null = null
  let brands: T['brands']['Row'][] = []
  let slides: T['slides']['Row'][] = []

  try {
    const supabase = await createClient()

    const [catsResult, productsResult, certsResult, galleryResult, companyResult, brandsResult, slidesResult] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(9),
      supabase
        .from('products')
        .select('id, name, slug, short_description, brand, category_id, product_images(id, storage_path, alt_text, is_primary)')
        .eq('featured', true)
        .eq('is_active', true)
        .order('sort_order')
        .limit(6),
      supabase
        .from('certificates')
        .select('id, title, issuer, description')
        .eq('is_active', true)
        .order('sort_order')
        .limit(3),
      supabase
        .from('gallery_items')
        .select('id, storage_path, alt_text, title')
        .eq('is_active', true)
        .order('sort_order')
        .limit(6),
      supabase
        .from('company_settings')
        .select('primary_phone, email')
        .limit(1)
        .single(),
      supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(6),
      supabase
        .from('slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(6),
    ])

    categories = (catsResult.data as unknown as T['categories']['Row'][]) ?? []
    featuredProducts = (productsResult.data as unknown as (T['products']['Row'] & { product_images: T['product_images']['Row'][] })[]) ?? []
    certificates = (certsResult.data as unknown as T['certificates']['Row'][]) ?? []
    galleryItems = (galleryResult.data as unknown as T['gallery_items']['Row'][]) ?? []
    company = (companyResult.data as unknown as { primary_phone: string | null; email: string | null } | null) ?? null
    brands = (brandsResult.data as unknown as T['brands']['Row'][]) ?? []
    slides = (slidesResult.data as unknown as T['slides']['Row'][]) ?? []
  } catch {}

  // Slideshow images come from the `public/slides/` folder by default; if the
  // folder is empty we fall back to database-configured slides.
  const folderSlides: FolderSlide[] = getFolderSlides()
  const heroSlides = folderSlides.length > 0
    ? folderSlides
    : slides
        .filter((s) => s.image_url)
        .map((s) => ({
          src: s.image_url,
          alt: s.title,
          title: s.title,
          subtitle: s.subtitle,
          cta_text: s.cta_text,
          cta_link: s.cta_link,
        }))

  return (
    <>
      {/* 1. Full-width homepage image slideshow */}
      <HeroSlideshow slides={heroSlides} />

      {/* 2. Company / value proposition section */}
      <CompanyIntro />

      {/* 3. Product categories */}
      <ProductCategories categories={categories} />

      {/* 4. Featured products */}
      <FeaturedProducts products={featuredProducts} />

      {/* 5. Industries / applications served */}
      <Industries />

      {/* 6. Why Choose Us / company strengths */}
      <WhyChooseUs />

      {/* 7. Brands / authorized partnerships */}
      <BrandsSection brands={brands} />

      {/* 8. Certificates preview */}
      <CertificationsPreview certificates={certificates} />

      {/* 9. Gallery preview */}
      <GalleryPreview images={galleryItems} />

      {/* 10. Contact / enquiry CTA */}
      <ContactCTA
        phone={company?.primary_phone ?? undefined}
        email={company?.email ?? undefined}
      />
    </>
  )
}
