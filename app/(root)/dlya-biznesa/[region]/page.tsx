import RegionHubPage from '@/pages-list/city-hub/ui/RegionHubPage'
import { getRegionData } from '@/pages-list/city-hub/data'
import { getAllRegionParams, getRegionBySlug } from '@/pages-list/city-hub/config/registry'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { Metadata } from 'next'

interface Props {
  params: { region: string }
}

export async function generateStaticParams() {
  return getAllRegionParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const regionEntry = getRegionBySlug(params.region)
  if (!regionEntry) return {}

  const pageUrl = `${BASE_URL}/dlya-biznesa/${params.region}`
  const pageTitle = `Корпоративное такси ${regionEntry.name} — межгород для бизнеса | ${requisitsData.BRAND_NAME}`
  const cityNames = regionEntry.cities.map(c => c.name).join(', ')
  const pageDescription = `Межгородские перевозки для бизнеса на ${regionEntry.nameLocative}. ${cityNames}. Договор, закрывающие документы, фиксированные цены.`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: `корпоративное такси ${regionEntry.name}, бизнес трансфер ${regionEntry.name}, междугороднее такси ${regionEntry.shortName}`,
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

export default async function RegionHubRoute({ params }: Props) {
  const regionEntry = getRegionBySlug(params.region)
  if (!regionEntry) notFound()

  const data = await getRegionData(params.region)
  if (!data) notFound()

  const pageUrl = `${BASE_URL}/dlya-biznesa/${params.region}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Корпоративное такси ${data.name}`,
        description: `Межгородские перевозки для бизнеса на ${data.nameLocative}.`,
        url: pageUrl,
        provider: {
          '@type': 'Organization',
          name: requisitsData.BRAND_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'Place',
          name: data.name,
        },
        serviceType: 'Корпоративный трансфер',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Для бизнеса', item: `${BASE_URL}/dlya-biznesa` },
          { '@type': 'ListItem', position: 3, name: data.name, item: pageUrl },
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
      <RegionHubPage data={data} />
      <Script
        id="novofon-calltracking"
        strategy="afterInteractive"
        src="https://widget.novofon.ru/novofon.js?k=YbOrnMDxXg3gve1tb9Wt5RrWVM4dv8dI"
      />
    </>
  )
}
