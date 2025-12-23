import type { Metadata } from 'next'
import PrivacyPolicy from '../../../pages-list/privacy-policy/PrivacyPolicy'
import { requisitsData } from '@/shared/data/requisits.data'

export const metadata: Metadata = {
  title: `Политика конфиденциальности — ${requisitsData.BRAND_NAME}`,
  description: `Политика конфиденциальности сервиса межгородского такси ${requisitsData.BRAND_NAME}. Порядок сбора, использования, хранения и защиты персональных данных пользователей.`,
};

export default async function Page() {
  return <PrivacyPolicy />
}