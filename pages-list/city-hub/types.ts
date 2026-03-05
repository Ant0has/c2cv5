export interface CityHubData {
  slug: string
  regionSlug: string
  name: string
  nameLocative: string   // предложный: "в Москве"
  nameGenitive: string   // родительный: "из Москвы"
  regionName: string     // "Центральная Россия"
  regionShortName: string // "ЦФО"

  hero: CityHeroData
  routes: CityRouteData[]
  info: string           // HTML-строка, 200-400 слов SEO-текста
  faq: CityFaqData[]
  cooperation: CooperationData
}

export interface CityHeroData {
  badge: string
  title: { text: string; isPrimary: boolean }[]
  description: string
  bullets: string[]
  stats: { id: number; label: string; value: string }[]
}

export interface CityRouteData {
  id: number
  from: string
  to: string
  price: string
  distance: string
  duration: string
}

export interface CityFaqData {
  id: number
  question: string
  answer: string
}

export interface CooperationData {
  title: { text: string; isPrimary: boolean }[]
  description: string
  image: string
  buttonText: string
}

export interface SegmentCardData {
  title: string
  description: string
  href: string
  emoji: string
}

// --- Regional hub ---

export interface RegionHubData {
  slug: string
  name: string
  shortName: string
  nameLocative: string // "Центральной России"

  cities: RegionCityCard[]
  routes: CityRouteData[]
  info: string
  faq: CityFaqData[]
  cooperation: CooperationData
}

export interface RegionCityCard {
  slug: string
  name: string
  description: string
  routeCount: number
}
