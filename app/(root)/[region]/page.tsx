import { notFound } from "next/navigation";
import { Home } from "../Home";
import { routeDataWithDirectHtmlLinks } from "@/shared/lib/html-links";
import { routeService } from "@/shared/api/route.service";
import { Metadata } from "next";
import { excludesPages } from "@/shared/data/excludes-page";
import Script from "next/script";
import { BASE_URL } from "@/shared/constants";

import {
  generateSchemaOrg,
  generateProductSchema,
  generateFAQSchema,
  generateHubSchemaOrg,
  generateAggregateRatingSchema,
  generateRouteBreadcrumbSchema,
  extractCityFrom,
  extractCityFromSeoData,
  extractCityTo,
} from "@/shared/services/seo-utils";
import { requisitsData } from "@/shared/data/requisits.data";
import ServerRouteLinks from "@/shared/components/ServerRouteLinks/ServerRouteLinks";
import { reviewedCanonicalSlug } from '@/shared/configs/regional-canonical';

interface Props {
  params: {
    region: string;
  };
}

const excludedPagesLocal = ['kemerovo-kemerovo', 'ekaterinburg-ekaterinburg'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const regionSlug = params.region.replace(/\.html$/, "");
  const data = await routeService.getRouteByUrl(regionSlug);

  const shouldAddNoIndex =
    (regionSlug.includes('bryansk') &&
      !excludesPages.find(page => page.includes(regionSlug))) ||
    data?.is_indexable !== 1 ||
    excludedPagesLocal.includes(regionSlug);

  if (!data) {
    notFound();
  }

  const siteName = requisitsData.BRAND_NAME;

  const canonicalUrl = `${BASE_URL}/${reviewedCanonicalSlug(regionSlug, data.canonical_url, data.url)}.html`;

  const metaCityFrom = extractCityFromSeoData(data);
  const metaCityTo = extractCityTo(data);
  const comfortPrice = data?.price_comfort || data?.price_economy;
  const priceStr = comfortPrice ? comfortPrice.toLocaleString('ru-RU') : '';
  const distanceKm = data?.distance_km;
  const durationHours = distanceKm ? Math.max(1, Math.round(distanceKm / 70 * 2) / 2) : 0;
  const durationStr = durationHours ? (durationHours === Math.floor(durationHours) ? `${durationHours}` : `${durationHours.toFixed(1)}`) : '';

  // Public SVO route prices follow the same published "from" policy.
  const isSvoRoute = data?.is_svo === 1;
  const svoTitle = isSvoRoute && metaCityFrom && metaCityTo
    ? `Такси ${metaCityFrom} — ${metaCityTo}${priceStr ? ` — от ${priceStr} ₽` : ''}${distanceKm ? ` | ${distanceKm} км` : ''} (зона СВО)`
    : null;
  const svoDescription = isSvoRoute && metaCityFrom && metaCityTo
    ? `Трансфер ${metaCityFrom} — ${metaCityTo} в зону СВО.${priceStr ? ` Комфорт от ${priceStr} ₽ за автомобиль.` : ''}${distanceKm ? ` Ориентировочно ${distanceKm} км${durationStr ? `, около ${durationStr} ч` : ''}.` : ''} Возможность поездки, точный маршрут и окончательную стоимость согласует диспетчер.`
    : null;

  const currentYear = new Date().getFullYear();

  const title = svoTitle ?? (
    metaCityFrom && metaCityTo && distanceKm
      ? `Такси ${metaCityFrom} — ${metaCityTo} в ${currentYear} году: ${distanceKm} км${priceStr ? ` от ${priceStr}₽` : ''} | Заказать трансфер онлайн`
      : data?.seo_title
        ? `${data.seo_title} ${currentYear}`
        : `Такси ${data?.title} ${currentYear} — междугородние перевозки | ${requisitsData.BRAND_NAME}`
  );

  const description = svoDescription ?? (
    metaCityFrom && metaCityTo && distanceKm
      ? `Такси ${metaCityFrom} — ${metaCityTo} по цене ${currentYear} года${priceStr ? ` от ${priceStr}₽` : ''}. ${distanceKm} км${durationStr ? `, ~${durationStr} ч` : ''}. Цена на странице ориентировочная; окончательную стоимость согласует диспетчер. Заказать онлайн или ${requisitsData.PHONE_MARKED}`
      : data?.seo_description || `Заказать междугороднее такси по цене ${currentYear} года. Комфортные автомобили, опытные водители, фиксированные цены. Тел: ${requisitsData.PHONE_MARKED}`
  );

  const keywords =
    data?.meta?.keywords ||
    `такси ${data?.seo_title}, междугороднее такси, заказ такси ${data?.seo_title}`;

  return {
    title,
    description,
    keywords,
    robots: shouldAddNoIndex ? "noindex, follow" : "index, follow",

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: "ru_RU",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Такси ${data?.seo_title} - ${requisitsData.BRAND_NAME}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image.jpg"],
    },
  };
}

export default async function RegionPage({ params }: Props) {
  const regionSlug = params.region.replace(/\.html$/, "");
  const data = await routeService.getRouteByUrl(regionSlug);

  if (!data) {
    notFound();
  }
  
  const cityFrom = extractCityFrom(data);
  const cityTo = extractCityTo(data);
  const cityFromClean = extractCityFromSeoData(data);

  const isHubPage = data?.url === data?.regions_data?.url;

  const taxiSchema = generateSchemaOrg(data);
  const productSchema = generateProductSchema(data);
  const faqSchema = generateFAQSchema(data);
  const ratingSchema = generateAggregateRatingSchema(data);
  const hubSchema = generateHubSchemaOrg(cityFromClean || cityFrom, cityTo);
  const breadcrumbSchema = generateRouteBreadcrumbSchema(data);

  const relatedRoutes = (data.routes || [])
    .filter((r) => r.url !== regionSlug)
    .slice(0, 15);

  const routesToCity = (data.routesToCity || []).slice(0, 10);

  return (
    <>
      <Script
        id="schema-taxi-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(isHubPage ? hubSchema : taxiSchema) }}
      />

      {productSchema && (
        <Script
          id="schema-product"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Script
        id="schema-aggregate-rating"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingSchema) }}
      />

      <Script
        id="schema-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Home routeData={routeDataWithDirectHtmlLinks(data)}>
        {relatedRoutes.length > 0 && (
          <ServerRouteLinks
            routes={relatedRoutes}
            heading={cityFrom ? `Другие маршруты из города ${cityFrom}` : 'Другие маршруты'}
          />
        )}

        {routesToCity.length > 0 && (
          <ServerRouteLinks
            routes={routesToCity}
            heading={cityTo ? `Маршруты в город ${cityTo}` : 'Маршруты в этот город'}
          />
        )}
      </Home>
    </>
  );
}
