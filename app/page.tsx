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
import type { Metadata } from 'next'

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
  let categories: any[] = []
  let featuredProducts: any[] = []
  let certificates: any[] = []
  let galleryItems: any[] = []
  let company: any = null
  let brands: any[] = []

  try {
    const supabase = await createClient()

    const [catsResult, productsResult, certsResult, galleryResult, companyResult, brandsResult] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(9),
      supabase
        .from('products')
        .select('id, name, slug, short_description, brand, category_id')
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
    ])

    categories = catsResult.data ?? []
    featuredProducts = productsResult.data ?? []
    certificates = certsResult.data ?? []
    galleryItems = galleryResult.data ?? []
    company = companyResult.data ?? null
    brands = brandsResult.data ?? []
  } catch {}

  return (
    <>
      {/* 1. Full-width homepage image slideshow */}
      <HeroSlideshow />

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
        phone={company?.primary_phone}
        email={company?.email}
      />
    </>
  )
}
