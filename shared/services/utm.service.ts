const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const COOKIE_NAME = 'utm_data'
const COOKIE_DAYS = 30

export interface UTMData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  landing_page?: string
  referrer?: string
}

export function saveUTMFromUrl(): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const hasUTM = UTM_KEYS.some(key => params.has(key))

  if (hasUTM) {
    const utm: Record<string, string> = {}
    UTM_KEYS.forEach(key => {
      const val = params.get(key)
      if (val) utm[key] = val
    })
    utm.landing_page = window.location.pathname
    utm.referrer = document.referrer || ''
    utm.timestamp = new Date().toISOString()

    const expires = new Date(Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(utm))}; expires=${expires}; path=/; SameSite=Lax`
    localStorage.setItem(COOKIE_NAME, JSON.stringify(utm))

    // Log visit to CRM for phone order matching
    logVisitToCRM(utm)
  } else if (document.referrer && !document.referrer.includes('city2city.ru')) {
    const existing = localStorage.getItem(COOKIE_NAME)
    if (!existing) {
      const data = {
        referrer: document.referrer,
        landing_page: window.location.pathname,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem('referrer_data', JSON.stringify(data))
    }
  }
}

function logVisitToCRM(utm: Record<string, string>): void {
  fetch('https://chat.city2city.ru/api/public/utm-visits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'c2c-miniapp-2026' },
    body: JSON.stringify({
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
      landing_page: utm.landing_page,
      referrer: utm.referrer,
      page_title: document.title,
    }),
  }).catch(() => {})
}

export function getUTMData(): UTMData | null {
  if (typeof window === 'undefined') return null

  // Try cookie
  const cookieMatch = document.cookie.match(/utm_data=([^;]+)/)
  if (cookieMatch) {
    try {
      return JSON.parse(decodeURIComponent(cookieMatch[1]))
    } catch { /* ignore */ }
  }

  // Fallback to localStorage
  const stored = localStorage.getItem(COOKIE_NAME)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch { /* ignore */ }
  }

  // If no UTM — return referrer data
  const ref = localStorage.getItem('referrer_data')
  if (ref) {
    try {
      return JSON.parse(ref)
    } catch { /* ignore */ }
  }

  return null
}
