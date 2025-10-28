import QuestionModal from "@/shared/components/modals/QuestionModal/QuestionModal";
import NavigationLoader from '@/shared/components/NavigationLoader/NavigationLoader';
import { SITE_DESCRIPTION, SITE_NAME } from '@/shared/constants/seo.constants';
import { regionService } from '@/shared/services/region.service';
import type { Metadata } from 'next';
import { Inter as FontSans } from "next/font/google";
import { Suspense } from "react";
import { Providers, YandexMetrikaWrapper } from './providers';

import OrderModal from "@/shared/components/modals/OrderModal/OrderModal";
import '@/shared/styles/ant-design-styles.css';
import '@/shared/styles/global.scss';
import '@/shared/styles/style.scss';

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  manifest: "/manifest.json",
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ]
  },
  alternates: {
    canonical: 'https://city2city.ru/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: 'https://city2city.ru/',
    type: 'website',
  },
  twitter: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    card: 'summary_large_image',
  },
  verification: {
    yandex: '61a5dd0587349a58',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  keywords: 'междугороднее такси, заказ такси межгород, такси по России, такси между городами, City2City',
  authors: [{ name: 'City2City', url: 'https://city2city.ru/' }],
  creator: 'City2City',
  publisher: 'City2City',
  category: 'travel',
  applicationName: 'City2City',
  formatDetection: {
    email: false,
  },
  metadataBase: new URL('https://city2city.ru/'),
  appleWebApp: {
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
}

const inter = FontSans({
  weight: ['400', '500', '600', '700'],
  subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
});

async function getRegions() {
  const regions = await regionService.getAll()
  return regions
}

export const revalidate = 86400 // 24 часа

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const regions = await getRegions()

  return (
    <html lang='ru'>
       <head>
        <meta name="yandex-verification" content="61a5dd0587349a58" />
      </head>
      <body className={inter.className}>
        <Providers regions={regions}>
          <div className="app-layout">
            <main className="app-main">
              <Suspense>
                <NavigationLoader />
              </Suspense>
              {children}
              <QuestionModal />
              <OrderModal />
            </main>
          </div>
        </Providers>
        <YandexMetrikaWrapper />
      </body>
    </html>
  )
}