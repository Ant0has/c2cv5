import CancellationPage from "@/pages-list/cancellation";
import { BASE_URL } from '@/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Отмена заказа — City2City | Междугороднее такси',
  description: 'Условия отмены заказа междугороднего такси City2City. Бесплатная отмена, сроки и порядок возврата средств.',
  keywords: 'отмена заказа такси, возврат денег, отмена поездки',
  alternates: {
    canonical: `${BASE_URL}/cancellation`,
  },
};

export default function Page() {
    return <CancellationPage />;
}