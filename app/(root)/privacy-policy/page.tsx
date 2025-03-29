import type { Metadata } from 'next'
import PrivacyPolicy from './PrivacyPolicy'



export const metadata: Metadata = {
  title: 'Оферта для юр.лиц'
}

// export const revalidate = 60


export default async function OfertaPage() {
  return <PrivacyPolicy />
}