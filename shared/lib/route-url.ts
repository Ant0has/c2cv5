import redirectSnapshot from '../data/verified-route-redirects.json'
import { resolveRoutePath, type RouteRedirects } from './route-url-core'

const VERIFIED_REDIRECTS: RouteRedirects = redirectSnapshot.redirects

/** Server-side navigation only; the manifest never decides metadata or route eligibility. */
export function resolveVerifiedRoutePath(path: string, redirects: RouteRedirects = VERIFIED_REDIRECTS): string {
  return resolveRoutePath(path, redirects)
}

/** Resolve the caller's existing href only; another legacy URL does not prove route identity. */
export function routeToUrl(routeDbSlug: string, existingPath?: string): string {
  return resolveVerifiedRoutePath(existingPath ?? `/${routeDbSlug}.html`)
}

/** Start with the exact hierarchy (or legacy href) this city caller rendered before. */
export function cityRouteToUrl(citySlug: string, routeDbSlug: string): string {
  const prefix = `${citySlug}-`
  const existingPath = routeDbSlug.startsWith(prefix)
    ? `/mezhgorod/${citySlug}/${routeDbSlug.slice(prefix.length)}`
    : undefined
  return routeToUrl(routeDbSlug, existingPath)
}

export function uniqueRouteLinks<T extends { url: string }>(routes: T[], currentPath?: string): Array<T & { href: string }> {
  const seen = new Set<string>(currentPath ? [resolveVerifiedRoutePath(currentPath)] : [])
  return routes.flatMap(route => {
    const href = routeToUrl(route.url)
    if (seen.has(href)) return []
    seen.add(href)
    return [{ ...route, href }]
  })
}
