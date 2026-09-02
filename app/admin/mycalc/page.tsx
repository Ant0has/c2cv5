import type { Metadata } from 'next'
import OsrmCalculator from './OsrmCalculator'

export const metadata: Metadata = {
  title: 'Служебный калькулятор маршрутов',
  description: 'Расчёт маршрутов по координатам DaData через Яндекс Карты',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default async function MyCalcPage() {
  return <OsrmCalculator />
}
