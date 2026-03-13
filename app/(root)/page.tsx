export const revalidate = 86400
import type { Metadata } from 'next'
import { Home } from './Home'
import { generateOrganizationSchemaOrg } from '@/shared/services/seo-utils'
import Script from 'next/script'
import { BASE_URL } from '@/shared/constants';
import { requisitsData } from '@/shared/data/requisits.data';

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: `Междугороднее такси ${requisitsData.PHONE_MARKED} - заказ межгород 🚕 по областям России по телефону с ${requisitsData.BRAND_NAME}.ru`,
  description: `⭐ Междугороднее такси ${requisitsData.PHONE_MARKED} - заказ межгород 🚕 по областям России по телефону с ${requisitsData.BRAND_NAME}.ru. Недорогое междугороднее такси по России.`,
  keywords: `междугороднее такси, заказ такси межгород, такси по России, такси между городами, ${requisitsData.BRAND_NAME}`,
  openGraph: {
    title: `Междугороднее такси ${requisitsData.PHONE_MARKED} - заказ межгород 🚕 по областям России по телефону с ${requisitsData.BRAND_NAME}.ru`,
    description: `⭐ Заказ междугороднего такси по областям России по телефону с ${requisitsData.BRAND_NAME}.ru`,
    type: 'website',
    url: BASE_URL,
  },
  alternates: {
    canonical: BASE_URL,
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



export default function Page() {
  return (
    <>
    {/* Main Page Schema.org */}
    <Script
        id="schema-main-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchemaOrg()) }}
      />
    <Home />
    </>
  )
}