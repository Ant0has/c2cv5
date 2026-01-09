import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import whitelist from './whitelist.json'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (searchParams.has('ttpage')) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('ttpage')

    const newUrl = new URL(request.url)
    newUrl.search = newSearchParams.toString()

    return NextResponse.redirect(newUrl, 301)
  }

  // 2. Вторая задача: проверка страниц маршрутов на наличие в whitelist
  if (pathname.endsWith('.html') && pathname !== '/') {
    const slug = pathname.slice(1)
    
    if (!whitelist.includes(slug)) {
      return NextResponse.rewrite(new URL('/404', request.url), { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}