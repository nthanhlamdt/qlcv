import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const accessToken = req.cookies.get('access_token')?.value

  const isAuthPage = url.pathname.startsWith('/auth/login') || url.pathname.startsWith('/auth/register')
  const isAppPage = !isAuthPage && !url.pathname.startsWith('/_next') && !url.pathname.startsWith('/api') && url.pathname !== '/'

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isAppPage && !accessToken) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}


