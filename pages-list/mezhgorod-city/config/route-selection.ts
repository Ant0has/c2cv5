import type { RegionHubRoute } from '@/pages-list/region-hubs/types'
import khabarovskPaths from './khabarovsk-route-paths.json'

// Конечные HTTP-адреса проверены 07.10.2026. Не угадываем адрес удалением суффикса -2:
// Волочаевка-2 — настоящее название; часть canonical в API ведёт на 410 или редирект.
export function khabarovskRoutePath(url: string): string | undefined {
  const path = (khabarovskPaths as Record<string, string>)[url]
  // Оба названия обозначают Советскую Гавань. Удаляется лишь повтор в навигации,
  // существующие страницы, canonical и перенаправления не меняются.
  return path === '/xabarovsk-sovgavan.html' ? '/xabarovsk-sovetskaya-gavan.html' : path
}

export function selectCityHubData<T extends { routes: RegionHubRoute[]; totalCount: number; minPrice: number }>(citySlug: string, data: T): T {
  if (citySlug !== 'habarovsk') return data
  const seen = new Set<string>()
  const routes = data.routes.filter(route => {
    const path = khabarovskRoutePath(route.url)
    if (!path || seen.has(path) || !/^(habarovsk|xabarovsk)-/.test(route.url)) return false
    seen.add(path)
    return true
  })
  const prices = routes.map(route => route.price_comfort ?? route.price_economy ?? 0).filter(price => price > 0)
  return { ...data, routes, totalCount: routes.length, minPrice: prices.length ? Math.min(...prices) : 0 }
}

export const KHABAROVSK_ROUTE_GROUPS = [
  { title: 'По Хабаровскому краю', description: 'Обычные и рабочие поездки. Укажите точный адрес; въезд на территорию предприятия и пропуск согласуются отдельно.', paths: ['/xabarovsk-komsomolsk-na-amure.html', '/xabarovsk-amursk.html', '/xabarovsk-vyazemskij.html', '/xabarovsk-bikin.html', '/xabarovsk-vanino.html', '/xabarovsk-sovetskaya-gavan.html', '/xabarovsk-nikolaevsk-na-amure.html'] },
  { title: 'В соседние регионы', description: 'Поездки из Хабаровска в ЕАО, Амурскую область и Приморье. Обратный выезд и необходимые остановки обсудите при заказе.', paths: ['/xabarovsk-birobidzhan.html', '/xabarovsk-blagoveshhensk.html', '/xabarovsk-vladivostok.html', '/xabarovsk-ussurijsk.html', '/xabarovsk-naxodka.html'] },
  { title: 'Отдых и санатории за пределами края', description: 'Кульдур и Горные Ключи — Шмаковка. Назовите санаторий или место размещения: поездка в населённый пункт и подача к конкретному корпусу могут отличаться.', paths: ['/xabarovsk-kuldur.html', '/xabarovsk-gornye-klyuchi-shmakovka.html'] },
] as const
