import type { CityHubData, RegionHubData } from '../types'

const cityModules: Record<string, () => Promise<{ data: CityHubData }>> = {
  'moskva': () => import('./cities/moskva'),
  'sankt-peterburg': () => import('./cities/sankt-peterburg'),
  'kazan': () => import('./cities/kazan'),
  'ekaterinburg': () => import('./cities/ekaterinburg'),
  'novosibirsk': () => import('./cities/novosibirsk'),
  'nizhnij-novgorod': () => import('./cities/nizhnij-novgorod'),
  'krasnodar': () => import('./cities/krasnodar'),
  'rostov-na-donu': () => import('./cities/rostov-na-donu'),
  'samara': () => import('./cities/samara'),
  'voronezh': () => import('./cities/voronezh'),
  'chelyabinsk': () => import('./cities/chelyabinsk'),
  'ufa': () => import('./cities/ufa'),
  'perm': () => import('./cities/perm'),
  'volgograd': () => import('./cities/volgograd'),
  'krasnoyarsk': () => import('./cities/krasnoyarsk'),
  'sochi': () => import('./cities/sochi'),
  'tyumen': () => import('./cities/tyumen'),
  'omsk': () => import('./cities/omsk'),
  'saratov': () => import('./cities/saratov'),
  'tolyatti': () => import('./cities/tolyatti'),
  'kaliningrad': () => import('./cities/kaliningrad'),
  'irkutsk': () => import('./cities/irkutsk'),
  'vladivostok': () => import('./cities/vladivostok'),
  'yaroslavl': () => import('./cities/yaroslavl'),
  'tula': () => import('./cities/tula'),
  'stavropol': () => import('./cities/stavropol'),
  'surgut': () => import('./cities/surgut'),
  'mineralnye-vody': () => import('./cities/mineralnye-vody'),
  'mahachkala': () => import('./cities/mahachkala'),
  'kemerovo': () => import('./cities/kemerovo'),
}

const regionModules: Record<string, () => Promise<{ data: RegionHubData }>> = {
  'centralnaya-rossiya': () => import('./regions/centralnaya-rossiya'),
  'severo-zapad': () => import('./regions/severo-zapad'),
  'yug-rossii': () => import('./regions/yug-rossii'),
  'severnyj-kavkaz': () => import('./regions/severnyj-kavkaz'),
  'povolzhye': () => import('./regions/povolzhye'),
  'ural': () => import('./regions/ural'),
  'sibir': () => import('./regions/sibir'),
  'dalnij-vostok': () => import('./regions/dalnij-vostok'),
}

export async function getCityData(citySlug: string): Promise<CityHubData | null> {
  const loader = cityModules[citySlug]
  if (!loader) return null
  try {
    const module = await loader()
    return module.data
  } catch {
    return null
  }
}

export async function getRegionData(regionSlug: string): Promise<RegionHubData | null> {
  const loader = regionModules[regionSlug]
  if (!loader) return null
  try {
    const module = await loader()
    return module.data
  } catch {
    return null
  }
}
