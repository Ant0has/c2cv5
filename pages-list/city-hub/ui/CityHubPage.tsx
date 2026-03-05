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
  BusinessNearbyCities,
} from '@/entities/buziness'
import { CityHubData } from '../types'
import { REGIONS } from '../config/registry'
import { SEGMENT_CARDS } from '../config/segments'
import s from './CityHubPage.module.scss'

interface Props {
  data: CityHubData
}

const CityHubPage = ({ data }: Props) => {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Для бизнеса', href: '/dlya-biznesa' },
    { label: data.regionName, href: `/dlya-biznesa/${data.regionSlug}` },
    { label: data.name },
  ]

  const region = REGIONS.find(r => r.slug === data.regionSlug)
  const nearbyCities = region?.cities
    .filter(c => c.slug !== data.slug)
    .map(c => ({
      name: c.name,
      href: `/dlya-biznesa/${data.regionSlug}/${c.slug}`,
    })) || []

  const routesTitle = [
    { text: 'Популярные корпоративные ', isPrimary: false },
    { text: `маршруты ${data.nameGenitive}`, isPrimary: true },
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
      <BusinessCityHero {...data.hero} />
      <BusinessSegmentCards
        title={`Услуги для бизнеса ${data.nameLocative}`}
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
      {nearbyCities.length > 0 && (
        <BusinessNearbyCities
          regionName={data.regionName}
          regionHref={`/dlya-biznesa/${data.regionSlug}`}
          cities={nearbyCities}
        />
      )}
      <BusinessCooperation {...data.cooperation} />
    </div>
  )
}

export default CityHubPage
