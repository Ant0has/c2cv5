import type { Metadata } from 'next'
import Calculator from './Calculator'



export const metadata: Metadata = {
  title: 'Каклькулятор'
}

export default async function OfertaPage() {
  return <Calculator />
}