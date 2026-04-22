import CityHubPage from '@/pages-list/city-hub/ui/CityHubPage'
import { getCityData } from '@/pages-list/city-hub/data'
import { getAllCityParams, getCityWithRegion } from '@/pages-list/city-hub/config/registry'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { Metadata } from 'next'

interface Props {
  params: { region: string; city: string }
}

export async function generateStaticParams() {
  return getAllCityParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCityData(params.city)
  if (!data) return {}

  const pageUrl = `${BASE_URL}/dlya-biznesa/${params.region}/${params.city}`
  const pageTitle = `Корпоративное такси межгород ${data.nameLocative} — ${requisitsData.BRAND_NAME}`
  const pageDescription = `Межгородские перевозки для бизнеса ${data.nameLocative}. Договор для юрлиц, закрывающие документы, ЭДО. Фиксированные цены, персональный менеджер. ${requisitsData.BRAND_NAME}`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: `корпоративное такси ${data.name}, бизнес трансфер ${data.name}, междугороднее такси ${data.name} для юрлиц, корпоративные перевозки ${data.name}`,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      type: 'website',
      locale: 'ru_RU',
      siteName: requisitsData.BRAND_NAME,
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
      card: 'summary_large_image',
    },
    robots: { index: true, follow: true },
  }
}

export default async function CityHubRoute({ params }: Props) {
  const { region, city } = getCityWithRegion(params.region, params.city)
  if (!region || !city) notFound()

  const data = await getCityData(params.city)
  if (!data) notFound()

  const pageUrl = `${BASE_URL}/dlya-biznesa/${params.region}/${params.city}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Корпоративное такси межгород ${data.nameLocative}`,
        description: `Межгородские перевозки для бизнеса ${data.nameLocative}. Договор, закрывающие документы, фиксированные цены.`,
        url: pageUrl,
        provider: {
          '@type': 'Organization',
          name: requisitsData.BRAND_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'City',
          name: data.name,
        },
        serviceType: 'Корпоративный трансфер',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Для бизнеса', item: `${BASE_URL}/dlya-biznesa` },
          { '@type': 'ListItem', position: 3, name: data.regionName, item: `${BASE_URL}/dlya-biznesa/${params.region}` },
          { '@type': 'ListItem', position: 4, name: data.name, item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faq.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CityHubPage data={data} />
    </>
  )
}
