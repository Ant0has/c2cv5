import type { Metadata } from 'next'
import PrivacyPolicy from '../../../pages-list/privacy-policy/PrivacyPolicy'



export const metadata: Metadata = {
  title: 'Оферта для юр.лиц'
}

// export const revalidate = 60


export default async function Page() {
  return <PrivacyPolicy />
}