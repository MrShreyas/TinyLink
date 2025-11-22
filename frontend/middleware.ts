import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware checks for an `auth_token` cookie.
// - If no cookie and user requests a protected page -> redirect to `/login` (adds ?from=original)
// - If cookie exists and user requests auth pages (login/signup) -> redirect to `/dashboard`

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/favicon.ico',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow next internals, API routes and static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static')) {
    return NextResponse.next()
  }

  const cookie = req.cookies.get('auth_token')
  const hasAuth = !!cookie?.value

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (!hasAuth && !isPublicPath) {
    // Not authenticated and requesting a protected page -> redirect to login
    const url = new URL('/login', req.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  if (hasAuth && (pathname === '/login' || pathname === '/signup')) {
    // Authenticated and trying to access login/signup -> send to dashboard
    const url = new URL('/dashboard', req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Run middleware for all routes except Next internals, static and api
export const config = {
  matcher: ['/(.*)'],
}
