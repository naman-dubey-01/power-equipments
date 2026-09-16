'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Award,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  Zap,
  Menu,
  X,
  UserCheck
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Banner Slideshow', href: '/admin/slideshow', icon: ImageIcon },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Don't wrap the login page in the dashboard layout shell
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-sm">
          <Zap size={18} className="text-amber-400" />
          <span>Power Equipments Admin</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } h-screen shrink-0 border-r border-slate-800`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg, #1e6fd9, #0d2849)' }}
            >
              <Zap size={22} strokeWidth={2.5} className="text-amber-400" />
            </div>
            <div>
              <span className="block font-bold text-white text-sm leading-tight">
                Power Equipments
              </span>
              <span className="block text-[11px] text-slate-400 font-mono">
                Admin Control Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={16} /> View Live Website
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Admin Portal</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 capitalize">
              {pathname === '/admin' ? 'Dashboard' : pathname.replace('/admin/', '')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <UserCheck size={14} className="text-emerald-600" />
              <span className="font-medium text-slate-800">Administrator Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
