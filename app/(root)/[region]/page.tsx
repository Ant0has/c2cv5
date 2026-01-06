import { notFound } from "next/navigation";
import { Home } from "../Home";
import { routeService } from "@/shared/api/route.service";
import { Metadata } from "next";
import { excludesPages } from "@/shared/data/excludes-page";
import Script from "next/script";
import { BASE_URL } from "@/shared/constants";

import {
  generateSchemaOrg,
  generateFAQSchema,
  generateHubSchemaOrg,
} from "@/shared/services/seo-utils";
import { requisitsData } from "@/shared/data/requisits.data";

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

  const canonicalUrl = data?.canonical_url
    ? `${BASE_URL}/${data?.canonical_url}.html`
    : `${BASE_URL}/${data?.url}.html`;

  const title = data?.seo_title
    ? `${data?.seo_title}`
    : `Такси ${data?.title} - междугородние перевозки | ${requisitsData.BRAND_NAME}`;

  let description =
    data?.seo_description ||
    `Заказать междугороднее такси ${data?.seo_title}. Комфортные автомобили, опытные водители, фиксированные цены. Тел: ${requisitsData.PHONE_MARKED}`;

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
  
  const taxiSchema = generateSchemaOrg(data);

  const faqSchema = generateFAQSchema(data);

  const hubSchema = generateHubSchemaOrg(data.city_from || '', data.city_to || '');

  const getValidSchema = () => {
    if(data?.region_id === data?.regions_data?.ID) {
      return hubSchema;
    }
    return taxiSchema;
  }

  return (
    <>
      <Script
        id="schema-taxi-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getValidSchema()) }}
      />

      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Home routeData={data} />
    </>
  );
}
