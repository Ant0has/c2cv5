import CaseDetailPage from '@/pages-list/cases/ui/case-detail-page/CaseDetailPage'
import { getCaseData } from '@/pages-list/cases/data'
import { getAllCaseParams, getCaseEntryBySlug } from '@/pages-list/cases/config/registry'
import { getSegmentBySlug } from '@/pages-list/cases/config/segments'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllCaseParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getCaseEntryBySlug(params.slug)
  if (!entry) return {}

  const pageUrl = `${BASE_URL}/dlya-biznesa/cases/${params.slug}`

  return {
    title: `${entry.title} — кейс ${requisitsData.BRAND_NAME}`,
    description: entry.description,
    keywords: entry.keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${entry.title} — кейс ${requisitsData.BRAND_NAME}`,
      description: entry.description,
      url: pageUrl,
      type: 'article',
      locale: 'ru_RU',
      siteName: requisitsData.BRAND_NAME,
    },
    twitter: {
      title: `${entry.title} — кейс ${requisitsData.BRAND_NAME}`,
      description: entry.description,
      card: 'summary_large_image',
    },
    robots: { index: true, follow: true },
  }
}

export default async function CaseRoute({ params }: Props) {
  const entry = getCaseEntryBySlug(params.slug)
  if (!entry) notFound()

  const data = await getCaseData(params.slug)
  if (!data) notFound()

  const segment = getSegmentBySlug(data.segment)
  const pageUrl = `${BASE_URL}/dlya-biznesa/cases/${params.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        url: pageUrl,
        author: {
          '@type': 'Organization',
          name: requisitsData.BRAND_NAME,
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: requisitsData.BRAND_NAME,
          url: BASE_URL,
        },
        mainEntityOfPage: pageUrl,
        articleSection: segment?.title,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Для бизнеса', item: `${BASE_URL}/dlya-biznesa` },
          { '@type': 'ListItem', position: 3, name: 'Кейсы', item: `${BASE_URL}/dlya-biznesa/cases` },
          { '@type': 'ListItem', position: 4, name: data.title, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseDetailPage data={data} />
    </>
  )
}
