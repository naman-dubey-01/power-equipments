import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://powerequipments.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/gallery`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/certificates`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  let categoryRoutes: MetadataRoute.Sitemap = []
  let productRoutes: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()
    const [catsResult, productsResult] = await Promise.all([
      supabase.from('categories').select('slug').eq('is_active', true),
      supabase.from('products').select('slug').eq('is_active', true),
    ])

    categoryRoutes = (catsResult.data ?? []).map((c) => ({
      url: `${siteUrl}/products/category/${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    productRoutes = (productsResult.data ?? []).map((p) => ({
      url: `${siteUrl}/products/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {}

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}