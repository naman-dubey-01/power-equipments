'use client'

import { useState } from 'react'
import { Mail, Phone, Building2, Calendar, CheckCircle, Clock, Archive, ExternalLink } from 'lucide-react'

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([
    {
      id: 'e1',
      name: 'Ramesh Sharma',
      email: 'ramesh@indoreindustries.com',
      phone: '+91 98260 11223',
      company: 'Indore Engineering Works',
      subject: 'Quotation for ABB ACS880 VFD 45kW',
      message: 'We require a formal quotation for 4 units of ABB ACS880 VFDs for our plant expansion in Pithampur Industrial Area.',
      status: 'NEW',
      created_at: '2026-09-16T14:30:00Z',
    },
    {
      id: 'e2',
      name: 'Anil Kumar',
      email: 'anil@bhopalpower.in',
      phone: '+91 94250 88776',
      company: 'Bhopal Switchgear & Controls',
      subject: 'Bulk enquiry for Polycab FR Copper Wires',
      message: 'Looking for distributor pricing on 1.5 sq mm and 2.5 sq mm Polycab copper wires in 90m rolls.',
      status: 'RESPONDED',
      created_at: '2026-09-15T10:15:00Z',
    },
    {
      id: 'e3',
      name: 'Suresh Patel',
      email: 'spatel@mandideepmfg.co.in',
      phone: '+91 97555 44321',
      company: 'Mandideep Auto Components',
      subject: 'Siemens SIMOTICS Motor 15HP requirement',
      message: 'Please share lead time and tech specification datasheet for Siemens SIMOTICS 3-phase IE3 motor.',
      status: 'NEW',
      created_at: '2026-09-14T16:45:00Z',
    },
  ])

  const [selectedEnquiry, setSelectedEnquiry] = useState<typeof enquiries[0] | null>(null)

  const toggleResponded = (id: string) => {
    setEnquiries(enquiries.map(e => {
      if (e.id === id) {
        return { ...e, status: e.status === 'NEW' ? 'RESPONDED' : 'NEW' }
      }
      return e
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
          Customer Enquiries Inbox
        </h1>
        <p className="text-xs text-slate-500">View incoming product leads and quotation requests from clients</p>
      </div>

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
                onClick={() => setSelectedEnquiry(e)}
                className={`p-5 cursor-pointer transition-colors ${
                  selectedEnquiry?.id === e.id ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">{e.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      e.status === 'NEW'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mb-1">{e.subject}</div>
                <div className="text-xs text-slate-500 line-clamp-1 mb-2">{e.message}</div>
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Building2 size={12} /> {e.company || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(e.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Enquiry Detail View */}
        <div className="lg:col-span-5">
          {selectedEnquiry ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedEnquiry.name}</h3>
                  <span className="text-xs text-slate-500">{selectedEnquiry.company}</span>
                </div>
                <button
                  onClick={() => toggleResponded(selectedEnquiry.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    selectedEnquiry.status === 'NEW'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle size={14} />
                  {selectedEnquiry.status === 'NEW' ? 'Mark as Responded' : 'Reopen Lead'}
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 hover:underline font-medium">
                    {selectedEnquiry.email}
                  </a>
                </div>
                {selectedEnquiry.phone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <a href={`tel:${selectedEnquiry.phone}`} className="font-mono text-slate-900">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Subject</h4>
                <p className="text-xs text-slate-800 font-semibold mb-4">{selectedEnquiry.subject}</p>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Message Content</h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=RE:%20${encodeURIComponent(selectedEnquiry.subject)}`}
                  className="flex-1 btn btn-primary flex justify-center items-center gap-2 py-2.5 text-xs"
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
