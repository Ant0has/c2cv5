import type { Metadata } from 'next'
import { Home } from './Home'

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: 'Междугороднее такси 8-938-156-87-57 - заказ межгород 🚕 по областям России по телефону с City2City.ru',
  description: '⭐ Междугороднее такси 8-938-156-87-57 - заказ межгород 🚕 по областям России по телефону с City2City.ru. Недорогое междугороднее такси по России.',
  keywords: 'междугороднее такси, заказ такси межгород, такси по России, такси между городами, City2City',
  openGraph: {
    title: 'Междугороднее такси 8-938-156-87-57 - заказ межгород 🚕',
    description: '⭐ Заказ междугороднего такси по областям России по телефону с City2City.ru',
    type: 'website',
    url: 'https://city2city.ru',
  },
  alternates: {
    canonical: 'https://city2city.ru/',
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ]
  }
}

export const revalidate = 60

export default function Page() {
  return <Home />
}