import DostavkaGruzovPage from "@/pages-list/dostavka-gruzov/ui/dostavka-gruzov-page/DostavkaGruzovPage"
import { requisitsData } from "@/shared/data/requisits.data"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `${requisitsData.BRAND_NAME} — доставка грузов`,
  description: 'Доставка грузов по России и СНГ. 8 лет работы, более 9000 трансферов, 79 регионов присутствия. Оплата по счету, работа с юрлицами, ЭДО.Диадок.',
  keywords: 'доставка грузов, перевозка грузов, доставка грузов по России, доставка грузов по СНГ',
}

export default function Page() {
  return <DostavkaGruzovPage key="dostavka-gruzov" />
}