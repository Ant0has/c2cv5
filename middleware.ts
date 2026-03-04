import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import whitelist from './whitelist.json'

// 301 redirects: old non-svo SVO-city routes → svo-taxi versions
const svoRedirects: Record<string, string> = {
  'donetsk-ekaterinburg.html': 'svo-taxi-ekaterinburg-donetsk.html',
  'donetsk-kazan.html': 'svo-taxi-kazan-donetsk.html',
  'donetsk-kirov.html': 'svo-taxi-kirov-donetsk.html',
  'donetsk-orenburg.html': 'svo-taxi-orenburg-donetsk.html',
  'donetsk-perm.html': 'svo-taxi-perm-donetsk.html',
  'donetsk-saransk.html': 'svo-taxi-saransk-donetsk.html',
  'donetsk-saratov.html': 'svo-taxi-saratov-donetsk.html',
  'donetsk-tambov.html': 'svo-taxi-tambov-donetsk.html',
  'donetsk-ufa.html': 'svo-taxi-ufa-donetsk.html',
  'donetsk-volgograd.html': 'svo-taxi-volgograd-donetsk.html',
  'donetsk-yoshkar-ola.html': 'svo-taxi-yoshkar-ola-donetsk.html',
  'donetsk-chelyabinsk.html': 'svo/donetsk',
  'donetsk-maykop.html': 'svo/donetsk',
  'energodar-rostov-na-don.html': 'svo-taxi-energodar-rostov-na-donu.html',
  'energodar-simferopol.html': 'svo-taxi-simferopol-energodar.html',
  'energodar-ufa.html': 'svo-taxi-ufa-energodar.html',
  'lugansk-astrahan.html': 'svo-taxi-astrahan-lugansk.html',
  'lugansk-belgorod.html': 'svo-taxi-belgorod-lugansk.html',
  'lugansk-bryansk.html': 'svo-taxi-bryansk-lugansk.html',
  'lugansk-chelyabinsk.html': 'svo/lugansk',
  'lugansk-izhevsk.html': 'svo-taxi-izhevsk-lugansk.html',
  'lugansk-kirov.html': 'svo-taxi-kirov-lugansk.html',
  'lugansk-kostroma.html': 'svo-taxi-kostroma-lugansk.html',
  'lugansk-kursk.html': 'svo-taxi-kursk-lugansk.html',
  'lugansk-perm.html': 'svo-taxi-perm-lugansk.html',
  'lugansk-rostov-na-don.html': 'svo-taxi-lugansk-rostov-na-donu.html',
  'lugansk-ryazan.html': 'svo-taxi-ryazan-lugansk.html',
  'lugansk-samara.html': 'svo-taxi-samara-lugansk.html',
  'lugansk-saransk.html': 'svo-taxi-saransk-lugansk.html',
  'lugansk-saratov.html': 'svo-taxi-saratov-lugansk.html',
  'lugansk-simferopol.html': 'svo-taxi-simferopol-lugansk.html',
  'lugansk-stavropol.html': 'svo-taxi-stavropol-lugansk.html',
  'lugansk-ufa.html': 'svo-taxi-ufa-lugansk.html',
  'lugansk-volgograd.html': 'svo-taxi-volgograd-lugansk.html',
  'lugansk-voronezh.html': 'svo-taxi-voronezh-lugansk.html',
  'lugansk-yoshkar-ola.html': 'svo-taxi-yoshkar-ola-lugansk.html',
  'mariupol-kazan.html': 'svo-taxi-kazan-mariupol.html',
  'mariupol-kursk.html': 'svo-taxi-kursk-mariupol.html',
  'mariupol-rostov-na-don.html': 'svo-taxi-mariupol-rostov-na-donu.html',
  'mariupol-stavropol.html': 'svo-taxi-stavropol-mariupol.html',
  'mariupol-ufa.html': 'svo-taxi-ufa-mariupol.html',
  'mariupol-voronezh.html': 'svo-taxi-voronezh-mariupol.html',
  'melitopol-penza.html': 'svo-taxi-penza-melitopol.html',
  'melitopol-rostov-na-don.html': 'svo-taxi-melitopol-rostov-na-donu.html',
  'melitopol-ryazan.html': 'svo-taxi-ryazan-melitopol.html',
  'melitopol-ufa.html': 'svo-taxi-ufa-melitopol.html',
  'svatovo-belgorod.html': 'svo-taxi-belgorod-svatovo.html',
  'svatovo-kazan.html': 'svo-taxi-kazan-svatovo.html',
  'tokmak-rostov-na-don.html': 'svo-taxi-tokmak-rostov-na-donu.html',
  'tokmak-samara.html': 'svo-taxi-samara-tokmak.html',
  'tokmak-simferopol.html': 'svo-taxi-simferopol-tokmak.html',
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Strip tracking/ad GET params with 301 redirect
  const junkParams = ['ttpage', 'etext', 'pm_source', 'pm_block', 'pm_position']
  const hasJunk = junkParams.some(p => searchParams.has(p))
  if (hasJunk) {
    const newSearchParams = new URLSearchParams(searchParams)
    junkParams.forEach(p => newSearchParams.delete(p))

    const newUrl = new URL(request.url)
    newUrl.search = newSearchParams.toString()

    return NextResponse.redirect(newUrl, 301)
  }

  // 2. Redirect route pages without .html to .html version (dedup)
  if (!pathname.endsWith('.html') && pathname !== '/') {
    const candidateSlug = pathname.slice(1) + '.html'
    if (whitelist.includes(candidateSlug)) {
      return NextResponse.redirect(new URL('/' + candidateSlug, request.url), 301)
    }
  }

  // 3. Проверка страниц маршрутов на наличие в whitelist
  if (pathname.endsWith('.html') && pathname !== '/') {
    const slug = pathname.slice(1)

    // 301 redirect old SVO-city routes to svo-taxi versions
    if (svoRedirects[slug]) {
      return NextResponse.redirect(new URL('/' + svoRedirects[slug], request.url), 301)
    }

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
