import { Metadata } from 'next'
import Script from 'next/script'

import { FEDERAL_DISTRICTS } from '@/pages-list/region-hubs/config/registry'
import { BASE_URL } from '@/shared/constants'
import { requisitsData } from '@/shared/data/requisits.data'

import MezhgorodRootPage from '@/pages-list/mezhgorod-root/ui/MezhgorodRootPage'
import { ROOT_FAQ } from '@/pages-list/mezhgorod-root/config/content'

export const revalidate = 3600

function getStats() {
  const cityCount = FEDERAL_DISTRICTS.reduce((sum, fd) => sum + fd.cities.length, 0)
  return { cityCount, routeCount: '4000+', minPrice: '1500' }
}

export async function generateMetadata(): Promise<Metadata> {
  const { cityCount, routeCount, minPrice } = getStats()
  const title = `Такси межгород по России — заказать междугороднее такси из любого города | ${requisitsData.BRAND_NAME}`
  const description = `Заказать такси межгород из ${cityCount}+ городов России. ${routeCount} маршрутов, цены от ${minPrice}₽. Фиксированная стоимость, подача от 30 минут.`

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/mezhgorod` },
    openGraph: {
      title: 'Такси межгород по России — City2City',
      description: 'Фиксированные цены на тысячи маршрутов. Подача от 30 минут.',
      url: `${BASE_URL}/mezhgorod`,
      siteName: requisitsData.BRAND_NAME,
      locale: 'ru_RU',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/images/og/mezhgorod-root.jpg`,
          width: 1200,
          height: 630,
          alt: 'Такси межгород по России',
        },
      ],
    },
  }
}

export default function MezhgorodRootRoute() {
  const stats = getStats()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Города для заказа такси межгород',
    numberOfItems: stats.cityCount,
    itemListElement: FEDERAL_DISTRICTS.flatMap(fd =>
      fd.cities.map((city, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `Такси межгород ${city.name}`,
        url: `${BASE_URL}/regions/${fd.slug}/${city.slug}/`,
      })),
    ),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ROOT_FAQ.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Межгород', item: `${BASE_URL}/mezhgorod` },
    ],
  }

  return (
    <>
      <Script
        id="schema-itemlist-mezhgorod-root"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id="schema-faq-mezhgorod-root"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="schema-breadcrumbs-mezhgorod-root"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MezhgorodRootPage stats={stats} />
    </>
  )
}
