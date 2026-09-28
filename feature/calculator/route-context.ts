import { FEDERAL_DISTRICTS } from '@/pages-list/region-hubs/config/registry';

type RouteContextData = { city_seo_data?: string; city_from?: string; city_to?: string };
const cityNames = new Map<string, string>();
for (const district of FEDERAL_DISTRICTS) for (const city of district.cities) {
  for (const name of [city.name, city.nameGenitive, city.nameLocative]) {
    if (name) cityNames.set(name.replace(/^(?:из|во|в)\s+/i, '').toLocaleLowerCase('ru-RU'), city.name);
  }
}
export function cleanRoutePoint(value: string = ''): string {
  const name = value.trim().replace(/^(?:из|во|в)\s+/i, '').trim();
  if (name === '-') return '';
  return cityNames.get(name.toLocaleLowerCase('ru-RU')) || name;
}
export function getRoutePoints(route?: RouteContextData, cityData?: string) {
  const points = (cityData || route?.city_seo_data || '').split(',');
  return { from: cleanRoutePoint(route?.city_from || points[0]), to: cleanRoutePoint(route?.city_to || points[1]) };
}
