'use client'
import {
  BusinessCityHero,
  BusinessSegmentCards,
  BusinessPopularRoutes,
  BusinessB2bCalculator,
  BusinessFaq,
  BusinessCooperation,
  BusinessBreadcrumbs,
  BusinessInfoBlock,
  BusinessCityCards,
  BusinessNearbyCities,
} from '@/entities/buziness'
import { RegionHubData } from '../types'
import { REGIONS } from '../config/registry'
import { SEGMENT_CARDS } from '../config/segments'
import s from './RegionHubPage.module.scss'

interface Props {
  data: RegionHubData
}

const RegionHubPage = ({ data }: Props) => {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Для бизнеса', href: '/dlya-biznesa' },
    { label: data.name },
  ]

  const heroData = {
    badge: `Для бизнеса · ${data.name}`,
    title: [
      { text: 'Корпоративное такси межгород — ', isPrimary: false },
      { text: data.name, isPrimary: true },
    ] as { text: string; isPrimary: boolean }[],
    description: `Межгородские перевозки для бизнеса на ${data.nameLocative}. ${data.cities.length} городов, договор и закрывающие документы.`,
    bullets: [
      `${data.cities.length} городов с корпоративным обслуживанием`,
      'Договор, акт, счёт-фактура, ЭДО через Диадок',
      'Фиксированные цены при бронировании',
      'Персональный менеджер 8:00–23:00 МСК',
    ],
    stats: [
      { id: 1, label: `${data.cities.length}`, value: 'городов' },
      { id: 2, label: '< 1 ч', value: 'подача' },
      { id: 3, label: '9 лет', value: 'на рынке' },
      { id: 4, label: '79', value: 'регионов' },
    ],
  }

  const cityCards = data.cities.map(city => ({
    ...city,
    href: `/dlya-biznesa/${data.slug}/${city.slug}`,
  }))

  const otherRegions = REGIONS
    .filter(r => r.slug !== data.slug)
    .map(r => ({
      name: r.name,
      href: `/dlya-biznesa/${r.slug}`,
    }))

  const routesTitle = [
    { text: 'Популярные маршруты — ', isPrimary: false },
    { text: data.name, isPrimary: true },
  ]

  const calculatorData = {
    title: [
      { text: 'Рассчитайте стоимость ', isPrimary: false },
      { text: 'трансфера', isPrimary: true },
    ],
    image: '/images/dlya-biznesa/businessman-lg.png',
    description: 'Укажите маршрут — получите точную цену за 30 секунд',
    buttonText: 'Рассчитать',
  }

  return (
    <div className={s.page}>
      <BusinessBreadcrumbs items={breadcrumbs} />
      <BusinessCityHero {...heroData} />
      <BusinessCityCards title={`Города — ${data.name}`} cities={cityCards} />
      <BusinessSegmentCards
        title={`Услуги для бизнеса на ${data.nameLocative}`}
        cards={SEGMENT_CARDS}
      />
      <BusinessPopularRoutes
        title={routesTitle}
        description="Фиксированные цены для юридических лиц"
        list={data.routes}
      />
      <BusinessB2bCalculator {...calculatorData} />
      <BusinessInfoBlock content={data.info} />
      <BusinessFaq list={data.faq} />
      <BusinessNearbyCities
        regionName="Другие регионы"
        regionHref="/dlya-biznesa"
        cities={otherRegions}
      />
      <BusinessCooperation {...data.cooperation} />
    </div>
  )
}

export default RegionHubPage
