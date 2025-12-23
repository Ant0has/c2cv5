import type { Metadata } from 'next'
import DlyaBiznesa from './DlyaBiznesa'
import { requisitsData } from '@/shared/data/requisits.data'

export const metadata: Metadata = {
  title: `${requisitsData.BRAND_NAME} для бизнеса — корпоративные трансферы и перевозки`,
  description: 'Корпоративный трансфер сотрудников. 8 лет работы, более 9000 трансферов, 79 регионов присутствия. Оплата по счету, работа с юрлицами, ЭДО.Диадок.',
  keywords: 'корпоративный трансфер, такси для бизнеса, перевозка сотрудников, трансфер для юрлиц, междугородний трансфер для компаний',
}

export default async function DlyaBiznesaPage() {
  return <DlyaBiznesa />
}
