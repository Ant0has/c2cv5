import type { Metadata } from 'next'
import OsrmCalculator from './OsrmCalculator'

export const metadata: Metadata = {
  title: 'Калькулятор (OSRM)',
  description: 'Расчёт маршрутов через OSRM',
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
