// Точечная защита до исправления источника CRM. Проверено публичными GET 07.10.2026:
// шесть canonical возвращают 410, canonical Смидовича перенаправляет назад.
// Применяется только пока API возвращает именно проверенное ошибочное значение.
const FIXES: Record<string, string> = {
  'xabarovsk-chelyabinsk-2': 'xabarovsk-chelyabinsk',
  'xabarovsk-livadiya-2': 'xabarovsk-livadiya',
  'xabarovsk-malysheva-2': 'xabarovsk-malysheva',
  'xabarovsk-priamurskij-2': 'xabarovsk-priamurskij',
  'xabarovsk-ulan-ude-2': 'xabarovsk-ulan-ude',
  'xabarovsk-zavitinsk-2': 'xabarovsk-zavitinsk',
  'xabarovsk-smidovich': 'xabarovsk-smidovich-2',
}

export function reviewedCanonicalSlug(requestSlug: string, canonicalSlug: string | null | undefined, dataSlug: string): string {
  if (FIXES[requestSlug] && canonicalSlug === FIXES[requestSlug]) return requestSlug
  return canonicalSlug || dataSlug
}
