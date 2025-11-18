import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // const isBryanskRegion = (pathname.includes('bryansk')) &&
  //   !excludesPages.find(page => page.includes(pathname))

  // Удаляем параметр ttpage из всех URL
  if (searchParams.has('ttpage')) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('ttpage')

    const newUrl = new URL(request.url)
    newUrl.search = newSearchParams.toString()

    return NextResponse.redirect(newUrl, 301)
  }

  // if (isBryanskRegion) {
  //   const response = NextResponse.next()

  //   response.headers.set('x-robots-tag', 'noindex, nofollow')

  //   response.cookies.set('need-noindex', 'true')

  //   return response
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}