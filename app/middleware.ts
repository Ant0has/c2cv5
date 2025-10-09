import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем корень и пути, уже содержащие .html
  if (pathname === '/' || pathname.endsWith('.html')) {
    return NextResponse.next();
  }

  // Редиректим на путь с .html
  return NextResponse.redirect(new URL(`${pathname}.html`, request.url));
}

// Применяем middleware только к путям /:region
export const config = {
  matcher: ['/:path((?!.*\\.html$|^$).+)'],
};