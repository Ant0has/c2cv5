import AboutPage from "@/pages-list/about"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'О компании City2City — межгородское такси с гарантиями',
    description: 'Узнайте о сервисе межгородского такси City2City: 5+ лет работы, 25 000+ выполненных поездок. Гарантии фиксированной цены, чистоты и безопасности.',
    keywords: 'междугороднее такси, заказ такси межгород, такси по России, City2City о компании, гарантии такси',
    alternates: {
      canonical: 'https://city2city.ru/about',
    },
    openGraph: {
      title: 'О компании City2City — межгородское такси с гарантиями',
      description: 'Узнайте о сервисе межгородского такси City2City: 5+ лет работы, 25 000+ выполненных поездок. Гарантии фиксированной цены, чистоты и безопасности.',
      url: 'https://city2city.ru/about',
      type: 'website',
    },
    twitter: {
      title: 'О компании City2City — межгородское такси с гарантиями',
      description: 'Узнайте о сервисе межгородского такси City2City: 5+ лет работы, 25 000+ выполненных поездок. Гарантии фиксированной цены, чистоты и безопасности.',
    },
  }

export default function Page() {
  return <AboutPage />
}   