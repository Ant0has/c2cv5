import type { Metadata } from 'next';
import NotFoundPage from '@/pages-list/not-found/NotFound';

export const metadata: Metadata = {
  title: { absolute: 'Страница не найдена | City2City' },
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

// Render real HTML, including without JS. Middleware and the edge error handler
// keep the HTTP status at 404; throwing here would emit an empty error shell.
export default function MissingPage() {
  return <NotFoundPage />;
}
