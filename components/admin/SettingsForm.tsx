'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, CheckCircle2, Phone, Mail, Globe } from 'lucide-react'
import { saveCompanySettings } from '@/lib/actions/settings'
import type { CompanySettingsFormData } from '@/lib/validation/schemas'

interface SettingsFormProps {
  initial: CompanySettingsFormData
  loadError?: string
}

export function SettingsForm({ initial, loadError }: SettingsFormProps) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<CompanySettingsFormData>(initial)

  const set = <K extends keyof CompanySettingsFormData>(key: K, value: CompanySettingsFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const result = await saveCompanySettings(form)
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } else {
      setError(result.error || 'Failed to save settings')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
          Company Settings &amp; Contact Info
        </h1>
        <p className="text-xs text-slate-500">Update phone numbers, email, about text and addresses displayed across the website</p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Settings saved successfully! Website headers and footers updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">{error}</div>
      )}

      {loadError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">{loadError}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 text-xs">
        {/* Company Identity */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe size={16} className="text-blue-600" /> Company Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={form.company_name}
                onChange={(e) => set('company_name', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline ?? ''}
                onChange={(e) => set('tagline', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Email */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Phone size={16} className="text-blue-600" /> Contact Numbers &amp; Email
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Phone</label>
              <input
                type="text"
                value={form.primary_phone ?? ''}
                onChange={(e) => set('primary_phone', e.target.value)}
                placeholder="+91 98260 12345"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Secondary Phone</label>
              <input
                type="text"
                value={form.secondary_phone ?? ''}
                onChange={(e) => set('secondary_phone', e.target.value)}
                placeholder="+91 755 274 0000"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp</label>
              <input
                type="text"
                value={form.whatsapp ?? ''}
                onChange={(e) => set('whatsapp', e.target.value)}
                placeholder="+91 98260 12345"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={form.email ?? ''}
                onChange={(e) => set('email', e.target.value)}
                placeholder="contact@powerequipments.in"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office Hours</label>
              <input
                type="text"
                value={form.office_hours ?? ''}
                onChange={(e) => set('office_hours', e.target.value)}
                placeholder="Mon – Sat: 9:30 AM – 6:30 PM"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* About Text */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Mail size={16} className="text-blue-600" /> About &amp; Company Story
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Short About (500 chars max)</label>
              <textarea
                rows={2}
                maxLength={500}
                value={form.about_short ?? ''}
                onChange={(e) => set('about_short', e.target.value)}
                placeholder="One-liner used in various sections"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600 resize-y"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full About / Company Story</label>
              <textarea
                rows={6}
                value={form.about_long ?? ''}
                onChange={(e) => set('about_long', e.target.value)}
                placeholder="Detailed company story shown on the About page"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe size={16} className="text-blue-600" /> Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['facebook_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'youtube_url'] as const).map((key) => (
              <div key={key}>
                <label className="block font-semibold text-slate-700 mb-1 capitalize">
                  {key.replace('_url', '')}
                </label>
                <input
                  type="url"
                  value={(form[key] as string | null) ?? ''}
                  onChange={(e) => set(key, e.target.value || null)}
                  placeholder="https://"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}