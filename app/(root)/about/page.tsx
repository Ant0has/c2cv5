import AboutPage from "@/pages-list/about"
import { BASE_URL } from "@/shared/constants"
import { requisitsData } from "@/shared/data/requisits.data"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: `О компании ${requisitsData.BRAND_NAME} — межгородское такси с гарантиями`,
    description: `Узнайте о сервисе межгородского такси ${requisitsData.BRAND_NAME}: 5+ лет работы, 25 000+ выполненных поездок. Гарантии фиксированной цены, чистоты и безопасности.`,
    keywords: `междугороднее такси, заказ такси межгород, такси по России, ${requisitsData.BRAND_NAME} о компании, гарантии такси`,
    alternates: {
      canonical: `${BASE_URL}/about`,
    },
    openGraph: {
      title: `О компании ${requisitsData.BRAND_NAME} — межгородское такси с гарантиями`,
      description: `Узнайте о сервисе межгородского такси ${requisitsData.BRAND_NAME}: 5+ лет работы, 25 000+ выполненных поездок. Гарантии фиксированной цены, чистоты и безопасности.`,
      url: `${BASE_URL}/about`,
      type: 'website',
    },
    twitter: {
      title: `О компании ${requisitsData.BRAND_NAME} — межгородское такси с гарантиями`,
      description: `Узнайте о сервисе межгородского такси ${requisitsData.BRAND_NAME}: 5+ лет работы, 25 000+ выполненных поездок. Гарантии фиксированной цены, чистоты и безопасности.`,
    },
  }

export default function Page() {
  return <AboutPage />
}   