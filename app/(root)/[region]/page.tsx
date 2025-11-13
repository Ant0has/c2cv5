import { notFound } from "next/navigation";
import { Home } from "../Home";
import { routeService } from "@/shared/services/route.service";
import { Metadata } from "next";
import { excludesPages } from "@/shared/data/excludes-page";

interface Props {
  params: {
    region: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const regionSlug = params.region.replace(/\.html$/, "");
  const data = await routeService.getRouteByUrl(regionSlug);

  const shouldAddNoIndex = (regionSlug.includes('bryansk')) && 
  !excludesPages.find(page => page.includes(regionSlug))

  // Если данные не найдены - возвращаем notFound()
  if (!data) {
    notFound();
  }

  const siteName = "City2City";
  
  const canonicalUrl = `https://city2city.ru/${regionSlug}.html`;
  
  const title = data?.seo_title || 
    `Такси ${data?.seo_title} - междугородние перевозки | City2City`;
  
  const description = data?.seo_description || 
    `Заказать междугороднее такси ${data?.seo_title}. Комфортные автомобили, опытные водители, фиксированные цены. Тел: +7 (938) 156-87-57`;

  const keywords = data?.meta?.keywords || 
    `такси ${data?.seo_title}, междугороднее такси, заказ такси ${data?.seo_title}`;

  return {
    title,
    description,
    keywords,
    robots: shouldAddNoIndex ? "noindex, nofollow" : "index, follow",
    
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
      // Добавьте изображение для OG
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
      // Добавьте изображение для Twitter
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

  return <Home routeData={data} />;
}