import SvoPage from "@/pages-list/svo";
import type { Metadata } from "next";
import { BASE_URL } from "@/shared/constants";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { hubService } from "@/shared/api/hub.service";
import { notFound } from "next/navigation";

const pageUrl = `${BASE_URL}/svo`;

export async function generateMetadata(): Promise<Metadata> {
    const hub = await hubService.getBySlug('svo');
    const title = hub?.seoTitle || 'Такси в зону СВО — трансфер на новые территории';
    const description = hub?.seoDescription || 'Заказать такси в ДНР, ЛНР, Запорожскую и Херсонскую области. 443 маршрута. Донецк, Луганск, Мариуполь, Мелитополь. Цены от 4000 ₽. Работаем 24/7.';

    return {
        title,
        description,
        keywords: hub?.seoKeywords || 'такси в ДНР, такси в ЛНР, трансфер Донецк, трансфер Луганск, такси Мариуполь, междугороднее такси СВО, перевозки на новые территории',
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
    const hub = await hubService.getBySlug('svo');
    if (!hub) {
        notFound();
    }
    return <SvoPage hub={hub} />;
}
