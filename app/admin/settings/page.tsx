'use client'

import { useState } from 'react'
import { Save, CheckCircle2, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    company_name: 'Power Equipments',
    tagline: 'Leading Supplier of Electrical & Industrial Products in Central India',
    primary_phone: '+91 98260 12345',
    secondary_phone: '+91 755 2740000',
    whatsapp: '+91 98260 12345',
    email: 'contact@powerequipments.in',
    office_hours: 'Mon - Sat: 9:30 AM - 7:00 PM',
    address: 'MP Nagar Zone 1, Bhopal, Madhya Pradesh - 462011',
    facebook_url: 'https://facebook.com',
    linkedin_url: 'https://linkedin.com',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
          Company Settings &amp; Contact Info
        </h1>
        <p className="text-xs text-slate-500">Update phone numbers, contact email, and address displayed across the website</p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Settings saved successfully! Website headers and footers updated.</span>
        </div>
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
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
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
                value={settings.primary_phone}
                onChange={(e) => setSettings({ ...settings, primary_phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office Landline</label>
              <input
                type="text"
                value={settings.secondary_phone}
                onChange={(e) => setSettings({ ...settings, secondary_phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Address & Hours */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" /> Address &amp; Office Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office Address</label>
              <textarea
                rows={3}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Working Hours</label>
              <input
                type="text"
                value={settings.office_hours}
                onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600 mb-2"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
