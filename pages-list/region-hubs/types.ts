export interface FederalDistrict {
  slug: string
  name: string
  shortName: string
  nameGenitive: string
  cities: RegionCity[]
}

export interface RegionCity {
  slug: string
  name: string
  nameGenitive: string
  nameLocative: string
  regionId: number
  oldHubUrl: string
  /** Скрыть из главного меню. Страница хаба и редиректы oldHubUrl продолжают работать. */
  menuHidden?: boolean
}

export interface RegionHubRoute {
  ID: number
  url: string
  title: string
  price_economy: number | null
  distance_km: number | null
}

export interface RegionHubApiResponse {
  routes: RegionHubRoute[]
  totalCount: number
  minPrice: number
}

export interface CityHubPageData {
  city: RegionCity
  fo: FederalDistrict
  routes: RegionHubRoute[]
  totalCount: number
  minPrice: number
}
