import { notFound } from "next/navigation";
import { Home } from "../Home";
import { routeService } from "@/shared/services/route.service";
import { Metadata } from "next";
import { excludesPages } from "@/shared/data/excludes-page";
import Script from "next/script";

// Импорт функций из твоего utils файла
import {
  generateSchemaOrg,
  generateFAQSchema,
} from "@/shared/services/seo-utils";

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

  const siteName = "City2City";

  const canonicalUrl = data?.canonical_url
    ? `https://city2city.ru/${data?.canonical_url}.html`
    : `https://city2city.ru/${data?.url}.html`;

  const title = data?.seo_title
    ? `Такси ${data?.seo_title} - междугородние перевозки | City2City`
    : `Такси ${data?.title} - междугородние перевозки | City2City`;

  let description =
    data?.seo_description ||
    `Заказать междугороднее такси ${data?.seo_title}. Комфортные автомобили, опытные водители, фиксированные цены. Тел: +7 (938) 156-87-57`;

  if (description.startsWith('?')) {
    description = description.substring(1).trim();
  }

  description = `⭐ ${description}`;

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
          alt: `Такси ${data?.seo_title} - City2City`,
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

  // ------------ schema generation -----------

  // Получаем города (если нужно — можешь заменить логикой из своей базы)
  const [cityFrom, cityTo] = data.city_data
    ? data.city_data.split(",")
    : ["", ""];

  const taxiSchema = generateSchemaOrg(data);

  const faqSchema = generateFAQSchema(data);

  return (
    <>
      {/* TaxiService JSON-LD */}
      <Script
        id="schema-taxi-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiSchema) }}
      />

      {/* FAQ JSON-LD */}
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Home routeData={data} />
    </>
  );
}
