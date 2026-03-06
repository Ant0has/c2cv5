import CasesListPage from '@/pages-list/cases/ui/cases-list-page/CasesListPage'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import Script from 'next/script'
import type { Metadata } from 'next'

const pageTitle = `Кейсы клиентов — реальные истории корпоративных перевозок | ${requisitsData.BRAND_NAME}`
const pageDescription =
  'Кейсы клиентов City2City: как компании оптимизируют корпоративные перевозки, трансферы для мероприятий, вахтовые перевозки и медицинский трансфер. Реальные цифры экономии.'
const pageUrl = `${BASE_URL}/dlya-biznesa/cases`

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords:
    'кейсы корпоративных перевозок, истории клиентов трансфер, кейс вахтовые перевозки, кейс медицинский трансфер',
  alternates: {
    canonical: pageUrl,
  },
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
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Кейсы клиентов',
  description: pageDescription,
  url: pageUrl,
  publisher: {
    '@type': 'Organization',
    name: requisitsData.BRAND_NAME,
    url: BASE_URL,
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CasesListPage />
      <Script
        id="novofon-calltracking"
        strategy="afterInteractive"
        src="https://widget.novofon.ru/novofon.js?k=YbOrnMDxXg3gve1tb9Wt5RrWVM4dv8dI"
      />
    </>
  )
}
