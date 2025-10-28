import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Удаляем параметр ttpage из всех URL
  if (searchParams.has('ttpage')) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('ttpage')
    
    const newUrl = new URL(request.url)
    newUrl.search = newSearchParams.toString()
    
    return NextResponse.redirect(newUrl, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}