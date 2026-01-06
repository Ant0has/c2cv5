import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { destinationService } from "@/shared/api/destination.service";
import DestinationPage from "@/pages-list/destination/ui/destination-page/DestinationPage";

interface Props {
  params: {
    region: string;
    destination: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = await destinationService.getBySlug(params.destination);

  if (!destination) {
    notFound();
  }

  const canonicalUrl = `https://vdrugoygorod.ru/${params.region}/${params.destination}`;
  const routeName = `${destination.fromCity || ''} — ${destination.toCity || ''}`;

  // Формируем SEO-оптимизированные title и description с параметрами маршрута
  const priceFormatted = destination.price
    ? new Intl.NumberFormat('ru-RU').format(Number(destination.price))
    : null;

  const title = destination.seoTitle ||
    `Трансфер ${routeName}${priceFormatted ? ` от ${priceFormatted} ₽` : ''} | ${SITE_NAME}`;

  const descriptionParts = [
    `Заказать трансфер ${routeName}.`,
    destination.distance ? `Расстояние ${destination.distance} км.` : '',
    destination.duration ? `Время в пути ${destination.duration}.` : '',
    priceFormatted ? `Цена от ${priceFormatted} ₽.` : '',
    'Комфортные автомобили, опытные водители. Работаем 24/7.',
  ].filter(Boolean).join(' ');

  const description = destination.seoDescription || descriptionParts;

  const keywords = destination.seoKeywords ||
    `трансфер ${destination.fromCity}, такси ${routeName}, междугороднее такси ${destination.toCity}, заказать трансфер`;

  return {
    title,
    description,
    keywords,
    robots: "index, follow",
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "ru_RU",
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: destination.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image.jpg"],
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
