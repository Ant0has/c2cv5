import NavigationLoader from '@/shared/components/NavigationLoader/NavigationLoader';
import { SITE_DESCRIPTION, SITE_NAME } from '@/shared/constants/seo.constants';
import { regionService } from '@/shared/api/region.service';
import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from "next/font/google";
import { Suspense } from "react";
import { Providers, YandexHit } from './providers';

import ModalsWrapper from "@/shared/components/modals/ModalsWrapper";
import '@/shared/styles/ant-design-styles.css';
import '@/shared/styles/global.scss';
import '@/shared/styles/common-styles.scss';
import '@/shared/styles/specific-styles.scss';

import Script from 'next/script';
import { BASE_URL } from '@/shared/constants';
import { requisitsData } from '@/shared/data/requisits.data';

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
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    type: 'website',
  },
  twitter: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    card: 'summary_large_image',
  },
  verification: {
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
  },
  keywords: `междугороднее такси, заказ такси межгород, такси по России, такси между городами, ${requisitsData.BRAND_NAME}`,
  authors: [{ name: requisitsData.BRAND_NAME, url: BASE_URL }],
  creator: requisitsData.BRAND_NAME,
  publisher: requisitsData.BRAND_NAME,
  category: 'travel',
  applicationName: requisitsData.BRAND_NAME,
  formatDetection: {
    email: false,
  },
  metadataBase: new URL(BASE_URL),
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
        <meta name="yandex-verification" content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || ''} />

        <Script defer
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
          trackHash:true,
          deferEvents: true
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
              <Suspense>
                <NavigationLoader />
              </Suspense>
              {children}
              <ModalsWrapper />
            </main>
          </div>
        </Providers>

        {/* Chat Widget */}
        <Script
          id="chat-widget"
          strategy="lazyOnload"
          src="https://chat.city2city.ru/widget.js"
          data-source="city2city.ru"
          data-brand={requisitsData.BRAND_NAME}
          data-color="var(--orange)"
          data-bg-color="#000"
          data-tooltip="Не работает WhatsApp/Telegram? Пиши СЮДА!"
        />
      </body>
    </html>
  )
}
