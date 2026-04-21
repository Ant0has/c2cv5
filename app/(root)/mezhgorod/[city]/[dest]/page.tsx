import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'

import { Home } from '../../../Home'
import { routeService } from '@/shared/api/route.service'
import { regionHubService } from '@/shared/api/region-hub.service'
import { BASE_URL } from '@/shared/constants'
import { requisitsData } from '@/shared/data/requisits.data'
import ServerRouteLinks from '@/shared/components/ServerRouteLinks/ServerRouteLinks'
import { getCityBySlug, buildLeafDbUrl, PILOT_CITIES } from '@/pages-list/mezhgorod-city/config/pilot'
import {
  generateSchemaOrg,
  generateProductSchema,
  generateFAQSchema,
  generateHubSchemaOrg,
  generateAggregateRatingSchema,
  extractCityFrom,
  extractCityFromSeoData,
  extractCityTo,
} from '@/shared/services/seo-utils'

interface Props {
  params: { city: string; dest: string }
}

export const revalidate = 86400

export async function generateStaticParams() {
  const params: { city: string; dest: string }[] = []
  for (const city of PILOT_CITIES) {
    const data = await regionHubService.getRoutesByRegionId(city.regionId)
    if (!data) continue
    const prefix = `${city.slug}-`
    for (const route of data.routes) {
      if (route.url.startsWith(prefix)) {
        params.push({ city: city.slug, dest: route.url.slice(prefix.length) })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}

  const dbUrl = buildLeafDbUrl(params.city, params.dest)
  const data = await routeService.getRouteByUrl(dbUrl)
  if (!data) return {}

  const canonicalUrl = `${BASE_URL}/mezhgorod/${params.city}/${params.dest}`
  const siteName = requisitsData.BRAND_NAME

  const metaCityFrom = extractCityFromSeoData(data)
  const metaCityTo = extractCityTo(data)
  const comfortPrice = data?.price_comfort || data?.price_economy
  const priceStr = comfortPrice ? comfortPrice.toLocaleString('ru-RU') : ''
  const distanceKm = data?.distance_km
  const durationHours = distanceKm ? Math.max(1, Math.round((distanceKm / 70) * 2) / 2) : 0
  const durationStr = durationHours
    ? durationHours === Math.floor(durationHours)
      ? `${durationHours}`
      : `${durationHours.toFixed(1)}`
    : ''

  const title =
    metaCityFrom && metaCityTo && distanceKm
      ? `Такси ${metaCityFrom} — ${metaCityTo}: ${distanceKm} км${priceStr ? ` от ${priceStr}₽` : ''} | Заказать трансфер онлайн`
      : data?.seo_title
        ? data.seo_title
        : `Такси ${data?.title} — междугородние перевозки | ${siteName}`

  const description =
    metaCityFrom && metaCityTo && distanceKm
      ? `Такси ${metaCityFrom} — ${metaCityTo}${priceStr ? ` от ${priceStr}₽` : ''}. ${distanceKm} км${durationStr ? `, ~${durationStr} ч` : ''}. ✅ Фиксированная цена ✅ Подача от 30 мин ✅ Без предоплаты. Заказать онлайн или ${requisitsData.PHONE_MARKED}`
      : data?.seo_description ||
        `Заказать междугороднее такси. Комфортные автомобили, опытные водители, фиксированные цены. Тел: ${requisitsData.PHONE_MARKED}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: 'ru_RU',
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-image.jpg'],
    },
  }
}

export default async function MezhgorodLeafRoute({ params }: Props) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()

  const dbUrl = buildLeafDbUrl(params.city, params.dest)
  const data = await routeService.getRouteByUrl(dbUrl)
  if (!data) notFound()

  const cityFrom = extractCityFrom(data)
  const cityTo = extractCityTo(data)
  const cityFromClean = extractCityFromSeoData(data)

  const taxiSchema = generateSchemaOrg(data)
  const productSchema = generateProductSchema(data)
  const faqSchema = generateFAQSchema(data)
  const ratingSchema = generateAggregateRatingSchema(data)
  const hubSchema = generateHubSchemaOrg(cityFromClean || cityFrom, cityTo)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Межгород', item: `${BASE_URL}/mezhgorod` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `${BASE_URL}/mezhgorod/${params.city}` },
      { '@type': 'ListItem', position: 4, name: cityTo || data.title },
    ],
  }

  const relatedRoutes = (data.routes || []).filter(r => r.url !== dbUrl).slice(0, 15)
  const routesToCity = (data.routesToCity || []).slice(0, 10)

  return (
    <>
      <Script
        id="schema-taxi-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema || taxiSchema) }}
      />
      {productSchema && (
        <Script
          id="schema-product"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="schema-aggregate-rating"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingSchema) }}
      />
      <Script
        id="schema-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Home routeData={data}>
        {relatedRoutes.length > 0 && (
          <ServerRouteLinks
            routes={relatedRoutes}
            heading={cityFrom ? `Другие маршруты из города ${cityFrom}` : 'Другие маршруты'}
          />
        )}
        {routesToCity.length > 0 && (
          <ServerRouteLinks
            routes={routesToCity}
            heading={cityTo ? `Маршруты в город ${cityTo}` : 'Маршруты в этот город'}
          />
        )}
      </Home>
    </>
  )
}
