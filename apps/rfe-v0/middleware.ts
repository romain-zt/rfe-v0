import { NextRequest, NextResponse } from 'next/server'

/** Public locales only — FR disabled until launch */
const locales = ['en']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => (lang.split(';')[0] ?? '').trim().slice(0, 2).toLowerCase())
      .find((lang) => locales.includes(lang))
    
    if (preferredLocale) {
      return preferredLocale
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Legacy / bookmarked French URLs → English
  if (/^\/fr(?:\/|$)/.test(pathname)) {
    const dest = pathname.replace(/^\/fr(?=\/|$)/, '/en')
    const res = NextResponse.redirect(new URL(dest + request.nextUrl.search, request.url))
    res.cookies.set('NEXT_LOCALE', 'en', { path: '/' })
    return res
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: ['/((?!_next|api|admin|next|.*\\..*).*)'],
}
