import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'

import { regionHubService } from '@/shared/api/region-hub.service'
import { BASE_URL } from '@/shared/constants'
import { requisitsData } from '@/shared/data/requisits.data'
import { getFoBySlug } from '@/pages-list/region-hubs/config/registry'

import MezhgorodCityHubPage from '@/pages-list/mezhgorod-city/ui/MezhgorodCityHubPage'
import { getPilotCityParams, getCityBySlug, PILOT_CITIES } from '@/pages-list/mezhgorod-city/config/pilot'
import { generateMezhgorodCityFaq } from '@/pages-list/mezhgorod-city/config/faq'

interface Props {
  params: { city: string }
}

export const revalidate = 3600

export async function generateStaticParams() {
  return getPilotCityParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}

  const data = await regionHubService.getRoutesByRegionId(city.regionId)
  const totalCount = data?.totalCount || 0
  const minPrice = data?.minPrice || 0
  const priceStr = minPrice > 0 ? `от ${minPrice.toLocaleString('ru-RU')}₽` : ''

  const title = `Такси межгород ${city.name} — заказать трансфер ${city.nameGenitive} | ${requisitsData.BRAND_NAME}`
  const description = `Заказать такси межгород ${city.nameGenitive}. ${totalCount} направлений${priceStr ? `, ${priceStr}` : ''}. Фиксированная цена, подача от 30 минут. Тел: ${requisitsData.PHONE_MARKED}`

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/mezhgorod/${params.city}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/mezhgorod/${params.city}`,
      siteName: requisitsData.BRAND_NAME,
      locale: 'ru_RU',
      type: 'website',
    },
  }
}

export default async function MezhgorodCityRoute({ params }: Props) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()

  const data = await regionHubService.getRoutesByRegionId(city.regionId)
  if (!data) notFound()

  const fo = getFoBySlug(city.fo)
  const pilotSet = new Set(PILOT_CITIES.map(c => c.slug))

  const neighborCities = fo
    ? fo.cities
        .filter(c => c.slug !== city.slug)
        .slice(0, 8)
        .map(c => ({
          slug: c.slug,
          name: c.name,
          fo: city.fo,
          isPilot: pilotSet.has(c.slug),
        }))
    : []

  const faq = generateMezhgorodCityFaq(
    city.slug,
    city.name,
    city.nameGenitive,
    city.nameLocative,
    data.totalCount,
    data.minPrice,
  )

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Межгород', item: `${BASE_URL}/mezhgorod` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `${BASE_URL}/mezhgorod/${city.slug}` },
    ],
  }

  const taxiServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    provider: { '@type': 'Organization', name: requisitsData.BRAND_NAME },
    areaServed: { '@type': 'City', name: city.name },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${BASE_URL}/mezhgorod/${city.slug}` },
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
        id="schema-breadcrumbs-mezhgorod-city"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-taxi-service-mezhgorod-city"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiServiceSchema) }}
      />
      <Script
        id="schema-faq-mezhgorod-city"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <MezhgorodCityHubPage
        city={city}
        data={{ routes: data.routes, totalCount: data.totalCount, minPrice: data.minPrice }}
        neighborCities={neighborCities}
      />
    </>
  )
}
