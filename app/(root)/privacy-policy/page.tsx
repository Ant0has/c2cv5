import type { Metadata } from 'next'
import PrivacyPolicy from '../../../pages-list/privacy-policy/PrivacyPolicy'

export const metadata: Metadata = {
  title: "Политика конфиденциальности — City2City",
  description: "Политика конфиденциальности сервиса межгородского такси City2City. Порядок сбора, использования, хранения и защиты персональных данных пользователей.",
};

export default async function Page() {
  return <PrivacyPolicy />
}