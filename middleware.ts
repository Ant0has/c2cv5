import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import whitelist from './whitelist.json'

// 301 redirects: старые .html хабы городов → новая иерархия /mezhgorod/{city}/.
// (Раньше target был /regions/{fo}/{city}/ — переписаны на /mezhgorod/{city}/
// после перехода всех 69 региональных хабов на /mezhgorod/, май 2026.)
const hubRedirects: Record<string, string> = {
  'taxi777-mezhgorod-moscow.html': '/mezhgorod/moskva/',
  'taxi-mezhgorod-voronezh.html': '/mezhgorod/voronezh/',
  'taxi-mezhgorod-tula-71.html': '/mezhgorod/tula/',
  'taxi-mezhgorod-bryansk-32.html': '/mezhgorod/bryansk/',
  'taxi-mezhgorod-kaluga-39.html': '/mezhgorod/kaluga/',
  'taxi-mezhgorod-tver-69.html': '/mezhgorod/tver/',
  'taxi-mezhgorod-ryazan-62.html': '/mezhgorod/ryazan/',
  'taxi-mezhgorod-yaroslavl-76.html': '/mezhgorod/yaroslavl/',
  'taxi-mezhgorod-vladimir-33.html': '/mezhgorod/vladimir/',
  'taxi-mezhgorod-ivanovo-37.html': '/mezhgorod/ivanovo/',
  'taxi-mezhgorod-kostroma-44.html': '/mezhgorod/kostroma/',
  'taxi-mezhgorod-smolensk-67.html': '/mezhgorod/smolensk/',
  'taxi-mezhgorod-lipeck-48.html': '/mezhgorod/lipetsk/',
  'taxi-mezhgorod-tambov-68.html': '/mezhgorod/tambov/',
  'taxi-mezhgorod-orel-57.html': '/mezhgorod/oryol/',
  'taxi-mezhgorod-kursk-46.html': '/mezhgorod/kursk/',
  'taxi-mezhgorod-belgorod.html': '/mezhgorod/belgorod/',
  'taxi78-mezhgorod-piter.html': '/mezhgorod/sankt-peterburg/',
  'taxi60-mezhgorod-pskov.html': '/mezhgorod/pskov/',
  'taxi-mezhgorod-vologda-34.html': '/mezhgorod/vologda/',
  'taxi-mezhgorod-petrozavodsk.html': '/mezhgorod/petrozavodsk/',
  'taxi-mezhgorod-arhangelsk.html': '/mezhgorod/arhangelsk/',
  'taxi-mezhgorod-murmansk-51.html': '/mezhgorod/murmansk/',
  'taxi-mezhgorod-velikiy-novgorod-53.html': '/mezhgorod/velikiy-novgorod/',
  'taxi-mezhgorod-syktyvkar.html': '/mezhgorod/syktyvkar/',
  'taxi61-mezhgorod-ro.html': '/mezhgorod/rostov-na-donu/',
  'taxi35-mezhgorod-volgograd.html': '/mezhgorod/volgograd/',
  'taxi30-mezhgorod-astrahan.html': '/mezhgorod/astrahan/',
  '82-mezhgorod-krym.html': '/mezhgorod/krym/',
  'taxi-mezhgorod-elista-08.html': '/mezhgorod/elista/',
  'taxi-mezhgorod-stavropol.html': '/mezhgorod/stavropol/',
  '102-taxi-mezhgorod-ufa.html': '/mezhgorod/ufa/',
  '16-mezhgorod-kazan.html': '/mezhgorod/kazan/',
  'taxi-mezhgorod-samara.html': '/mezhgorod/samara/',
  'taxi-mezhgorod-orenburg-56.html': '/mezhgorod/orenburg/',
  'taxi-mezhgorod-izhevsk-18.html': '/mezhgorod/izhevsk/',
  'taxi-mezhgorod-nizhniy_novgorod.html': '/mezhgorod/nizhniy-novgorod/',
  'taxi-mezhgorod-saratov.html': '/mezhgorod/saratov/',
  'taxi-mezhgorod-ulyanovsk-73.html': '/mezhgorod/ulyanovsk/',
  'taxi-mezhgorod-kirov-43.html': '/mezhgorod/kirov/',
  'taxi-mezhgorod-cheboksary-21.html': '/mezhgorod/cheboksary/',
  'taxi-mezhgorod-yoshkar-ola-12.html': '/mezhgorod/yoshkar-ola/',
  'taxi-mezhgorod-saransk-13.html': '/mezhgorod/saransk/',
  'taxi59-mezhgorod-perm.html': '/mezhgorod/perm/',
  'taxi-mezhgorod-ekaterinburg.html': '/mezhgorod/ekaterinburg/',
  'taxi-mezhgorod-chelyabinsk.html': '/mezhgorod/chelyabinsk/',
  'taxi-mezhgorod-kurgan-45.html': '/mezhgorod/kurgan/',
  'taxi72-mezhgorod-to.html': '/mezhgorod/tyumen/',
  'taxi86-mezhgorod-hanty_mansiysk.html': '/mezhgorod/hanty-mansiysk/',
  'taxi-mezhgorod-novosibirsk-54.html': '/mezhgorod/novosibirsk/',
  'taxi-mezhgorod-krasnojarsk.html': '/mezhgorod/krasnoyarsk/',
  'taxi-mezhgorod-tomsk-70.html': '/mezhgorod/tomsk/',
  'taxi-mezhgorod-barnaul-22.html': '/mezhgorod/barnaul/',
  'taxi-mezhgorod-kemerovo-42.html': '/mezhgorod/kemerovo/',
  'taxi-mezhgorod-omsk-55.html': '/mezhgorod/omsk/',
  'taxi-mezhgorod-habarovsk.html': '/mezhgorod/habarovsk/',
  'taxi-mezhgorod-jakutsk.html': '/mezhgorod/yakutsk/',
  'taxi-mezhgorod-irkutsk.html': '/mezhgorod/irkutsk/',
  'taxi-mezhgorod-vladivostok.html': '/mezhgorod/vladivostok/',
  'taxi-mezhgorod-blagoveshhensk.html': '/mezhgorod/blagoveshchensk/',
  'taxi-mezhgorod-chita.html': '/mezhgorod/chita/',
  'taxi-mezhgorod-ulan-ude-03.html': '/mezhgorod/ulan-ude/',
  'taxi-mezhgorod-kyzyl-17.html': '/mezhgorod/kyzyl/',
  'taxi-mezhgorod-yuzhno-sahalinsk-65.html': '/mezhgorod/yuzhno-sahalinsk/',
  'taxi-mezhgorod-birobidzhan-79.html': '/mezhgorod/birobidzhan/',
}

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

  // 1a. Orel/oryol дубль → /mezhgorod/oryol/
  if (
    pathname === '/regions/cfo/orel' || pathname === '/regions/cfo/orel/' ||
    pathname === '/mezhgorod/orel' || pathname === '/mezhgorod/orel/'
  ) {
    return NextResponse.redirect(new URL('/mezhgorod/oryol/', request.url), 301)
  }

  // 1b. /regions/{fo}/{city}/ → /mezhgorod/{city}/
  // Покрывает все 69 региональных хабов одним правилом.
  const regionsCityMatch = pathname.match(/^\/regions\/[a-z]+\/([a-z-]+)\/?$/)
  if (regionsCityMatch) {
    return NextResponse.redirect(new URL(`/mezhgorod/${regionsCityMatch[1]}/`, request.url), 301)
  }

  // 1c. /regions/{fo}/ → /mezhgorod/
  if (/^\/regions\/[a-z]+\/?$/.test(pathname)) {
    return NextResponse.redirect(new URL('/mezhgorod/', request.url), 301)
  }

  // 1d. /regions/ → /mezhgorod/
  if (pathname === '/regions' || pathname === '/regions/') {
    return NextResponse.redirect(new URL('/mezhgorod/', request.url), 301)
  }

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

    // 301 redirect старые .html хабы → /mezhgorod/{city}/
    if (hubRedirects[slug]) {
      return NextResponse.redirect(new URL(hubRedirects[slug], request.url), 301)
    }

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
