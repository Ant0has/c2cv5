
import { IRouteData } from "../types/route.interface";
import { requisitsData } from "../data/requisits.data";
import { BASE_URL } from "../constants";

export const CONFIG = {
  LAUNCH_DATE: new Date('2024-01-01'),
  SPEED_KMH: 70,
  PHONE: requisitsData.PHONE_MARKED,
};


export function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash % 1000);
}

export function calcTripsCount(url: string, isWhitelist: boolean): number {
  const now = new Date();
  const weeksSinceLaunch = Math.floor(
    (now.getTime() - CONFIG.LAUNCH_DATE.getTime()) /
    (7 * 24 * 60 * 60 * 1000)
  );

  const hash = stableHash(url);

  const baseTrips = 15 + (hash % 30);

  const weeklyGrowth = isWhitelist
    ? 3 + (hash % 4)
    : 1 + (hash % 3);

  return baseTrips + weeklyGrowth * weeksSinceLaunch;
}


export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU');
}

export function formatDuration(hours: number): string {
  const numb = Number(hours);
  return numb === Math.floor(numb)
    ? `${numb} ч`
    : `${numb.toFixed(1).replace('.', ',')} ч`;
}

export function roundUpTo5(km: number): number {
  return Math.ceil(km / 5) * 5;
}

export function calcDuration(distanceKm: number): number {
  const hours = distanceKm / CONFIG.SPEED_KMH;
  return Math.max(1, Math.round(hours * 2) / 2);
}

export function calcPriceEconomy(distanceKm: number): number {
  const value = Math.max(3000, distanceKm * 15);
  return Math.round(value / 100) * 100;
}

export function calcPriceComfort(distanceKm: number): number {
  const value = Math.max(4000, distanceKm * 18);
  return Math.round(value / 100) * 100;
}

export function generateSchemaOrg(route: IRouteData) {
  return {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: `Такси ${route.city_from} — ${route.city_to} | ${requisitsData.BRAND_NAME}`,
    description: `Междугороднее такси ${route.city_from} — ${route.city_to}, ${route.distance_km} км`,
    areaServed: `${route.city_from} — ${route.city_to}`,
    provider: {
      "@type": "Organization",
      name: requisitsData.BRAND_NAME,
      telephone: CONFIG.PHONE,
      url: BASE_URL
    },
    offers: {
      "@type": "Offer",
      price: route.price_economy,
      priceCurrency: "RUB",
      description: "Эконом-класс"
    }
  };
}

export function generateFAQSchema(route: IRouteData) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: route.faq1_q,
        acceptedAnswer: { "@type": "Answer", text: route.faq1_a }
      },
      {
        "@type": "Question",
        name: route.faq2_q,
        acceptedAnswer: { "@type": "Answer", text: route.faq2_a }
      },
      {
        "@type": "Question",
        name: route.faq3_q,
        acceptedAnswer: { "@type": "Answer", text: route.faq3_a }
      }
    ]
  };
}

export function generateOrganizationSchemaOrg() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": requisitsData.BRAND_NAME,
    "alternateName": "Сити2Сити",
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "description": "Служба заказа междугороднего такси по России. Комфортные трансферы между городами, фиксированные цены, профессиональные водители.",
    "telephone": requisitsData.PHONE_MARKED,
    "email": requisitsData.EMAIL,
    "foundingDate": "2020",
    "areaServed": {
      "@type": "Country",
      "name": "Россия"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": requisitsData.PHONE_MARKED,
      "contactType": "customer service",
      "availableLanguage": "Russian",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "23:00"
      }
    },
    "sameAs": [
      `https://t.me/${requisitsData.TELEGRAM_NICKNAME}`,
      `https://wa.me/${requisitsData.WHATSAPP_NICKNAME}`
    ]
  };
}

export function generateBreadcrumbSchemaOrg() {
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Контакты",
      "item": `${BASE_URL}/contacts`
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Публичная Оферта для Юридических Лиц",
      "item": `${BASE_URL}/oferta`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Работа команды",
      "item": `${BASE_URL}/team`
    }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}

export function generateHubSchemaOrg(city: string, region: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${requisitsData.BRAND_NAME} — Междугороднее такси ${city}`,
    "description": `Служба заказа междугороднего такси в ${city}. Трансферы по ${region || 'России'}. Комфортные автомобили, фиксированные цены.`,
    "telephone": requisitsData.PHONE_MARKED,
    "email": requisitsData.EMAIL,
    "url": BASE_URL,
    "priceRange": "₽₽",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "23:00"
    },
    "areaServed": {
      "@type": "Place",
      "name": region || city
    }
  };
}
