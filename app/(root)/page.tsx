import type { Metadata } from 'next'
import { Home } from './Home'


export const metadata: Metadata = {
  title: 'Такси',
  robots: "index, follow",
}

export const revalidate = 60

export default function Page() {
  return <Home />
}