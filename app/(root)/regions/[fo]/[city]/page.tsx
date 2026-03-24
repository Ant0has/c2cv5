import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'
import { getAllCityParams, getCityInFo } from '@/pages-list/region-hubs/config/registry'
import { regionHubService } from '@/shared/api/region-hub.service'
import { requisitsData } from '@/shared/data/requisits.data'
import { generateCityFaq } from '@/pages-list/region-hubs/config/faq'
import { BASE_URL } from '@/shared/constants'
import RegionCityHubPage from '@/pages-list/region-hubs/ui/RegionCityHubPage'

interface Props {
  params: { fo: string; city: string }
}

export async function generateStaticParams() {
  return getAllCityParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = getCityInFo(params.fo, params.city)
  if (!result) return {}

  const { city } = result
  const data = await regionHubService.getRoutesByRegionId(city.regionId)
  const totalCount = data?.totalCount || 0
  const minPrice = data?.minPrice || 0
  const priceStr = minPrice > 0 ? `от ${minPrice.toLocaleString('ru-RU')}₽` : ''

  return {
    title: `Такси межгород ${city.name} — заказать трансфер ${city.nameGenitive} | ${requisitsData.BRAND_NAME}`,
    description: `Заказать такси межгород ${city.nameGenitive}. ${totalCount} направлений${priceStr ? `, ${priceStr}` : ''}. Подача от 30 мин. Тел: ${requisitsData.PHONE_MARKED}`,
    alternates: { canonical: `${BASE_URL}/regions/${params.fo}/${params.city}/` },
  }
}

export default async function CityHubRoute({ params }: Props) {
  const result = getCityInFo(params.fo, params.city)
  if (!result) notFound()

  const { fo, city } = result
  const data = await regionHubService.getRoutesByRegionId(city.regionId)
  if (!data) notFound()

  const faq = generateCityFaq(city.name, city.nameGenitive, data.minPrice, data.totalCount)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: fo.shortName, item: `${BASE_URL}/regions/${fo.slug}/` },
      { '@type': 'ListItem', position: 3, name: `Такси межгород ${city.name}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <>
      <Script
        id="schema-breadcrumbs-hub"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-faq-hub"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <RegionCityHubPage data={{ city, fo, ...data }} />
    </>
  )
}
