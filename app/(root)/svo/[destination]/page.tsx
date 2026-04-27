import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BASE_URL } from "@/shared/constants";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { destinationService } from "@/shared/api/destination.service";
import DestinationPage from "@/pages-list/destination/ui/destination-page/DestinationPage";
import { KPP_BY_DESTINATION_SLUG, SVO_REGION_BY_DEST, SVO_TRUST_FACTS } from "@/pages-list/destination/config/svo-data";

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

  const title = isSvo
    ? `Трансфер в ${cityName}${region ? ` (${region})` : ''} — водители работают по региону ${SVO_TRUST_FACTS.yearsInRegion} лет | ${SITE_NAME}`
    : (destination.seoTitle || `Трансфер ${destination.name}${priceFormatted ? ` от ${priceFormatted} ₽` : ''}`);

  const descriptionParts = isSvo
    ? [
        `Трансфер в ${cityName}${kpp ? ` через ${kpp.fullName}` : ''}.`,
        `Водители работают по ${region || 'новым регионам'} ${SVO_TRUST_FACTS.yearsInRegion} лет (с до-СВО),`,
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
    ? `трансфер в ${cityName}, такси Москва ${cityName}, поездка в ${region || cityName}, такси через КПП${kpp ? ' ' + kpp.name : ''}, такси в новые регионы`
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

  return <DestinationPage destination={destination} />;
}
