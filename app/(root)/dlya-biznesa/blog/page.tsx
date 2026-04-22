import BlogListPage from '@/pages-list/blog/ui/blog-list-page/BlogListPage'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import Script from 'next/script'
import type { Metadata } from 'next'

const pageTitle = `Блог для бизнеса — статьи о корпоративных перевозках | ${requisitsData.BRAND_NAME}`
const pageDescription =
  'Полезные материалы о корпоративных перевозках: руководства по организации трансферов, чек-листы, сравнения сервисов, кейсы клиентов и обзоры цен. Блог City2City для бизнеса.'
const pageUrl = `${BASE_URL}/dlya-biznesa/blog`

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords:
    'блог корпоративные перевозки, статьи бизнес трансфер, руководство корпоративное такси, обзор цен межгород',
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
  '@type': 'Blog',
  name: 'Блог для бизнеса',
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
      <BlogListPage />
    </>
  )
}
