import { Metadata } from 'next'
import { BASE_URL } from '@/shared/constants'
import PuteshestviyaPage from './PuteshestviyaPage'

export const metadata: Metadata = {
  title: 'Куда поехать по России — маршруты и гайды | City2City',
  description: 'Лучшие направления для путешествий по России. Проверенные маршруты от команды City2City — 8 лет возим людей между городами.',
  robots: 'noindex, follow',
  alternates: { canonical: `${BASE_URL}/puteshestviya` },
  openGraph: {
    title: 'Куда поехать по России — 5 направлений без толп',
    description: 'Проверенные маршруты от команды City2City. Гайды, лайфхаки, подборки.',
    url: `${BASE_URL}/puteshestviya`,
    type: 'website',
    images: [{ url: '/images/puteshestviya/ruskeala.jpg', width: 1024, height: 576 }],
  },
}

export default function Page() {
  return <PuteshestviyaPage />
}
