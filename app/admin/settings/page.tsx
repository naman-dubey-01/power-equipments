import { getAdminCompanySettings } from '@/lib/actions/settings'
import { SettingsForm } from '@/components/admin/SettingsForm'
import type { CompanySettingsFormData } from '@/lib/validation/schemas'

export const metadata = { title: 'Settings — Admin' }

const defaults: CompanySettingsFormData = {
  company_name: 'Power Equipments',
  tagline: '',
  email: '',
  primary_phone: '',
  secondary_phone: '',
  whatsapp: '',
  office_hours: '',
  about_short: '',
  about_long: '',
  facebook_url: '',
  linkedin_url: '',
  twitter_url: '',
  instagram_url: '',
  youtube_url: '',
}

export default async function AdminSettingsPage() {
  let initial = defaults
  let loadError: string | undefined

  try {
    const settings = await getAdminCompanySettings()
    if (settings) {
      initial = {
        company_name: settings.company_name || defaults.company_name,
        tagline: settings.tagline ?? '',
        email: settings.email ?? '',
        primary_phone: settings.primary_phone ?? '',
        secondary_phone: settings.secondary_phone ?? '',
        whatsapp: settings.whatsapp ?? '',
        office_hours: settings.office_hours ?? '',
        about_short: settings.about_short ?? '',
        about_long: settings.about_long ?? '',
        facebook_url: settings.facebook_url ?? '',
        linkedin_url: settings.linkedin_url ?? '',
        twitter_url: settings.twitter_url ?? '',
        instagram_url: settings.instagram_url ?? '',
        youtube_url: settings.youtube_url ?? '',
      }
    }
  } catch (e) {
    loadError = (e as Error).message
  }

  return <SettingsForm initial={initial} loadError={loadError} />
}