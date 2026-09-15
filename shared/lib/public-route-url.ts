import redirectSnapshot from '../data/public-route-redirects.json'
import { resolveRoutePath } from './route-url-core'

// Client cards and city navigation receive only the reviewed subset, never the full route manifest.
export function resolvePublicRoutePath(path: string): string {
  return resolveRoutePath(path, redirectSnapshot.redirects)
}
