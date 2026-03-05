import PerevozkaVakhtovyhRabochihPage from '@/pages-list/perevozka-vakhtovyh-rabochih/ui/perevozka-vakhtovyh-rabochih-page/PerevozkaVakhtovyhRabochihPage'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import Script from 'next/script'
import type { Metadata } from 'next'

const pageTitle = `Перевозка вахтовых рабочих межгород — ${requisitsData.BRAND_NAME}`
const pageDescription =
  'Доставка вахтовых бригад на строительные объекты, месторождения и промплощадки по всей России. Регулярные рейсы по графику, перевозка с инструментом, фиксированные цены. Договор, акты, счёт-фактура с НДС.'
const pageUrl = `${BASE_URL}/dlya-biznesa/perevozka-vakhtovyh-rabochih`

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords:
    'перевозка вахтовых рабочих, доставка бригад на объект, вахтовый трансфер межгород, такси для строителей, перевозка рабочих на стройку, доставка вахтовых смен, трансфер на месторождение',
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
      name: 'Перевозка вахтовых рабочих межгород',
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
      serviceType: 'Перевозка вахтовых рабочих',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Можно ли организовать регулярные рейсы для бригады?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, мы фиксируем маршруты и график в договоре. Водитель закрепляется за маршрутом, знает точки подачи и высадки. Оплата по единому ежемесячному счёту.',
          },
        },
        {
          '@type': 'Question',
          name: 'Можно ли перевозить инструмент и оборудование?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, рабочие могут взять с собой инструмент и оборудование, которое помещается в багажник или салон. Для крупногабаритного оборудования подберём подходящий автомобиль.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какие документы для бухгалтерии вы предоставляете?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Полный пакет: договор на оказание транспортных услуг, акт выполненных работ, счёт-фактура с НДС, путевой лист. Работаем по ЭДО (Диадок, СБИС) или классическим документооборотом.',
          },
        },
        {
          '@type': 'Question',
          name: 'Везёте ли на удалённые объекты за пределами города?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, у нас 4 000+ маршрутов по 79 регионам России. Возим на строительные площадки, промзоны, месторождения — включая объекты за пределами городов.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как быстро можно организовать первую поездку?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Для разовой поездки — в течение нескольких часов. Для регулярного графика — заключаем договор за 1–2 дня и запускаем рейсы.',
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
      <PerevozkaVakhtovyhRabochihPage key="perevozka-vakhtovyh-rabochih" />
      <Script
        id="novofon-calltracking"
        strategy="afterInteractive"
        src="https://widget.novofon.ru/novofon.js?k=YbOrnMDxXg3gve1tb9Wt5RrWVM4dv8dI"
      />
    </>
  )
}
