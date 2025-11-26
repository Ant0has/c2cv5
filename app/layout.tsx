import NavigationLoader from '@/shared/components/NavigationLoader/NavigationLoader';
import { SITE_DESCRIPTION, SITE_NAME } from '@/shared/constants/seo.constants';
import { regionService } from '@/shared/services/region.service';
import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from "next/font/google";
import { Suspense } from "react";
import { Providers, YandexHit } from './providers';

import ModalsWrapper from "@/shared/components/modals/ModalsWrapper";
import '@/shared/styles/ant-design-styles.css';
import '@/shared/styles/global.scss';
import '@/shared/styles/style.scss';
import Script from 'next/script';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="yandex-verification" content="61a5dd0587349a58" />

        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          k=e.createElement(t),a=e.getElementsByTagName(t)[0];
          k.async=1;k.src=r;a.parentNode.insertBefore(k,a)
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(${process.env.NEXT_PUBLIC_YANDEX_ID}, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true,
          trackHash:true
        });
      `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers regions={regions}>
          <YandexHit />
          <div className="app-layout">
            <main className="app-main">
              <Suspense fallback={<div className="loading-fallback">Загрузка...</div>}>
                <NavigationLoader />
              </Suspense>
              {children}
              <ModalsWrapper />
            </main>
          </div>
        </Providers>
        {/* <YandexMetrikaWrapper /> */}
        {/* <YandexMetrika
          yid={Number(process.env.NEXT_PUBLIC_YANDEX_ID)}
          webvisor
          clickmap
          trackLinks
          accurateTrackBounce
        /> */}
      </body>
    </html>
  )
}