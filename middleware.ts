import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import whitelist from './whitelist.json'

// 301 redirects: old city hub pages → new /regions/{fo}/{city}/
const hubRedirects: Record<string, string> = {
  'taxi777-mezhgorod-moscow.html': '/regions/cfo/moskva/',
  'taxi-mezhgorod-voronezh.html': '/regions/cfo/voronezh/',
  'taxi-mezhgorod-tula-71.html': '/regions/cfo/tula/',
  'taxi-mezhgorod-bryansk-32.html': '/regions/cfo/bryansk/',
  'taxi-mezhgorod-kaluga-39.html': '/regions/cfo/kaluga/',
  'taxi-mezhgorod-tver-69.html': '/regions/cfo/tver/',
  'taxi-mezhgorod-ryazan-62.html': '/regions/cfo/ryazan/',
  'taxi-mezhgorod-yaroslavl-76.html': '/regions/cfo/yaroslavl/',
  'taxi-mezhgorod-vladimir-33.html': '/regions/cfo/vladimir/',
  'taxi-mezhgorod-ivanovo-37.html': '/regions/cfo/ivanovo/',
  'taxi-mezhgorod-kostroma-44.html': '/regions/cfo/kostroma/',
  'taxi-mezhgorod-smolensk-67.html': '/regions/cfo/smolensk/',
  'taxi-mezhgorod-lipeck-48.html': '/regions/cfo/lipetsk/',
  'taxi-mezhgorod-tambov-68.html': '/regions/cfo/tambov/',
  'taxi-mezhgorod-orel-57.html': '/regions/cfo/orel/',
  'taxi-mezhgorod-kursk-46.html': '/regions/cfo/kursk/',
  'taxi-mezhgorod-belgorod.html': '/regions/cfo/belgorod/',
  'taxi78-mezhgorod-piter.html': '/regions/szfo/sankt-peterburg/',
  'taxi-mezhgorod-velikiy-novgorod-53.html': '/regions/szfo/velikiy-novgorod/',
  'taxi-mezhgorod-syktyvkar.html': '/regions/szfo/syktyvkar/',
  'taxi-mezhgorod-murmansk-51.html': '/regions/szfo/murmansk/',
  'taxi-mezhgorod-arhangelsk.html': '/regions/szfo/arhangelsk/',
  'taxi-mezhgorod-petrozavodsk.html': '/regions/szfo/petrozavodsk/',
  '82-mezhgorod-krym.html': '/regions/yufo/krym/',
  'taxi-mezhgorod-elista-08.html': '/regions/yufo/elista/',
  'taxi-mezhgorod-stavropol.html': '/regions/skfo/stavropol/',
  '102-taxi-mezhgorod-ufa.html': '/regions/pfo/ufa/',
  '16-mezhgorod-kazan.html': '/regions/pfo/kazan/',
  'taxi-mezhgorod-samara.html': '/regions/pfo/samara/',
  'taxi-mezhgorod-orenburg-56.html': '/regions/pfo/orenburg/',
  'taxi-mezhgorod-izhevsk-18.html': '/regions/pfo/izhevsk/',
  'taxi-mezhgorod-nizhniy_novgorod.html': '/regions/pfo/nizhniy-novgorod/',
  'taxi-mezhgorod-saratov.html': '/regions/pfo/saratov/',
  'taxi-mezhgorod-ulyanovsk-73.html': '/regions/pfo/ulyanovsk/',
  'taxi-mezhgorod-kirov-43.html': '/regions/pfo/kirov/',
  'taxi-mezhgorod-cheboksary-21.html': '/regions/pfo/cheboksary/',
  'taxi-mezhgorod-yoshkar-ola-12.html': '/regions/pfo/yoshkar-ola/',
  'taxi-mezhgorod-saransk-13.html': '/regions/pfo/saransk/',
  'taxi-mezhgorod-ekaterinburg.html': '/regions/ufo/ekaterinburg/',
  'taxi-mezhgorod-chelyabinsk.html': '/regions/ufo/chelyabinsk/',
  'taxi-mezhgorod-kurgan-45.html': '/regions/ufo/kurgan/',
  'taxi-mezhgorod-novosibirsk-54.html': '/regions/sfo/novosibirsk/',
  'taxi-mezhgorod-krasnojarsk.html': '/regions/sfo/krasnoyarsk/',
  'taxi-mezhgorod-tomsk-70.html': '/regions/sfo/tomsk/',
  'taxi-mezhgorod-barnaul-22.html': '/regions/sfo/barnaul/',
  'taxi-mezhgorod-kemerovo-42.html': '/regions/sfo/kemerovo/',
  'taxi-mezhgorod-omsk-55.html': '/regions/sfo/omsk/',
  'taxi-mezhgorod-habarovsk.html': '/regions/dfo/habarovsk/',
  'taxi-mezhgorod-jakutsk.html': '/regions/dfo/yakutsk/',
  'taxi-mezhgorod-irkutsk.html': '/regions/dfo/irkutsk/',
  'taxi-mezhgorod-vladivostok.html': '/regions/dfo/vladivostok/',
  'taxi-mezhgorod-blagoveshhensk.html': '/regions/dfo/blagoveshchensk/',
  'taxi-mezhgorod-chita.html': '/regions/dfo/chita/',
  'taxi-mezhgorod-ulan-ude-03.html': '/regions/dfo/ulan-ude/',
  'taxi-mezhgorod-kyzyl-17.html': '/regions/dfo/kyzyl/',
  'taxi-mezhgorod-yuzhno-sahalinsk-65.html': '/regions/dfo/yuzhno-sahalinsk/',
  'taxi-mezhgorod-birobidzhan-79.html': '/regions/dfo/birobidzhan/',
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

    // 301 redirect old city hub pages to /regions/{fo}/{city}/
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
