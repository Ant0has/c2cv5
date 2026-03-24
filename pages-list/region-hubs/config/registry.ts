import { FederalDistrict, RegionCity } from '../types'

export const FEDERAL_DISTRICTS: FederalDistrict[] = [
  {
    slug: 'cfo',
    name: 'Центральный федеральный округ',
    shortName: 'ЦФО',
    nameGenitive: 'Центрального федерального округа',
    cities: [
      { slug: 'moskva', name: 'Москва', nameGenitive: 'из Москвы', nameLocative: 'в Москве', regionId: 1, oldHubUrl: 'taxi777-mezhgorod-moscow' },
      { slug: 'voronezh', name: 'Воронеж', nameGenitive: 'из Воронежа', nameLocative: 'в Воронеже', regionId: 12, oldHubUrl: 'taxi-mezhgorod-voronezh' },
      { slug: 'tula', name: 'Тула', nameGenitive: 'из Тулы', nameLocative: 'в Туле', regionId: 60, oldHubUrl: 'taxi-mezhgorod-tula-71' },
      { slug: 'bryansk', name: 'Брянск', nameGenitive: 'из Брянска', nameLocative: 'в Брянске', regionId: 8, oldHubUrl: 'taxi-mezhgorod-bryansk-32' },
      { slug: 'kaluga', name: 'Калуга', nameGenitive: 'из Калуги', nameLocative: 'в Калуге', regionId: 19, oldHubUrl: 'taxi-mezhgorod-kaluga-39' },
      { slug: 'tver', name: 'Тверь', nameGenitive: 'из Твери', nameLocative: 'в Твери', regionId: 59, oldHubUrl: 'taxi-mezhgorod-tver-69' },
      { slug: 'ryazan', name: 'Рязань', nameGenitive: 'из Рязани', nameLocative: 'в Рязани', regionId: 38, oldHubUrl: 'taxi-mezhgorod-ryazan-62' },
      { slug: 'yaroslavl', name: 'Ярославль', nameGenitive: 'из Ярославля', nameLocative: 'в Ярославле', regionId: 69, oldHubUrl: 'taxi-mezhgorod-yaroslavl-76' },
      { slug: 'vladimir', name: 'Владимир', nameGenitive: 'из Владимира', nameLocative: 'во Владимире', regionId: 9, oldHubUrl: 'taxi-mezhgorod-vladimir-33' },
      { slug: 'ivanovo', name: 'Иваново', nameGenitive: 'из Иваново', nameLocative: 'в Иваново', regionId: 15, oldHubUrl: 'taxi-mezhgorod-ivanovo-37' },
      { slug: 'kostroma', name: 'Кострома', nameGenitive: 'из Костромы', nameLocative: 'в Костроме', regionId: 22, oldHubUrl: 'taxi-mezhgorod-kostroma-44' },
      { slug: 'smolensk', name: 'Смоленск', nameGenitive: 'из Смоленска', nameLocative: 'в Смоленске', regionId: 54, oldHubUrl: 'taxi-mezhgorod-smolensk-67' },
      { slug: 'lipetsk', name: 'Липецк', nameGenitive: 'из Липецка', nameLocative: 'в Липецке', regionId: 25, oldHubUrl: 'taxi-mezhgorod-lipeck-48' },
      { slug: 'tambov', name: 'Тамбов', nameGenitive: 'из Тамбова', nameLocative: 'в Тамбове', regionId: 57, oldHubUrl: 'taxi-mezhgorod-tambov-68' },
      { slug: 'orel', name: 'Орёл', nameGenitive: 'из Орла', nameLocative: 'в Орле', regionId: 36, oldHubUrl: 'taxi-mezhgorod-orel-57' },
      { slug: 'kursk', name: 'Курск', nameGenitive: 'из Курска', nameLocative: 'в Курске', regionId: 24, oldHubUrl: 'taxi-mezhgorod-kursk-46' },
      { slug: 'belgorod', name: 'Белгород', nameGenitive: 'из Белгорода', nameLocative: 'в Белгороде', regionId: 7, oldHubUrl: 'taxi-mezhgorod-belgorod' },
    ],
  },
  {
    slug: 'szfo',
    name: 'Северо-Западный федеральный округ',
    shortName: 'СЗФО',
    nameGenitive: 'Северо-Западного федерального округа',
    cities: [
      { slug: 'sankt-peterburg', name: 'Санкт-Петербург', nameGenitive: 'из Санкт-Петербурга', nameLocative: 'в Санкт-Петербурге', regionId: 2, oldHubUrl: 'taxi78-mezhgorod-piter' },
      { slug: 'velikiy-novgorod', name: 'Великий Новгород', nameGenitive: 'из Великого Новгорода', nameLocative: 'в Великом Новгороде', regionId: 28, oldHubUrl: 'taxi-mezhgorod-velikiy-novgorod-53' },
      { slug: 'syktyvkar', name: 'Сыктывкар', nameGenitive: 'из Сыктывкара', nameLocative: 'в Сыктывкаре', regionId: 44, oldHubUrl: 'taxi-mezhgorod-syktyvkar' },
      { slug: 'murmansk', name: 'Мурманск', nameGenitive: 'из Мурманска', nameLocative: 'в Мурманске', regionId: 26, oldHubUrl: 'taxi-mezhgorod-murmansk-51' },
      { slug: 'arhangelsk', name: 'Архангельск', nameGenitive: 'из Архангельска', nameLocative: 'в Архангельске', regionId: 4, oldHubUrl: 'taxi-mezhgorod-arhangelsk' },
      { slug: 'petrozavodsk', name: 'Петрозаводск', nameGenitive: 'из Петрозаводска', nameLocative: 'в Петрозаводске', regionId: 43, oldHubUrl: 'taxi-mezhgorod-petrozavodsk' },
    ],
  },
  {
    slug: 'yufo',
    name: 'Южный федеральный округ',
    shortName: 'ЮФО',
    nameGenitive: 'Южного федерального округа',
    cities: [
      { slug: 'krasnodar', name: 'Краснодар', nameGenitive: 'из Краснодара', nameLocative: 'в Краснодаре', regionId: 17, oldHubUrl: '' },
      { slug: 'krym', name: 'Крым', nameGenitive: 'из Крыма', nameLocative: 'в Крыму', regionId: 45, oldHubUrl: '82-mezhgorod-krym' },
      { slug: 'elista', name: 'Элиста', nameGenitive: 'из Элисты', nameLocative: 'в Элисте', regionId: 42, oldHubUrl: 'taxi-mezhgorod-elista-08' },
    ],
  },
  {
    slug: 'skfo',
    name: 'Северо-Кавказский федеральный округ',
    shortName: 'СКФО',
    nameGenitive: 'Северо-Кавказского федерального округа',
    cities: [
      { slug: 'stavropol', name: 'Ставрополь', nameGenitive: 'из Ставрополя', nameLocative: 'в Ставрополе', regionId: 56, oldHubUrl: 'taxi-mezhgorod-stavropol' },
    ],
  },
  {
    slug: 'pfo',
    name: 'Приволжский федеральный округ',
    shortName: 'ПФО',
    nameGenitive: 'Приволжского федерального округа',
    cities: [
      { slug: 'ufa', name: 'Уфа', nameGenitive: 'из Уфы', nameLocative: 'в Уфе', regionId: 40, oldHubUrl: '102-taxi-mezhgorod-ufa' },
      { slug: 'kazan', name: 'Казань', nameGenitive: 'из Казани', nameLocative: 'в Казани', regionId: 49, oldHubUrl: '16-mezhgorod-kazan' },
      { slug: 'samara', name: 'Самара', nameGenitive: 'из Самары', nameLocative: 'в Самаре', regionId: 52, oldHubUrl: 'taxi-mezhgorod-samara' },
      { slug: 'orenburg', name: 'Оренбург', nameGenitive: 'из Оренбурга', nameLocative: 'в Оренбурге', regionId: 35, oldHubUrl: 'taxi-mezhgorod-orenburg-56' },
      { slug: 'izhevsk', name: 'Ижевск', nameGenitive: 'из Ижевска', nameLocative: 'в Ижевске', regionId: 63, oldHubUrl: 'taxi-mezhgorod-izhevsk-18' },
      { slug: 'nizhniy-novgorod', name: 'Нижний Новгород', nameGenitive: 'из Нижнего Новгорода', nameLocative: 'в Нижнем Новгороде', regionId: 27, oldHubUrl: 'taxi-mezhgorod-nizhniy_novgorod' },
      { slug: 'saratov', name: 'Саратов', nameGenitive: 'из Саратова', nameLocative: 'в Саратове', regionId: 53, oldHubUrl: 'taxi-mezhgorod-saratov' },
      { slug: 'ulyanovsk', name: 'Ульяновск', nameGenitive: 'из Ульяновска', nameLocative: 'в Ульяновске', regionId: 62, oldHubUrl: 'taxi-mezhgorod-ulyanovsk-73' },
      { slug: 'kirov', name: 'Киров', nameGenitive: 'из Кирова', nameLocative: 'в Кирове', regionId: 21, oldHubUrl: 'taxi-mezhgorod-kirov-43' },
      { slug: 'cheboksary', name: 'Чебоксары', nameGenitive: 'из Чебоксар', nameLocative: 'в Чебоксарах', regionId: 67, oldHubUrl: 'taxi-mezhgorod-cheboksary-21' },
      { slug: 'yoshkar-ola', name: 'Йошкар-Ола', nameGenitive: 'из Йошкар-Олы', nameLocative: 'в Йошкар-Оле', regionId: 46, oldHubUrl: 'taxi-mezhgorod-yoshkar-ola-12' },
      { slug: 'saransk', name: 'Саранск', nameGenitive: 'из Саранска', nameLocative: 'в Саранске', regionId: 47, oldHubUrl: 'taxi-mezhgorod-saransk-13' },
      { slug: 'penza', name: 'Пенза', nameGenitive: 'из Пензы', nameLocative: 'в Пензе', regionId: 30, oldHubUrl: '' },
    ],
  },
  {
    slug: 'ufo',
    name: 'Уральский федеральный округ',
    shortName: 'УФО',
    nameGenitive: 'Уральского федерального округа',
    cities: [
      { slug: 'ekaterinburg', name: 'Екатеринбург', nameGenitive: 'из Екатеринбурга', nameLocative: 'в Екатеринбурге', regionId: 55, oldHubUrl: 'taxi-mezhgorod-ekaterinburg' },
      { slug: 'chelyabinsk', name: 'Челябинск', nameGenitive: 'из Челябинска', nameLocative: 'в Челябинске', regionId: 66, oldHubUrl: 'taxi-mezhgorod-chelyabinsk' },
      { slug: 'kurgan', name: 'Курган', nameGenitive: 'из Кургана', nameLocative: 'в Кургане', regionId: 23, oldHubUrl: 'taxi-mezhgorod-kurgan-45' },
    ],
  },
  {
    slug: 'sfo',
    name: 'Сибирский федеральный округ',
    shortName: 'СФО',
    nameGenitive: 'Сибирского федерального округа',
    cities: [
      { slug: 'novosibirsk', name: 'Новосибирск', nameGenitive: 'из Новосибирска', nameLocative: 'в Новосибирске', regionId: 29, oldHubUrl: 'taxi-mezhgorod-novosibirsk-54' },
      { slug: 'krasnoyarsk', name: 'Красноярск', nameGenitive: 'из Красноярска', nameLocative: 'в Красноярске', regionId: 18, oldHubUrl: 'taxi-mezhgorod-krasnojarsk' },
      { slug: 'tomsk', name: 'Томск', nameGenitive: 'из Томска', nameLocative: 'в Томске', regionId: 58, oldHubUrl: 'taxi-mezhgorod-tomsk-70' },
      { slug: 'barnaul', name: 'Барнаул', nameGenitive: 'из Барнаула', nameLocative: 'в Барнауле', regionId: 5, oldHubUrl: 'taxi-mezhgorod-barnaul-22' },
      { slug: 'kemerovo', name: 'Кемерово', nameGenitive: 'из Кемерова', nameLocative: 'в Кемерове', regionId: 20, oldHubUrl: 'taxi-mezhgorod-kemerovo-42' },
      { slug: 'omsk', name: 'Омск', nameGenitive: 'из Омска', nameLocative: 'в Омске', regionId: 34, oldHubUrl: 'taxi-mezhgorod-omsk-55' },
    ],
  },
  {
    slug: 'dfo',
    name: 'Дальневосточный федеральный округ',
    shortName: 'ДФО',
    nameGenitive: 'Дальневосточного федерального округа',
    cities: [
      { slug: 'habarovsk', name: 'Хабаровск', nameGenitive: 'из Хабаровска', nameLocative: 'в Хабаровске', regionId: 64, oldHubUrl: 'taxi-mezhgorod-habarovsk' },
      { slug: 'yakutsk', name: 'Якутск', nameGenitive: 'из Якутска', nameLocative: 'в Якутске', regionId: 48, oldHubUrl: 'taxi-mezhgorod-jakutsk' },
      { slug: 'irkutsk', name: 'Иркутск', nameGenitive: 'из Иркутска', nameLocative: 'в Иркутске', regionId: 16, oldHubUrl: 'taxi-mezhgorod-irkutsk' },
      { slug: 'vladivostok', name: 'Владивосток', nameGenitive: 'из Владивостока', nameLocative: 'во Владивостоке', regionId: 33, oldHubUrl: 'taxi-mezhgorod-vladivostok' },
      { slug: 'blagoveshchensk', name: 'Благовещенск', nameGenitive: 'из Благовещенска', nameLocative: 'в Благовещенске', regionId: 3, oldHubUrl: 'taxi-mezhgorod-blagoveshhensk' },
      { slug: 'chita', name: 'Чита', nameGenitive: 'из Читы', nameLocative: 'в Чите', regionId: 14, oldHubUrl: 'taxi-mezhgorod-chita' },
      { slug: 'ulan-ude', name: 'Улан-Удэ', nameGenitive: 'из Улан-Удэ', nameLocative: 'в Улан-Удэ', regionId: 41, oldHubUrl: 'taxi-mezhgorod-ulan-ude-03' },
      { slug: 'kyzyl', name: 'Кызыл', nameGenitive: 'из Кызыла', nameLocative: 'в Кызыле', regionId: 50, oldHubUrl: 'taxi-mezhgorod-kyzyl-17' },
      { slug: 'yuzhno-sahalinsk', name: 'Южно-Сахалинск', nameGenitive: 'из Южно-Сахалинска', nameLocative: 'в Южно-Сахалинске', regionId: 51, oldHubUrl: 'taxi-mezhgorod-yuzhno-sahalinsk-65' },
      { slug: 'birobidzhan', name: 'Биробиджан', nameGenitive: 'из Биробиджана', nameLocative: 'в Биробиджане', regionId: 13, oldHubUrl: 'taxi-mezhgorod-birobidzhan-79' },
    ],
  },
]

export function getAllCityParams(): { fo: string; city: string }[] {
  return FEDERAL_DISTRICTS.flatMap(fd =>
    fd.cities.map(c => ({ fo: fd.slug, city: c.slug }))
  )
}

export function getAllFoParams(): { fo: string }[] {
  return FEDERAL_DISTRICTS.map(fd => ({ fo: fd.slug }))
}

export function getFoBySlug(slug: string): FederalDistrict | undefined {
  return FEDERAL_DISTRICTS.find(fd => fd.slug === slug)
}

export function getCityInFo(foSlug: string, citySlug: string): { fo: FederalDistrict; city: RegionCity } | null {
  const fo = FEDERAL_DISTRICTS.find(fd => fd.slug === foSlug)
  if (!fo) return null
  const city = fo.cities.find(c => c.slug === citySlug)
  if (!city) return null
  return { fo, city }
}

export function getOldHubRedirectMap(): Record<string, string> {
  const map: Record<string, string> = {}
  for (const fd of FEDERAL_DISTRICTS) {
    for (const city of fd.cities) {
      if (city.oldHubUrl) {
        map[`${city.oldHubUrl}.html`] = `/regions/${fd.slug}/${city.slug}/`
      }
    }
  }
  return map
}
