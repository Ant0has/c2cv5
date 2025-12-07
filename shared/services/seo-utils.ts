// ============================================================================
// SEO & CONTENT UTILITIES
// City2City | Шаг 3 SEO-оптимизации
// ============================================================================

import { IRouteData } from "../types/route.interface";

// === КОНФИГУРАЦИЯ ===
export const CONFIG = {
  LAUNCH_DATE: new Date('2024-01-01'),
  SPEED_KMH: 70,
  PHONE: '+7 (938) 156-87-57',
};


// === 1. СТАБИЛЬНЫЙ ХЭШ ===
export function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash % 1000);
}

// === 2. КОЛИЧЕСТВО ПОЕЗДОК ===
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

// === 3. ФОРМАТИРОВАНИЕ ===

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

// === Расчёты ===
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

// === 4. SCHEMA.ORG ===

export function generateSchemaOrg(route: IRouteData) {
  return {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: `Такси ${route.city_from} — ${route.city_to} | City2City`,
    description: `Междугороднее такси ${route.city_from} — ${route.city_to}, ${route.distance_km} км`,
    areaServed: `${route.city_from} — ${route.city_to}`,
    provider: {
      "@type": "Organization",
      name: "City2City",
      telephone: CONFIG.PHONE,
      url: "https://city2city.ru"
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
