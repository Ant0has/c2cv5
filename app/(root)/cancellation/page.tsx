import CancellationPage from "@/pages-list/cancellation";
import { BASE_URL } from '@/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: `${BASE_URL}/cancellation`,
  },
};

export default function Page() {
    return <CancellationPage />;
}