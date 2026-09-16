import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

function isValidHttpUrl(stringUrl?: string): boolean {
  if (!stringUrl) return false
  try {
    const url = new URL(stringUrl)
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      !stringUrl.includes('placeholder') &&
      !stringUrl.includes('your_supabase')
    )
  } catch {
    return false
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (
    !isValidHttpUrl(supabaseUrl) ||
    !supabaseAnonKey ||
    supabaseAnonKey.includes('your_supabase') ||
    supabaseAnonKey.includes('placeholder')
  ) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient<Database>(
      supabaseUrl!,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect all /admin routes except /admin/login
    if (
      request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login') &&
      !user
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // If logged-in admin visits /admin/login, redirect to /admin
    if (request.nextUrl.pathname === '/admin/login' && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  } catch (error) {
    // If Supabase connection fails, do not crash middleware
    console.warn('Supabase middleware auth check failed:', error)
  }

  return supabaseResponse
}
