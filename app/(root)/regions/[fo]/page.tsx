import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getAllFoParams, getFoBySlug } from '@/pages-list/region-hubs/config/registry'
import { regionHubService } from '@/shared/api/region-hub.service'
import { requisitsData } from '@/shared/data/requisits.data'
import FoHubPage from '@/pages-list/region-hubs/ui/FoHubPage'

interface Props {
  params: { fo: string }
}

export async function generateStaticParams() {
  return getAllFoParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fo = getFoBySlug(params.fo)
  if (!fo) return {}

  return {
    title: `Такси межгород — ${fo.name} | ${requisitsData.BRAND_NAME}`,
    description: `Междугороднее такси в городах ${fo.nameGenitive}. ${fo.cities.length} городов, фиксированные цены, подача от 30 минут.`,
    alternates: { canonical: `https://city2city.ru/regions/${fo.slug}/` },
  }
}

export default async function FoRoute({ params }: Props) {
  const fo = getFoBySlug(params.fo)
  if (!fo) notFound()

  const citiesInfo = await Promise.all(
    fo.cities.map(async (city) => {
      const data = await regionHubService.getRoutesByRegionId(city.regionId)
      return {
        slug: city.slug,
        name: city.name,
        routeCount: data?.totalCount || 0,
        minPrice: data?.minPrice || 0,
      }
    })
  )

  return <FoHubPage fo={fo} citiesInfo={citiesInfo} />
}
