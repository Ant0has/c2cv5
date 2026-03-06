import BlogArticlePage from '@/pages-list/blog/ui/blog-article-page/BlogArticlePage'
import { getArticleData } from '@/pages-list/blog/data'
import { getAllArticleParams, getArticleEntryBySlug } from '@/pages-list/blog/config/registry'
import { getSegmentBySlug } from '@/pages-list/blog/config/segments'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllArticleParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getArticleEntryBySlug(params.slug)
  if (!entry) return {}

  const pageUrl = `${BASE_URL}/dlya-biznesa/blog/${params.slug}`

  return {
    title: `${entry.title} — ${requisitsData.BRAND_NAME}`,
    description: entry.description,
    keywords: entry.keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${entry.title} — ${requisitsData.BRAND_NAME}`,
      description: entry.description,
      url: pageUrl,
      type: 'article',
      locale: 'ru_RU',
      siteName: requisitsData.BRAND_NAME,
    },
    twitter: {
      title: `${entry.title} — ${requisitsData.BRAND_NAME}`,
      description: entry.description,
      card: 'summary_large_image',
    },
    robots: { index: true, follow: true },
  }
}

export default async function ArticleRoute({ params }: Props) {
  const entry = getArticleEntryBySlug(params.slug)
  if (!entry) notFound()

  const data = await getArticleData(params.slug)
  if (!data) notFound()

  const segment = getSegmentBySlug(data.segment)
  const pageUrl = `${BASE_URL}/dlya-biznesa/blog/${params.slug}`

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
          { '@type': 'ListItem', position: 3, name: 'Блог', item: `${BASE_URL}/dlya-biznesa/blog` },
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
      <BlogArticlePage data={data} />
      <Script
        id="novofon-calltracking"
        strategy="afterInteractive"
        src="https://widget.novofon.ru/novofon.js?k=YbOrnMDxXg3gve1tb9Wt5RrWVM4dv8dI"
      />
    </>
  )
}
