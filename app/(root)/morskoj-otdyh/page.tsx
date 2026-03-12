import MorskojOtdyhPage from "@/pages-list/morskoj-otdyh";
import type { Metadata } from "next";
import { BASE_URL } from "@/shared/constants";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { hubService } from "@/shared/api/hub.service";
import { notFound } from "next/navigation";

const pageUrl = `${BASE_URL}/morskoj-otdyh`;

export async function generateMetadata(): Promise<Metadata> {
    const hub = await hubService.getBySlug('morskoj-otdyh');
    const title = hub?.seoTitle || `Трансфер на море — такси к морским курортам | ${SITE_NAME}`;
    const description = hub?.seoDescription || 'Трансфер на Чёрное, Каспийское и Азовское моря. Сочи, Анапа, Геленджик, Крым, Дербент, Ейск. Фиксированные цены, комфортные автомобили. Работаем 24/7.';

    return {
        title,
        description,
        keywords: hub?.seoKeywords || 'трансфер на море, такси на морской курорт, трансфер Сочи, трансфер Анапа, трансфер Крым, такси на Чёрное море',
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title,
            description,
            url: pageUrl,
            type: 'website',
            locale: 'ru_RU',
            siteName: SITE_NAME,
        },
        twitter: {
            title,
            description,
            card: 'summary_large_image',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function Page() {
    const hub = await hubService.getBySlug('morskoj-otdyh');
    if (!hub) {
        notFound();
    }
    return <MorskojOtdyhPage hub={hub} />;
}
