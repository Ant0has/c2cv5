import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Если путь — /index.html → редиректим на /
  if (pathname === '/index.html') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2️⃣ Пропускаем корень и любые пути, уже оканчивающиеся на .html
  if (pathname === '/' || pathname.endsWith('.html')) {
    return NextResponse.next();
  }

  // 3️⃣ Иначе добавляем .html
  return NextResponse.redirect(new URL(`${pathname}.html`, request.url));
}

// Применяем middleware ко всем путям, кроме корня и .html
export const config = {
  matcher: ['/index.html', '/:path((?!.*\\.html$|^$).+)'],
};
