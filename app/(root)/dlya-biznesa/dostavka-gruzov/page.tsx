import DostavkaGruzovPage from '@/pages-list/dostavka-gruzov/ui/dostavka-gruzov-page/DostavkaGruzovPage'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import Script from 'next/script'
import type { Metadata } from 'next'

const pageTitle = `Доставка грузов между городами в тот же день — ${requisitsData.BRAND_NAME}`
const pageDescription =
  'Срочная доставка грузов между городами от двери до двери. Забираем за 1 час, везём напрямую без сортировочных центров. Документы, запчасти, образцы — до 50 кг. Договор, акт, счёт-фактура с НДС. 79 регионов.'
const pageUrl = `${BASE_URL}/dlya-biznesa/dostavka-gruzov`

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords:
    'доставка грузов между городами, срочная доставка грузов, курьерская доставка межгород, доставка документов между городами, экспресс доставка грузов, доставка грузов в тот же день, перевозка грузов для бизнеса',
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
      name: 'Доставка грузов между городами в тот же день',
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
      serviceType: 'Доставка грузов',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Какой груз можно отправить?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Любой, что помещается в багажник/салон легкового авто: до 50 кг, габариты до 60×40×40 см. Документы, запчасти, образцы, оборудование, посылки. Нельзя: опасные, запрещённые грузы.',
          },
        },
        {
          '@type': 'Question',
          name: 'Сколько стоит доставка?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Цена зависит от расстояния и веса. Например, Москва→Тула (170 км) — от 8 000 ₽, Москва→Нижний Новгород (400 км) — от 12 000 ₽. Точную цену назовём за 5 минут после заявки.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как быстро заберут груз?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Водитель приезжает в течение 1 часа после подтверждения. В крупных городах (Москва, СПб, Ростов, Краснодар) — часто быстрее.',
          },
        },
        {
          '@type': 'Question',
          name: 'Нужен ли договор?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Для разовой доставки достаточно оферты. Для регулярного сотрудничества заключаем договор транспортной экспедиции. Работаем по ЭДО (Диадок, СБИС) и классическим документооборотом.',
          },
        },
        {
          '@type': 'Question',
          name: 'Чем вы лучше СДЭК и Деловых Линий?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Мы не используем сортировочные центры. Ваш груз едет напрямую от двери до двери на выделенном автомобиле. Поэтому доставка занимает часы, а не дни. Идеально когда нужно срочно.',
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
      <DostavkaGruzovPage key="dostavka-gruzov" />
      <Script
        id="novofon-calltracking"
        strategy="afterInteractive"
        src="https://widget.novofon.ru/novofon.js?k=YbOrnMDxXg3gve1tb9Wt5RrWVM4dv8dI"
      />
    </>
  )
}
