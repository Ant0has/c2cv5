import TermsPage from "@/pages-list/terms"
import { Metadata } from "next"
import { BASE_URL } from "@/shared/constants"
import { requisitsData } from "@/shared/data/requisits.data"

export const metadata: Metadata = {
    title: `Условия использования сервиса ${requisitsData.BRAND_NAME}`,
    description: `Пользовательское соглашение сервиса межгородского такси ${requisitsData.BRAND_NAME}. Условия использования сервиса, права и обязанности сторон.`,
    keywords: `междугороднее такси, заказ такси межгород, такси по России, ${requisitsData.BRAND_NAME} условия использования`,
    alternates: {
      canonical: `${BASE_URL}/terms`,
    },
  }

export default function Page() {
  return <TermsPage /> 
}  