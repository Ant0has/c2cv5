import SvoPage from "@/pages-list/svo";
import type { Metadata } from "next";
import Script from "next/script";
import { BASE_URL } from "@/shared/constants";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { hubService } from "@/shared/api/hub.service";
import { requisitsData } from "@/shared/data/requisits.data";
import { TRUST_STATS } from "@/pages-list/mezhgorod-root/config/content";
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

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Такси в зону СВО', item: pageUrl },
        ],
    };

    const taxiServiceSchema = {
        '@context': 'https://schema.org',
        '@type': 'TaxiService',
        '@id': pageUrl,
        name: `${requisitsData.BRAND_NAME} — трансфер в зону СВО (ДНР, ЛНР, Запорожская и Херсонская области)`,
        url: pageUrl,
        telephone: requisitsData.PHONE_MARKED,
        areaServed: [
            { '@type': 'AdministrativeArea', name: 'Донецкая Народная Республика' },
            { '@type': 'AdministrativeArea', name: 'Луганская Народная Республика' },
            { '@type': 'AdministrativeArea', name: 'Запорожская область' },
            { '@type': 'AdministrativeArea', name: 'Херсонская область' },
        ],
        provider: {
            '@type': 'Organization',
            name: requisitsData.BRAND_NAME,
            url: BASE_URL,
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: TRUST_STATS.rating,
            reviewCount: TRUST_STATS.reviewsCount,
            bestRating: 5,
            worstRating: 1,
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'RUB',
            lowPrice: '4500',
            highPrice: '85000',
            availability: 'https://schema.org/InStock',
        },
    };

    return (
        <>
            <Script
                id="schema-breadcrumbs-svo-root"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Script
                id="schema-taxi-service-svo-root"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiServiceSchema) }}
            />
            <SvoPage hub={hub} />
        </>
    );
}
