import { IRouteData } from '../types/route.interface';
import { IHub, IHubDestination } from '../types/hub.interface';
import { resolveVerifiedRoutePath } from './route-url';
import { resolveHtmlHref, rewriteAnchorHrefs } from './html-links-core';

// Use at server-to-client boundaries, never import the full map into client components.
export function resolveHtmlRouteLinks(html: string): string {
  if (typeof html !== 'string') return html;
  return rewriteAnchorHrefs(html, href => resolveHtmlHref(href, resolveVerifiedRoutePath));
}

/** Only HTML fields rendered by Home are copied; identifiers, pricing and metadata remain untouched. */
export function routeDataWithDirectHtmlLinks(data: IRouteData): IRouteData {
  return {
    ...data,
    main_text: data.main_text ? resolveHtmlRouteLinks(data.main_text) : data.main_text,
    attractions: Array.isArray(data.attractions) ? data.attractions.map(attraction => {
      if (!attraction || typeof attraction !== 'object') return attraction;
      return { ...attraction, description: resolveHtmlRouteLinks(attraction.description) };
    }) : data.attractions,
  };
}

export function destinationWithDirectHtmlLinks(destination: IHubDestination): IHubDestination {
  return {
    ...destination,
    description: destination.description ? resolveHtmlRouteLinks(destination.description) : destination.description,
    content: destination.content ? resolveHtmlRouteLinks(destination.content) : destination.content,
  };
}

export function hubWithDirectHtmlLinks(hub: IHub): IHub {
  return { ...hub, description: hub.description ? resolveHtmlRouteLinks(hub.description) : hub.description };
}
