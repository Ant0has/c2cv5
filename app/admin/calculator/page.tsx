import type { Metadata } from 'next'
import Calculator from './Calculator'

export const metadata: Metadata = {
  title: 'Каклькулятор',
  description: '',
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

export default async function OfertaPage() {
  return <Calculator />
}