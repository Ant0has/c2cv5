import KorporativnoeTaksiMezhgorodPage from '@/pages-list/korporativnoe-taksi-mezhgorod/ui/korporativnoe-taksi-mezhgorod-page/KorporativnoeTaksiMezhgorodPage'
import { requisitsData } from '@/shared/data/requisits.data'
import { BASE_URL } from '@/shared/constants'
import Script from 'next/script'
import type { Metadata } from 'next'

const pageTitle = `Корпоративное такси межгород для бизнеса — ${requisitsData.BRAND_NAME}`
const pageDescription =
  'Междугородние поездки для сотрудников компании с персональным менеджером. Контроль бюджета, лимиты по отделам, автоматическая отчётность в ЭДО. Фиксированные цены, гарантия подачи. 79 регионов, 4 000+ маршрутов.'
const pageUrl = `${BASE_URL}/dlya-biznesa/korporativnoe-taksi-mezhgorod`

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords:
    'корпоративное такси межгород, бизнес такси для сотрудников, такси для командировок, корпоративные перевозки межгород, такси по договору для компании, междугороднее такси для юрлиц, корпоративный трансфер',
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
      name: 'Корпоративное такси межгород',
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
      serviceType: 'Корпоративное такси',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Как оформить корпоративное обслуживание?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Оставьте заявку — менеджер подготовит коммерческое предложение за 1 рабочий день. Для договора нужны: реквизиты компании, карточка организации и доверенность на подписанта (если не генеральный директор). Работаем с ООО, ИП и бюджетными учреждениями.',
          },
        },
        {
          '@type': 'Question',
          name: 'Можно ли установить лимиты поездок для сотрудников?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Да, мы настраиваем лимиты по сумме, количеству поездок и маршрутам — для каждого сотрудника или отдела отдельно. Ежемесячный отчёт покажет расходы в разрезе подразделений.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какие варианты оплаты доступны для юрлиц?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Безналичный расчёт по счёту (предоплата или постоплата), оплата банковской картой, наличными или по СБП при посадке. Для постоянных клиентов — постоплата по итогам месяца.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какие машины подаются на корпоративные заказы?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Комфорт: Kia K5, Toyota Corolla, Skoda Octavia. Комфорт+: Toyota Camry, Kia K5. Все автомобили не старше 5 лет, КАСКО, кондиционер, зарядные устройства. Минивэн — для групп до 7 человек.',
          },
        },
        {
          '@type': 'Question',
          name: 'Есть ли скидки при регулярных поездках?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'При объёме от 10 поездок в месяц предлагаем индивидуальный тариф. Чем больше поездок — тем выгоднее ставка. Также доступен фиксированный тариф на регулярные маршруты.',
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
      <KorporativnoeTaksiMezhgorodPage key="korporativnoe-taksi-mezhgorod" />
    </>
  )
}
