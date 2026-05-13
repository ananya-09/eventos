import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/organizer', '/admin']

export default withAuth(
  function proxy(request: NextRequest) {
    const response = NextResponse.next()

    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';",
    )

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
          return !!token
        }

        return true
      },
    },
    pages: {
      signIn: '/login',
      error: '/auth/error',
    },
  },
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
}