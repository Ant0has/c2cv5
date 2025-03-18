import { SITE_DESCRIPTION, SITE_NAME } from "@/shared/constants/seo.constants";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Providers } from "./providers";
import { regionService } from "@/shared/services/region.service";
import NavigationLoader from "@/shared/components/NavigationLoader/NavigationLoader";

import "@/shared/styles/ant-design-styles.css";
import "@/shared/styles/global.scss";
import "@/shared/styles/style.scss";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

const inter = FontSans({
  weight: ["400", "500", "600", "700"],
  subsets: ["cyrillic", "latin"],
});

async function getRegions() {
  const regions = await regionService.getAll();
  return regions;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const regions = await getRegions();

  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers regions={regions}>
          <Suspense>
            <NavigationLoader />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  );
}
