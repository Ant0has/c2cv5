import { SITE_DESCRIPTION, SITE_NAME } from "@/shared/constants/seo.constants";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Providers } from "./providers";

import "@/shared/styles/ant-design-styles.css";
import "@/shared/styles/global.scss";
import "@/shared/styles/style.scss";

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

const inter = FontSans({
  weight: ["400", "500", "600"],
  subsets: ["latin", "cyrillic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
