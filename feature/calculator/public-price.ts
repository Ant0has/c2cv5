import { Prices } from '../../shared/types/enums';

// Public quotes only. CRM tariff revision 1, checked 2026-09-11.
// Do not import into the dispatcher calculators or change the routing service.
export const PUBLIC_TARIFFS = {
  [Prices.COMFORT]: { rate: 35, minimum: 2500 },
  [Prices.COMFORT_PLUS]: { rate: 45, minimum: 3000 },
  [Prices.BUSINESS]: { rate: 95, minimum: 5000 },
  [Prices.MINIVAN]: { rate: 60, minimum: 3000 },
  // Delivery keeps its existing rate; the public "from" discount also applies.
  [Prices.DELIVERY]: { rate: 25, minimum: 0 },
} as const;

export function publicMinimum(plan: Prices): number {
  return plan in PUBLIC_TARIFFS
    ? PUBLIC_TARIFFS[plan as keyof typeof PUBLIC_TARIFFS].minimum || 2000
    : 2000;
}

export function calculatePublicQuote(distanceKm: number, plan: Prices) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new Error('A positive route distance is required');
  }
  if (!(plan in PUBLIC_TARIFFS)) throw new Error('Unsupported public vehicle class');
  const tariff = PUBLIC_TARIFFS[plan as keyof typeof PUBLIC_TARIFFS];
  const roundedKm = Math.ceil(distanceKm / 10) * 10;
  // Passenger coefficients use the engine's distance before rounding to 10 km.
  // Preserve delivery's existing coefficient boundaries.
  const coefficientKm = plan === Prices.DELIVERY ? roundedKm : distanceKm;
  const coefficient = coefficientKm < 100 ? 1.5 : coefficientKm < 150 ? 1.2 : coefficientKm < 200 ? 1.1 : 1;
  const calculatedPrice = Math.ceil(Math.max(tariff.minimum, roundedKm * tariff.rate * coefficient) / 500) * 500;
  const discount = roundedKm > 300 ? 1000 : 0;
  return { distanceKm: roundedKm, calculatedPrice, discount, price: Math.max(tariff.minimum, calculatedPrice - discount) };
}

export function formatPublicPrice(price: number): string {
  return `От ${price.toLocaleString('ru-RU')} руб.`;
}
