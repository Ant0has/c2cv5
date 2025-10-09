import { notFound } from "next/navigation";
import { Home } from "../Home";
import { routeService } from "@/shared/services/route.service";
import { Metadata } from "next";

interface Props {
  params: {
    region: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = params.region.replace(/\.html$/, ""); // Удаляем .html
  const data = await routeService.getRouteByUrl(region);

  if (!data) {
    return {};
  }

  const siteName = "City2City";
  const page = `https://city2city.ru/${region}.html`;
  const title =
    data?.seo_title ||
    `Такси %%${data?.seo_title}%% %%${page}%% межгород ЦЕНА за Трансфер! Заказать междугороднее такси %%${siteName}%%`;
  const description =
    data?.seo_description ||
    `⭐️⭐️⭐️⭐️⭐️ Заказать междугороднее такси City2City по маршруту %%${data?.seo_title}%% %%${page}%%. Отличная цена, комфортные автомобили, проверенные водители. Заказ по телефонам: +7 (938) 156-87-578`;

  return {
    title,
    description,
    robots: "index, follow",
    keywords: data.metaKeywords,
    alternates: {
      canonical: page,
    },
    openGraph: {
      title,
      description,
      url: page,
      type: "website",
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
}

export default async function RegionPage({ params }: Props) {
  const region = params.region.replace(/\.html$/, ""); // Удаляем .html
  const data = await routeService.getRouteByUrl(region);

  if (data === null) {
    notFound();
  }

  return <Home routeData={data} />;
}