import { FEDERAL_DISTRICTS } from '@/pages-list/region-hubs/config/registry'

export interface PilotCity {
  slug: string
  name: string
  nameGenitive: string
  nameLocative: string
  regionId: number
  fo: string
  foShortName: string
}

// PILOT_CITIES построен из registry — единый источник правды по всем 69 городам.
// Раньше здесь был жёсткий список 9 пилотов; теперь все региональные хабы
// живут на /mezhgorod/{city}/.
export const PILOT_CITIES: PilotCity[] = FEDERAL_DISTRICTS.flatMap(fd =>
  fd.cities.map(c => ({
    slug: c.slug,
    name: c.name,
    nameGenitive: c.nameGenitive,
    nameLocative: c.nameLocative,
    regionId: c.regionId,
    fo: fd.slug,
    foShortName: fd.shortName,
  })),
)

export const getPilotCityParams = () => PILOT_CITIES.map(c => ({ city: c.slug }))

export const getCityBySlug = (slug: string) => PILOT_CITIES.find(c => c.slug === slug)

export const isPilotCity = (slug: string) => PILOT_CITIES.some(c => c.slug === slug)

// Для некоторых городов URL-slug отличается от slug в таблице routes БД.
// Маппинг URL → DB. Пополнять по мере обнаружения mismatch'ей.
export const URL_TO_DB_SLUG: Record<string, string> = {
  arhangelsk: 'arxangelsk',
  'ulan-ude': 'ulan-udje',
  // Будущие пакеты (предварительно — проверять при включении города):
  // lipetsk: 'lipeck',
  // 'nizhniy-novgorod': 'nizhnij-novgorod',
  // 'velikiy-novgorod': 'velikij-novgorod',
  // 'rostov-na-donu': 'rostov',
  // krasnoyarsk: 'krasnojarsk',
  // astrahan: 'astraxan',
  // yakutsk: 'jakutsk',
}

export const cityToDbSlug = (citySlug: string) => URL_TO_DB_SLUG[citySlug] ?? citySlug

// routes в БД хранятся как `{fromDbSlug}-{toSlug}`.
export const buildLeafDbUrl = (citySlug: string, destSlug: string) =>
  `${cityToDbSlug(citySlug)}-${destSlug}`
