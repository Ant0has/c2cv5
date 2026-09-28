/**
 * Normalize contact numbers, not prove that a number exists or is reachable.
 * Local 10-digit and trunk-prefix 8 numbers use the site's Russian default.
 * Other countries must have an explicit + or 00 international prefix.
 */
export function normalizePhoneNumber(value: string): string | null {
  if (typeof value !== 'string') return null

  const compact = value.trim().replace(/[\s()\-\u2010-\u2015\u2212]/g, '')
  if (!compact || !/^\+?\d+$/.test(compact)) return null

  const international = compact.startsWith('+') || compact.startsWith('00')
  let digits = compact.startsWith('+') ? compact.slice(1) : compact
  if (compact.startsWith('00')) digits = compact.slice(2)

  if (!international) {
    if (/^[1-9]\d{9}$/.test(digits)) {
      digits = `7${digits}`
    } else if (/^[78]\d{10}$/.test(digits)) {
      digits = `7${digits.slice(1)}`
    } else {
      return null
    }
  }

  // International syntax only; no guessed country code for short/local input.
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null
  if (digits.startsWith('7') && digits.length !== 11) return null
  return `+${digits}`
}
