import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().min(7, 'Please enter a valid phone number').max(20).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  subject: z.string().min(2, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  honeypot: z.string().max(0, 'Bot detected').optional(), // hidden field
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  category_id: z.string().uuid().nullable().optional(),
  brand: z.string().max(100).nullable().optional(),
  sku: z.string().max(100).nullable().optional(),
  short_description: z.string().max(500).nullable().optional(),
  description: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  description: z.string().max(500).nullable().optional(),
  image_url: z.string().url().nullable().optional().or(z.literal('')),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export const companySettingsSchema = z.object({
  company_name: z.string().min(1).max(100),
  tagline: z.string().max(200).nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal('')),
  primary_phone: z.string().max(20).nullable().optional(),
  secondary_phone: z.string().max(20).nullable().optional(),
  whatsapp: z.string().max(20).nullable().optional(),
  office_hours: z.string().max(200).nullable().optional(),
  about_short: z.string().max(500).nullable().optional(),
  about_long: z.string().nullable().optional(),
  facebook_url: z.string().url().nullable().optional().or(z.literal('')),
  linkedin_url: z.string().url().nullable().optional().or(z.literal('')),
  twitter_url: z.string().url().nullable().optional().or(z.literal('')),
  instagram_url: z.string().url().nullable().optional().or(z.literal('')),
  youtube_url: z.string().url().nullable().optional().or(z.literal('')),
})

export type CompanySettingsFormData = z.infer<typeof companySettingsSchema>
