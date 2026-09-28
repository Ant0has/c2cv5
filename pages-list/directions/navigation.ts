import places from './navigation.generated.json';

export type DestinationGuide = (typeof places)[number];
export const destinationGuides = places;

/** Match the destination, never the departure city or a substring in another name. */
export function guideForRoute(path: string): DestinationGuide | undefined {
  const pathname = path.split(/[?#]/)[0].replace(/\/$/, '');
  const exact = places.find(place => place.routes.includes(pathname));
  if (exact) return exact;
  const hierarchy = pathname.match(/^\/mezhgorod\/[^/]+\/([^/]+)$/);
  if (hierarchy) return places.find(place => place.routeSlugs.includes(hierarchy[1]));
  if (/^\/[^/]+\.html$/.test(pathname)) {
    const route = pathname.slice(1, -5);
    return places.find(place => place.routeSlugs.some(slug => route.endsWith('-' + slug)));
  }
  return undefined;
}
