import DlyaBiznesaPage from '@/pages-list/dlya-biznesa/ui/dlya-biznesa/DlyaBiznesaPage'
import { requisitsData } from '@/shared/data/requisits.data'
import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${requisitsData.BRAND_NAME} для бизнеса — корпоративные трансферы и перевозки`,
  description: 'Корпоративный трансфер сотрудников. 8 лет работы, более 9000 трансферов, 79 регионов присутствия. Оплата по счету, работа с юрлицами, ЭДО.Диадок.',
  keywords: 'корпоративный трансфер, такси для бизнеса, перевозка сотрудников, трансфер для юрлиц, междугородний трансфер для компаний',
}

export default async function Page() {
  // return <DlyaBiznesa />
  return (
    <>
      <DlyaBiznesaPage />
      <Script
        id="novofon-calltracking"
        strategy="afterInteractive"
        src="https://widget.novofon.ru/novofon.js?k=YbOrnMDxXg3gve1tb9Wt5RrWVM4dv8dI"
      />
    </>
  )
}
