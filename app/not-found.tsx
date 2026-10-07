import { Footer, Header } from '@/widgets';
import NotFoundPage from '@/pages-list/not-found/NotFound';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Страница не найдена | City2City' },
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

// Covers unmatched nested URLs outside the public route group as well.
export default function NotFound() {
  return <><Header /><NotFoundPage /><Footer /></>;
}
