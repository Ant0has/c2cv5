import MedicinskijTransferPage from '@/pages-list/medicinskij-transfer/ui/medicinskij-transfer-page/MedicinskijTransferPage'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import Script from 'next/script'
import type { Metadata } from 'next'

const pageTitle = `Медицинский трансфер межгород — перевозка пациентов и медперсонала — ${requisitsData.BRAND_NAME}`
const pageDescription =
  'Междугородняя перевозка пациентов, медицинского персонала и медпредставителей. Деликатное отношение, доставка биоматериалов и медоборудования. Договор для медучреждений и страховых компаний. 79 регионов.'
const pageUrl = `${BASE_URL}/dlya-biznesa/medicinskij-transfer`

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords:
    'медицинский трансфер, перевозка пациентов межгород, такси для медперсонала, трансфер медпредставителей, перевозка в клинику, медицинская перевозка между городами, такси до больницы межгород',
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
  '@graph': [
    {
      '@type': 'Service',
      name: 'Медицинский трансфер межгород',
      description: pageDescription,
      url: pageUrl,
      provider: {
        '@type': 'Organization',
        name: requisitsData.BRAND_NAME,
        url: BASE_URL,
      },
      areaServed: {
        '@type': 'Country',
        name: 'Россия',
      },
      serviceType: 'Медицинский трансфер',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Можно ли перевозить пациентов с ограниченной подвижностью?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, наши водители помогают с посадкой и высадкой. Подбираем автомобиль с просторным салоном. Для пациентов на инвалидной коляске — предупредите при заказе, подберём подходящий транспорт.',
          },
        },
        {
          '@type': 'Question',
          name: 'Можно ли доставить биоматериалы или анализы?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, мы доставляем биоматериалы, анализы и медицинские образцы. Прямая доставка без сортировок — водитель везёт напрямую от двери до двери. Подача за 1 час.',
          },
        },
        {
          '@type': 'Question',
          name: 'Работаете ли вы с медучреждениями по договору?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, мы заключаем договоры с клиниками, больницами, фармкомпаниями и страховыми. Предоставляем полный пакет документов: договор, акт, счёт-фактура, путевой лист. Работаем по ЭДО.',
          },
        },
        {
          '@type': 'Question',
          name: 'Есть ли скидки для регулярных медицинских перевозок?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, для регулярных клиентов предлагаем индивидуальные тарифы. При объёме от 10 поездок в месяц — фиксированная цена ниже стандартной. Обсудите условия с персональным менеджером.',
          },
        },
        {
          '@type': 'Question',
          name: 'В какие медицинские центры вы доставляете?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'В любые — у нас 4 000+ маршрутов по 79 регионам. Доставляем в федеральные медцентры Москвы, Санкт-Петербурга, Новосибирска и других городов. Также возим в загородные санатории и реабилитационные центры.',
          },
        },
      ],
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MedicinskijTransferPage key="medicinskij-transfer" />
    </>
  )
}
