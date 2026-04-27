import SvoPage from "@/pages-list/svo";
import type { Metadata } from "next";
import { BASE_URL } from "@/shared/constants";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { hubService } from "@/shared/api/hub.service";
import { notFound } from "next/navigation";

const pageUrl = `${BASE_URL}/svo`;

export async function generateMetadata(): Promise<Metadata> {
    const hub = await hubService.getBySlug('svo');
    const title = 'Такси в зону СВО 2026 — трансфер на новые территории, ДНР, ЛНР';
    const description = 'Актуально на 2026 год: трансферы в ДНР, ЛНР, Запорожскую и Херсонскую области. Водители с опытом по региону 8 лет (с до-СВО), 500+ поездок, диспетчер 24/7, документы для въезда — на странице.';

    return {
        title,
        description,
        keywords: 'такси в ДНР 2026, такси в ЛНР 2026, трансфер Донецк, трансфер Луганск, такси Мариуполь, междугороднее такси СВО, перевозки на новые территории, такси через КПП Куйбышево, такси через КПП Изварино',
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
