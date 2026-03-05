import GornolyghkaPage from "@/pages-list/gornolyzhka";
import type { Metadata } from "next";
import { BASE_URL } from "@/shared/constants";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { hubService } from "@/shared/api/hub.service";
import { notFound } from "next/navigation";

const pageUrl = `${BASE_URL}/gornolyzhka`;

export async function generateMetadata(): Promise<Metadata> {
    const hub = await hubService.getBySlug('gornolyzhka');
    const title = hub?.seoTitle || `Трансфер на горнолыжные курорты | ${SITE_NAME}`;
    const description = hub?.seoDescription || 'Трансфер на горнолыжные курорты России. Красная Поляна, Архыз, Домбай, Шерегеш, Абзаково и другие направления. Фиксированные цены, комфортные автомобили.';

    return {
        title,
        description,
        keywords: hub?.seoKeywords || 'трансфер на горнолыжку, такси на горнолыжный курорт, трансфер Красная Поляна, трансфер Шерегеш, трансфер Архыз',
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
    const hub = await hubService.getBySlug('gornolyzhka');
    if (!hub) {
        notFound();
    }
    return <GornolyghkaPage hub={hub} />;
}
