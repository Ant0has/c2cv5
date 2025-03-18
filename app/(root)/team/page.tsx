import type { Metadata } from 'next'
import Team from './Team'


export const metadata: Metadata = {
  title: 'Наша команда'
}

// export const revalidate = 60


export default async function TeamPage() {
  return <Team />
}