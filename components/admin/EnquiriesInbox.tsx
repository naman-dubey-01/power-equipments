'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, Building2, Calendar, CheckCircle, Inbox } from 'lucide-react'
import { updateSubmissionStatus } from '@/lib/actions/contact'

interface SubmissionRow {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  subject?: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

const statusStyles: Record<SubmissionRow['status'], string> = {
  new: 'bg-amber-100 text-amber-800',
  read: 'bg-blue-100 text-blue-800',
  replied: 'bg-emerald-100 text-emerald-800',
  archived: 'bg-slate-100 text-slate-500',
}

export function EnquiriesInbox({ enquiries, loadError }: { enquiries: SubmissionRow[]; loadError?: string }) {
  const router = useRouter()
  const [selected, setSelected] = useState<SubmissionRow | null>(enquiries[0] ?? null)

  const setStatus = async (id: string, status: string) => {
    const result = await updateSubmissionStatus(id, status)
    if (result.success) router.refresh()
    else alert(result.error || 'Action failed')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
          Customer Enquiries Inbox
        </h1>
        <p className="text-xs text-slate-500">View incoming product leads and quotation requests from clients</p>
      </div>

      {loadError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">{loadError}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiry List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-xs text-slate-500">
            Inbox Leads ({enquiries.length})
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {enquiries.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelected(e)}
                className={`p-5 cursor-pointer transition-all ${
                  selected?.id === e.id ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50 dark:hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">{e.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyles[e.status]}`}>
                    {e.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mb-1">{e.subject || 'General enquiry'}</div>
                <div className="text-xs text-slate-500 line-clamp-1 mb-2">{e.message}</div>
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Building2 size={12} /> {e.company || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(e.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          {enquiries.length === 0 && (
            <div className="text-center py-16">
              <Inbox size={40} strokeWidth={1} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-slate-500">No enquiries yet. Submissions from the public contact form appear here.</p>
            </div>
          )}
        </div>

        {/* Selected Enquiry Detail View */}
        <div className="lg:col-span-5">
          {selected ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selected.name}</h3>
                  <span className="text-xs text-slate-500">{selected.company}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyles[selected.status]}`}>
                  {selected.status.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.status === 'new' && (
                  <button
                    onClick={() => setStatus(selected.id, 'read')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
                {(selected.status === 'new' || selected.status === 'read') && (
                  <button
                    onClick={() => setStatus(selected.id, 'replied')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} /> Mark as Replied
                  </button>
                )}
                {selected.status !== 'archived' && (
                  <button
                    onClick={() => setStatus(selected.id, 'archived')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Archive
                  </button>
                )}
                {selected.status !== 'new' && (
                  <button
                    onClick={() => setStatus(selected.id, 'new')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    Reopen Lead
                  </button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                {selected.email && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline font-medium">
                      {selected.email}
                    </a>
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <a href={`tel:${selected.phone}`} className="font-mono text-slate-900">
                      {selected.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Subject</h4>
                <p className="text-xs text-slate-800 font-semibold mb-4">{selected.subject || 'General enquiry'}</p>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Message Content</h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href={`mailto:${selected.email ?? ''}?subject=RE:%20${encodeURIComponent(selected.subject || '')}`}
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-2.5 text-xs font-semibold shadow-md"
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select an enquiry from the inbox to read full details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}