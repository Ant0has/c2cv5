import type { Metadata } from 'next'
import OfertaPage from '@/pages-list/oferta'

export const metadata: Metadata = {
  title: "Публичная Оферта для Юридических Лиц — City2City",
  description: "Публичная оферта на оказание услуг трансфера для юридических лиц. Условия перевозки, права и обязанности сторон, порядок расчетов.",
};

export default async function Page() {
  return <OfertaPage />
}