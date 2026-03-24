import { Metadata } from 'next'
import RegionsCatalogPage from '@/pages-list/region-hubs/ui/RegionsCatalogPage'
import { requisitsData } from '@/shared/data/requisits.data'

export const metadata: Metadata = {
  title: `Междугороднее такси по регионам России | ${requisitsData.BRAND_NAME}`,
  description: 'Заказать междугороднее такси в любом городе России. 58 городов, 8 федеральных округов. Фиксированные цены, подача от 30 минут.',
  alternates: { canonical: 'https://city2city.ru/regions/' },
}

export default function RegionsCatalogRoute() {
  return <RegionsCatalogPage />
}
