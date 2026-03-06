import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BASE_URL } from "@/shared/constants";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { destinationService } from "@/shared/api/destination.service";
import DestinationPage from "@/pages-list/destination/ui/destination-page/DestinationPage";

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

  const priceFormatted = destination.price
    ? new Intl.NumberFormat('ru-RU').format(Number(destination.price))
    : null;

  const title = destination.seoTitle ||
    `Трансфер ${destination.name}${priceFormatted ? ` от ${priceFormatted} ₽` : ''}`;

  const descriptionParts = [
    `Заказать трансфер в ${destination.toCity || destination.name}.`,
    destination.distance ? `Расстояние ${destination.distance} км.` : '',
    destination.duration ? `Время в пути ${destination.duration}.` : '',
    priceFormatted ? `Цена от ${priceFormatted} ₽.` : '',
    'Комфортные автомобили, опытные водители. Работаем 24/7.',
  ].filter(Boolean).join(' ');

  const description = destination.seoDescription || descriptionParts;

  const keywords = destination.seoKeywords ||
    `трансфер ${destination.name}, такси ${destination.name}, междугороднее такси ${destination.toCity}, заказать трансфер в ${destination.toCity}`;

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
