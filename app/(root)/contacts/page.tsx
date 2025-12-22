import type { Metadata } from 'next'
import ContactsPage from '@/pages-list/contacts'

export const metadata: Metadata = {
  title: 'Контакты'
}

export default function Page() {
  return <ContactsPage />
}