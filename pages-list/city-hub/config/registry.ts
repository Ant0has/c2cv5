export interface RegionEntry {
  slug: string
  name: string
  shortName: string
  nameLocative: string
  cities: CityEntry[]
}

export interface CityEntry {
  slug: string
  name: string
  nameLocative: string
  nameGenitive: string
}

export const REGIONS: RegionEntry[] = [
  {
    slug: 'centralnaya-rossiya',
    name: 'Центральная Россия',
    shortName: 'ЦФО',
    nameLocative: 'Центральной России',
    cities: [
      { slug: 'moskva', name: 'Москва', nameLocative: 'в Москве', nameGenitive: 'из Москвы' },
      { slug: 'voronezh', name: 'Воронеж', nameLocative: 'в Воронеже', nameGenitive: 'из Воронежа' },
      { slug: 'tula', name: 'Тула', nameLocative: 'в Туле', nameGenitive: 'из Тулы' },
      { slug: 'yaroslavl', name: 'Ярославль', nameLocative: 'в Ярославле', nameGenitive: 'из Ярославля' },
    ],
  },
  {
    slug: 'severo-zapad',
    name: 'Северо-Запад',
    shortName: 'СЗФО',
    nameLocative: 'Северо-Западе',
    cities: [
      { slug: 'sankt-peterburg', name: 'Санкт-Петербург', nameLocative: 'в Санкт-Петербурге', nameGenitive: 'из Санкт-Петербурга' },
      { slug: 'kaliningrad', name: 'Калининград', nameLocative: 'в Калининграде', nameGenitive: 'из Калининграда' },
    ],
  },
  {
    slug: 'yug-rossii',
    name: 'Юг России',
    shortName: 'ЮФО',
    nameLocative: 'Юге России',
    cities: [
      { slug: 'krasnodar', name: 'Краснодар', nameLocative: 'в Краснодаре', nameGenitive: 'из Краснодара' },
      { slug: 'rostov-na-donu', name: 'Ростов-на-Дону', nameLocative: 'в Ростове-на-Дону', nameGenitive: 'из Ростова-на-Дону' },
      { slug: 'sochi', name: 'Сочи', nameLocative: 'в Сочи', nameGenitive: 'из Сочи' },
      { slug: 'volgograd', name: 'Волгоград', nameLocative: 'в Волгограде', nameGenitive: 'из Волгограда' },
    ],
  },
  {
    slug: 'severnyj-kavkaz',
    name: 'Северный Кавказ',
    shortName: 'СКФО',
    nameLocative: 'Северном Кавказе',
    cities: [
      { slug: 'stavropol', name: 'Ставрополь', nameLocative: 'в Ставрополе', nameGenitive: 'из Ставрополя' },
      { slug: 'mahachkala', name: 'Махачкала', nameLocative: 'в Махачкале', nameGenitive: 'из Махачкалы' },
      { slug: 'mineralnye-vody', name: 'Минеральные Воды', nameLocative: 'в Минеральных Водах', nameGenitive: 'из Минеральных Вод' },
    ],
  },
  {
    slug: 'povolzhye',
    name: 'Поволжье',
    shortName: 'ПФО',
    nameLocative: 'Поволжье',
    cities: [
      { slug: 'kazan', name: 'Казань', nameLocative: 'в Казани', nameGenitive: 'из Казани' },
      { slug: 'nizhnij-novgorod', name: 'Нижний Новгород', nameLocative: 'в Нижнем Новгороде', nameGenitive: 'из Нижнего Новгорода' },
      { slug: 'samara', name: 'Самара', nameLocative: 'в Самаре', nameGenitive: 'из Самары' },
      { slug: 'ufa', name: 'Уфа', nameLocative: 'в Уфе', nameGenitive: 'из Уфы' },
      { slug: 'perm', name: 'Пермь', nameLocative: 'в Перми', nameGenitive: 'из Перми' },
      { slug: 'tolyatti', name: 'Тольятти', nameLocative: 'в Тольятти', nameGenitive: 'из Тольятти' },
      { slug: 'saratov', name: 'Саратов', nameLocative: 'в Саратове', nameGenitive: 'из Саратова' },
    ],
  },
  {
    slug: 'ural',
    name: 'Урал',
    shortName: 'УФО',
    nameLocative: 'Урале',
    cities: [
      { slug: 'ekaterinburg', name: 'Екатеринбург', nameLocative: 'в Екатеринбурге', nameGenitive: 'из Екатеринбурга' },
      { slug: 'chelyabinsk', name: 'Челябинск', nameLocative: 'в Челябинске', nameGenitive: 'из Челябинска' },
      { slug: 'tyumen', name: 'Тюмень', nameLocative: 'в Тюмени', nameGenitive: 'из Тюмени' },
      { slug: 'surgut', name: 'Сургут', nameLocative: 'в Сургуте', nameGenitive: 'из Сургута' },
    ],
  },
  {
    slug: 'sibir',
    name: 'Сибирь',
    shortName: 'СФО',
    nameLocative: 'Сибири',
    cities: [
      { slug: 'novosibirsk', name: 'Новосибирск', nameLocative: 'в Новосибирске', nameGenitive: 'из Новосибирска' },
      { slug: 'krasnoyarsk', name: 'Красноярск', nameLocative: 'в Красноярске', nameGenitive: 'из Красноярска' },
      { slug: 'omsk', name: 'Омск', nameLocative: 'в Омске', nameGenitive: 'из Омска' },
      { slug: 'kemerovo', name: 'Кемерово', nameLocative: 'в Кемерове', nameGenitive: 'из Кемерова' },
    ],
  },
  {
    slug: 'dalnij-vostok',
    name: 'Дальний Восток',
    shortName: 'ДФО',
    nameLocative: 'Дальнем Востоке',
    cities: [
      { slug: 'irkutsk', name: 'Иркутск', nameLocative: 'в Иркутске', nameGenitive: 'из Иркутска' },
      { slug: 'vladivostok', name: 'Владивосток', nameLocative: 'во Владивостоке', nameGenitive: 'из Владивостока' },
    ],
  },
]

/** Все пары {region, city} для generateStaticParams */
export function getAllCityParams(): { region: string; city: string }[] {
  return REGIONS.flatMap(r =>
    r.cities.map(c => ({ region: r.slug, city: c.slug }))
  )
}

/** Все slugs регионов для generateStaticParams */
export function getAllRegionParams(): { region: string }[] {
  return REGIONS.map(r => ({ region: r.slug }))
}

/** Найти регион по slug */
export function getRegionBySlug(slug: string): RegionEntry | undefined {
  return REGIONS.find(r => r.slug === slug)
}

/** Найти город и его регион */
export function getCityWithRegion(regionSlug: string, citySlug: string) {
  const region = REGIONS.find(r => r.slug === regionSlug)
  const city = region?.cities.find(c => c.slug === citySlug)
  return { region, city }
}
