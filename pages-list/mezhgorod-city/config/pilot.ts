export interface PilotCity {
  slug: string
  name: string
  nameGenitive: string
  nameLocative: string
  regionId: number
  fo: string
  foShortName: string
}

export const PILOT_CITIES: PilotCity[] = [
  { slug: 'vologda',   name: 'Вологда',   nameGenitive: 'из Вологды',    nameLocative: 'в Вологде',    regionId: 11, fo: 'szfo', foShortName: 'СЗФО' },
  { slug: 'yaroslavl', name: 'Ярославль', nameGenitive: 'из Ярославля',  nameLocative: 'в Ярославле',  regionId: 69, fo: 'cfo',  foShortName: 'ЦФО' },
  { slug: 'vladimir',  name: 'Владимир',  nameGenitive: 'из Владимира',  nameLocative: 'во Владимире', regionId: 9,  fo: 'cfo',  foShortName: 'ЦФО' },
  { slug: 'kaluga',    name: 'Калуга',    nameGenitive: 'из Калуги',     nameLocative: 'в Калуге',     regionId: 19, fo: 'cfo',  foShortName: 'ЦФО' },
  { slug: 'oryol',     name: 'Орёл',      nameGenitive: 'из Орла',       nameLocative: 'в Орле',       regionId: 36, fo: 'cfo',  foShortName: 'ЦФО' },
  { slug: 'kursk',     name: 'Курск',     nameGenitive: 'из Курска',     nameLocative: 'в Курске',     regionId: 24, fo: 'cfo',  foShortName: 'ЦФО' },
  { slug: 'tver',      name: 'Тверь',     nameGenitive: 'из Твери',      nameLocative: 'в Твери',      regionId: 59, fo: 'cfo',  foShortName: 'ЦФО' },
  { slug: 'belgorod',  name: 'Белгород',  nameGenitive: 'из Белгорода',  nameLocative: 'в Белгороде',  regionId: 7,  fo: 'cfo',  foShortName: 'ЦФО' },
  { slug: 'voronezh',  name: 'Воронеж',   nameGenitive: 'из Воронежа',   nameLocative: 'в Воронеже',   regionId: 12, fo: 'cfo',  foShortName: 'ЦФО' },
]

export const getPilotCityParams = () => PILOT_CITIES.map(c => ({ city: c.slug }))

export const getCityBySlug = (slug: string) => PILOT_CITIES.find(c => c.slug === slug)

export const isPilotCity = (slug: string) => PILOT_CITIES.some(c => c.slug === slug)

// routes в БД хранятся как `{fromSlug}-{toSlug}`. Для Орла БД использует slug `oryol`,
// для остальных 8 городов — slug совпадает с city.slug пилота.
export const buildLeafDbUrl = (citySlug: string, destSlug: string) => `${citySlug}-${destSlug}`
