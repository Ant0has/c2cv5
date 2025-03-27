import QuestionModal from "@/shared/components/modals/QuestionModal/QuestionModal";
import NavigationLoader from '@/shared/components/NavigationLoader/NavigationLoader';
import { SITE_DESCRIPTION, SITE_NAME } from '@/shared/constants/seo.constants';
import { regionService } from '@/shared/services/region.service';
import type { Metadata } from 'next';
import { Inter as FontSans } from "next/font/google";
import { Suspense } from "react";
import { Providers } from './providers';

import '@/shared/styles/ant-design-styles.css';
import '@/shared/styles/global.scss';
import '@/shared/styles/style.scss';
import OrderModal from "@/shared/components/modals/OrderModal/OrderModal";

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION
}

const inter = FontSans({
  weight: ['400', '500', '600', '700'],
  subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"],
});

async function getRegions() {
  const regions = await regionService.getAll()
  return regions
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const regions = await getRegions()

  return (
    <html lang='ru'>
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
      </body>
    </html>
  )
}
