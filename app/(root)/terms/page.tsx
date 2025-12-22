import TermsPage from "@/pages-list/terms"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Условия использования сервиса City2City',
    description: 'description: "Пользовательское соглашение сервиса межгородского такси City2City. Условия использования сервиса, права и обязанности сторон."',
    keywords: 'междугороднее такси, заказ такси межгород, такси по России, City2City условия использования',
    alternates: {
      canonical: 'https://city2city.ru/terms',
    },
  }

export default function Page() {
  return <TermsPage /> 
}  