export type RouteRedirects = Readonly<Record<string, string>>

/** Exact local-path lookup only: neither city prefixes nor slug spelling imply a migration. */
export function resolveRoutePath(path: string, redirects: RouteRedirects): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const suffixAt = path.search(/[?#]/)
  const pathname = suffixAt === -1 ? path : path.slice(0, suffixAt)
  const suffix = suffixAt === -1 ? '' : path.slice(suffixAt)
  const visited = new Set<string>()
  let current = pathname

  while (Object.prototype.hasOwnProperty.call(redirects, current)) {
    if (visited.has(current)) return path
    visited.add(current)
    const target = redirects[current]
    // A malformed future manifest must never produce an external or parameter-bearing redirect.
    if (!target.startsWith('/') || target.startsWith('//') || /[?#\\\s]/.test(target)) return path
    current = target
  }

  return `${current}${suffix}`
}
