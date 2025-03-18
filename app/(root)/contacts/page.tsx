import type { Metadata } from 'next'
import Contacts from './Contacts'

export const metadata: Metadata = {
  title: 'Контакты'
}

// export const revalidate = 60


export default async function ContactsPage() {
  return <Contacts />
}