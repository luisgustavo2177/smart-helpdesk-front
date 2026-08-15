import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TOKEN_COOKIE } from '@/lib/config'

const PROTECTED_PREFIXES = ['/tickets', '/categories', '/users']
const AUTH_PAGES = ['/login', '/register']

/**
 * Redirecionamento otimista baseado só na presença do cookie — a
 * autorização de verdade (token válido, papel do usuário) é sempre
 * checada de novo no servidor (DAL/Server Acti ons/API), nunca só aqui.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isAuthPage = AUTH_PAGES.includes(pathname)

  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthPage && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/tickets'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tickets/:path*', '/categories/:path*', '/users/:path*', '/login', '/register'],
}
