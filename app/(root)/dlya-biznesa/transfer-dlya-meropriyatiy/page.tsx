import TransferDlyaMeropriyatiyPage from '@/pages-list/transfer-dlya-meropriyatiy/ui/transfer-dlya-meropriyatiy-page/TransferDlyaMeropriyatiyPage'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import Script from 'next/script'
import type { Metadata } from 'next'

const pageTitle = `Трансфер для мероприятий и конференций — ${requisitsData.BRAND_NAME}`
const pageDescription =
  'Организация трансфера участников конференций, форумов и корпоративных мероприятий. Единый счёт, координация логистики, таблички с именами, закрывающие документы. 79 регионов России, группы до 50+ человек.'
const pageUrl = `${BASE_URL}/dlya-biznesa/transfer-dlya-meropriyatiy`

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords:
    'трансфер для мероприятий, трансфер на конференцию, MICE трансфер, перевозка делегатов, такси на форум, групповой трансфер участников, трансфер для корпоратива, трансфер на выставку',
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
      name: 'Трансфер для мероприятий и конференций',
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
      serviceType: 'Трансфер для мероприятий',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Как заказать трансфер на мероприятие для группы?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Оставьте заявку на сайте или позвоните. Расскажите о мероприятии: даты, количество участников, точки маршрутов. Менеджер подготовит план логистики и коммерческое предложение в течение 1 рабочего дня.',
          },
        },
        {
          '@type': 'Question',
          name: 'Можно ли получить один счёт на все поездки конференции?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, мы выставляем единый счёт на все трансферы в рамках мероприятия. После завершения — единый акт выполненных работ и счёт-фактура. Работаем по ЭДО (Диадок, СБИС).',
          },
        },
        {
          '@type': 'Question',
          name: 'Как организовать встречу VIP-спикеров с табличками?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Мы берём это на себя. Водитель встречает с табличкой в аэропорту или на вокзале, помогает с багажом, доставляет к месту проведения. Дресс-код и деловой этикет — обязательны.',
          },
        },
        {
          '@type': 'Question',
          name: 'За сколько дней нужно бронировать трансфер?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Рекомендуем бронировать за 5–7 дней до мероприятия для группы более 10 человек. Для небольших групп — за 1–2 дня. В экстренных случаях можем организовать подачу в течение нескольких часов.',
          },
        },
        {
          '@type': 'Question',
          name: 'Работаете ли вы с MICE-агентствами?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, мы работаем с event-агентствами, MICE-операторами и корпоративными организаторами мероприятий напрямую. Предлагаем партнёрские условия и агентское вознаграждение.',
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
      <TransferDlyaMeropriyatiyPage key="transfer-dlya-meropriyatiy" />
      <Script
        id="novofon-calltracking"
        strategy="afterInteractive"
        src="https://widget.novofon.ru/novofon.js?k=YbOrnMDxXg3gve1tb9Wt5RrWVM4dv8dI"
      />
    </>
  )
}
