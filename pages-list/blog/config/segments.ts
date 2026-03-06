import type { SegmentConfig } from '../types'

export const BLOG_SEGMENTS: SegmentConfig[] = [
  {
    slug: 'korporativnoe-taksi',
    title: 'Корпоративное такси',
    shortTitle: 'Корп. такси',
    pillarHref: '/dlya-biznesa/korporativnoe-taksi-mezhgorod',
  },
  {
    slug: 'transfer-meropriyatiy',
    title: 'Трансфер для мероприятий',
    shortTitle: 'Мероприятия',
    pillarHref: '/dlya-biznesa/transfer-dlya-meropriyatiy',
  },
  {
    slug: 'vakhtovye-perevozki',
    title: 'Перевозка вахтовых рабочих',
    shortTitle: 'Вахта',
    pillarHref: '/dlya-biznesa/perevozka-vakhtovyh-rabochih',
  },
  {
    slug: 'medicinskij-transfer',
    title: 'Медицинский трансфер',
    shortTitle: 'Мед. трансфер',
    pillarHref: '/dlya-biznesa/medicinskij-transfer',
  },
  {
    slug: 'dostavka-gruzov',
    title: 'Доставка грузов',
    shortTitle: 'Грузы',
    pillarHref: '/dlya-biznesa/dostavka-gruzov',
  },
]

export function getSegmentBySlug(slug: string): SegmentConfig | undefined {
  return BLOG_SEGMENTS.find(s => s.slug === slug)
}
