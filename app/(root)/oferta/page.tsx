import type { Metadata } from 'next'
import OfertaPage from '@/pages-list/oferta'
import { requisitsData } from '@/shared/data/requisits.data'

export const metadata: Metadata = {
  title: `Публичная Оферта для Юридических Лиц — ${requisitsData.BRAND_NAME}`,
  description: "Публичная оферта на оказание услуг трансфера для юридических лиц. Условия перевозки, права и обязанности сторон, порядок расчетов.",
};

export default async function Page() {
  return <OfertaPage />
}