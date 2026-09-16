import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://powerequipments.in'

interface PageMetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${siteUrl}${path}`
  const ogImage = image || `${siteUrl}/og-image.jpg`

  return {
    title: `${title} | Power Equipments`,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Power Equipments`,
      description,
      url,
      siteName: 'Power Equipments',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Power Equipments`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export const defaultMetadata: Metadata = {
  title: {
    default: 'Power Equipments — Electrical & Industrial Solutions',
    template: '%s | Power Equipments',
  },
  description:
    'Power Equipments is a leading supplier of electrical and industrial products in Central India. Explore VFDs, motors, LED lighting, wires & cables, switchgears and more.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: 'Power Equipments',
    locale: 'en_IN',
    type: 'website',
  },
}
