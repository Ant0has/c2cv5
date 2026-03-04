import type { Metadata } from 'next'
import ContactsPage from '@/pages-list/contacts'
import { BASE_URL } from '@/shared/constants'

export const metadata: Metadata = {
  title: 'Контакты',
  alternates: {
    canonical: `${BASE_URL}/contacts`,
  },
}

export default function Page() {
  return <ContactsPage />
}