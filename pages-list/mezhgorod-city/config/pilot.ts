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

// routes в БД хранятся как `{fromSlug}-{toSlug}`. URL-slug совпадает с DB-slug
// для всех 69 городов (для Орла registry.slug = 'oryol' = БД-slug).
export const buildLeafDbUrl = (citySlug: string, destSlug: string) => `${citySlug}-${destSlug}`
