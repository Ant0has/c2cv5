import type { Metadata } from 'next'
import ContactsPage from '@/pages-list/contacts'
import { BASE_URL } from '@/shared/constants'

export const metadata: Metadata = {
  title: 'Контакты — City2City | Междугороднее такси',
  description: 'Свяжитесь с City2City для заказа междугородней поездки. Телефон, мессенджеры, форма обратной связи. Диспетчер: ежедневно 08:00–22:00 МСК. Поездки — в согласованное время.',
  keywords: 'контакты city2city, телефон такси межгород, заказать междугороднее такси',
  alternates: {
    canonical: `${BASE_URL}/contacts`,
  },
}

export default function Page() {
  return <ContactsPage />
}
