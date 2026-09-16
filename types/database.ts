export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'editor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'editor'
          created_at?: string
          updated_at?: string
        }
        Update: {}
        Relationships: any[]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {}
        Relationships: any[]
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          short_description: string | null
          description: string | null
          brand: string | null
          sku: string | null
          featured: boolean
          is_active: boolean
          sort_order: number
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          brand?: string | null
          sku?: string | null
          featured?: boolean
          is_active?: boolean
          sort_order?: number
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {}
        Relationships: any[]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          storage_path: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          storage_path: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {}
        Relationships: any[]
      }
      gallery_items: {
        Row: {
          id: string
          title: string | null
          description: string | null
          category: string | null
          storage_path: string
          alt_text: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          description?: string | null
          category?: string | null
          storage_path: string
          alt_text?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {}
        Relationships: any[]
      }
      certificates: {
        Row: {
          id: string
          title: string
          issuer: string | null
          description: string | null
          image_path: string | null
          document_path: string | null
          valid_from: string | null
          valid_until: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          issuer?: string | null
          description?: string | null
          image_path?: string | null
          document_path?: string | null
          valid_from?: string | null
          valid_until?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {}
        Relationships: any[]
      }
      company_settings: {
        Row: {
          id: string
          company_name: string
          tagline: string | null
          email: string | null
          primary_phone: string | null
          secondary_phone: string | null
          whatsapp: string | null
          office_hours: string | null
          about_short: string | null
          about_long: string | null
          facebook_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          instagram_url: string | null
          youtube_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          tagline?: string | null
          email?: string | null
          primary_phone?: string | null
          secondary_phone?: string | null
          whatsapp?: string | null
          office_hours?: string | null
          about_short?: string | null
          about_long?: string | null
          facebook_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          instagram_url?: string | null
          youtube_url?: string | null
          updated_at?: string
        }
        Update: {}
        Relationships: any[]
      }
      offices: {
        Row: {
          id: string
          name: string
          address: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          phone: string | null
          email: string | null
          latitude: number | null
          longitude: number | null
          map_url: string | null
          sort_order: number
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          phone?: string | null
          email?: string | null
          latitude?: number | null
          longitude?: number | null
          map_url?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: {}
        Relationships: any[]
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          subject: string | null
          message: string
          status: 'new' | 'read' | 'replied' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          subject?: string | null
          message: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
        }
        Update: {}
        Relationships: any[]
      }
      brands: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          website_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          website_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {}
        Relationships: any[]
      }
    }
  }
}
