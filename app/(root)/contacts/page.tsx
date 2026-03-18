import type { Metadata } from 'next'
import ContactsPage from '@/pages-list/contacts'
import { BASE_URL } from '@/shared/constants'

export const metadata: Metadata = {
  title: 'Контакты — City2City | Междугороднее такси',
  description: 'Свяжитесь с City2City для заказа междугороднего такси. Телефон, мессенджеры, форма обратной связи. Работаем ежедневно с 08:00 до 23:00.',
  keywords: 'контакты city2city, телефон такси межгород, заказать междугороднее такси',
  alternates: {
    canonical: `${BASE_URL}/contacts`,
  },
}

export default function Page() {
  return <ContactsPage />
}