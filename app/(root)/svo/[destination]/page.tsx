import { notFound } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";
import { BASE_URL } from "@/shared/constants";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { destinationService } from "@/shared/api/destination.service";
import { requisitsData } from "@/shared/data/requisits.data";
import { TRUST_STATS } from "@/pages-list/mezhgorod-root/config/content";
import DestinationPage from "@/pages-list/destination/ui/destination-page/DestinationPage";
import { KPP_BY_DESTINATION_SLUG, SVO_REGION_BY_DEST, SVO_TRUST_FACTS, yearsForCity } from "@/pages-list/destination/config/svo-data";

interface Props {
  params: {
    destination: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = await destinationService.getBySlug(params.destination);

  if (!destination) {
    notFound();
  }

  const canonicalUrl = `${BASE_URL}/svo/${params.destination}`;
  const isSvo = destination.hub?.slug === 'svo';

  const priceFormatted = destination.price
    ? new Intl.NumberFormat('ru-RU').format(Number(destination.price))
    : null;

  const region = SVO_REGION_BY_DEST[params.destination];
  const kpp = KPP_BY_DESTINATION_SLUG[params.destination];
  const cityName = destination.toCity || destination.name;

  const yrs = yearsForCity(params.destination);
  const yrsWord = yrs === 1 ? 'год' : yrs < 5 ? 'года' : 'лет';
  const yrsContext = yrs === 8 ? '(с до-СВО)' : '(с момента СВО)';

  const title = isSvo
    ? `Трансфер в ${cityName}${region ? ` (${region})` : ''} 2026 — водители работают по региону ${yrs} ${yrsWord}`
    : (destination.seoTitle || `Трансфер ${destination.name}${priceFormatted ? ` от ${priceFormatted} ₽` : ''}`);

  const descriptionParts = isSvo
    ? [
        `Актуально на 2026 год: трансфер в ${cityName}${kpp ? ` через ${kpp.fullName}` : ''}.`,
        `Водители работают по ${region || 'новым регионам'} ${yrs} ${yrsWord} ${yrsContext},`,
        `${SVO_TRUST_FACTS.tripsCompleted}+ выполненных поездок.`,
        'Связь с диспетчером 24/7, документы для въезда — на странице.',
      ]
    : [
        `Заказать трансфер в ${destination.toCity || destination.name}.`,
        destination.distance ? `Расстояние ${destination.distance} км.` : '',
        destination.duration ? `Время в пути ${destination.duration}.` : '',
        priceFormatted ? `Цена от ${priceFormatted} ₽.` : '',
        'Комфортные автомобили, опытные водители. Работаем 24/7.',
      ];

  const description = descriptionParts.filter(Boolean).join(' ');

  const keywords = isSvo
    ? `трансфер в ${cityName} 2026, такси Москва ${cityName}, поездка в ${region || cityName}, такси через КПП${kpp ? ' ' + kpp.name : ''}, такси в новые регионы 2026`
    : (destination.seoKeywords ||
       `трансфер ${destination.name}, такси ${destination.name}, междугороднее такси ${destination.toCity}, заказать трансфер в ${destination.toCity}`);

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const destination = await destinationService.getBySlug(params.destination);

  if (!destination) {
    notFound();
  }

  const isSvo = destination.hub?.slug === 'svo';
  const cityName = destination.toCity || destination.name;
  const region = SVO_REGION_BY_DEST[params.destination];
  const pageUrl = `${BASE_URL}/svo/${params.destination}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Такси в зону СВО', item: `${BASE_URL}/svo` },
      { '@type': 'ListItem', position: 3, name: cityName, item: pageUrl },
    ],
  };

  const taxiServiceSchema = isSvo ? {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    '@id': pageUrl,
    name: `${requisitsData.BRAND_NAME} — трансфер в ${cityName}${region ? ` (${region})` : ''}`,
    url: pageUrl,
    telephone: requisitsData.PHONE_MARKED,
    areaServed: { '@type': region ? 'AdministrativeArea' : 'City', name: region || cityName },
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
    offers: destination.price ? {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: String(destination.price),
      availability: 'https://schema.org/InStock',
    } : undefined,
  } : null;

  return (
    <>
      <Script
        id={`schema-breadcrumbs-svo-${params.destination}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {taxiServiceSchema && (
        <Script
          id={`schema-taxi-service-svo-${params.destination}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiServiceSchema) }}
        />
      )}
      <DestinationPage destination={destination} />
    </>
  );
}
