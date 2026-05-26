import { Prices } from '@/shared/types/enums'

export interface CapacityScenario {
  id: string
  label: string
  result: string
}

export interface CapacityData {
  passengers: number | null // null — скрыть бейдж пассажиров (для класса Доставка)
  luggageBadge: string
  scenarios: CapacityScenario[]
}

// Парк машин обновлённый: Kia Rio/Solaris для Комфорта (до 4), Grand Starex для Минивэна (до 7).
export const CAPACITY_DATA: Record<Prices, CapacityData> = {
  [Prices.COMFORT]: {
    passengers: 4,
    luggageBadge: '2 чемодана',
    scenarios: [
      { id: 'max',      label: 'Максимум крупного',     result: '2 больших (XL/L) + 3 места под ручную кладь' },
      { id: 'standard', label: 'Стандартный на каждого', result: '3 средних (M) + 3 места под ручную кладь' },
      { id: 'family',   label: 'Семейная поездка',      result: '1 большой + складная коляска + 2 сумки' },
    ],
  },
  [Prices.COMFORT_PLUS]: {
    passengers: 3,
    luggageBadge: '3 чемодана',
    scenarios: [
      { id: 'max',      label: 'Максимум крупного',     result: '3 больших (XL/L) + 3 места под ручную кладь' },
      { id: 'standard', label: 'Стандартный на каждого', result: '3 средних (M) + ручная кладь' },
      { id: 'family',   label: 'Семейная поездка',      result: '2 больших + складная коляска + сумка' },
    ],
  },
  [Prices.BUSINESS]: {
    passengers: 3,
    luggageBadge: '3 чемодана',
    scenarios: [
      { id: 'max',      label: 'Максимум крупного',     result: '3 больших (XL/L) + 3 места под ручную кладь' },
      { id: 'standard', label: 'Стандартный на каждого', result: '4 средних (M) + ручная кладь' },
      { id: 'family',   label: 'Семейная поездка',      result: '2 больших + складная коляска + сумка' },
    ],
  },
  [Prices.MINIVAN]: {
    passengers: 7,
    luggageBadge: 'до 7 чемоданов',
    scenarios: [
      { id: 'max',      label: 'Максимум крупного',     result: '4 больших (XL/L) + 7 мест под ручную кладь' },
      { id: 'standard', label: 'Стандартный на каждого', result: '7 средних (M) + 7 мест под ручную кладь' },
      { id: 'family',   label: 'Семейная поездка',      result: '2 больших + 2-3 сумки + детская коляска + 7 мест' },
    ],
  },
  // Доставка — бейдж пассажиров скрыт, чипы переименованы под груз
  [Prices.DELIVERY]: {
    passengers: null,
    luggageBadge: 'крупногабарит',
    scenarios: [
      { id: 'weight',  label: 'По весу и габаритам',  result: 'Расчёт по фактическому весу и размерам груза' },
      { id: 'cargo',   label: 'Коробки и паллеты',    result: 'Коробки, паллеты, лыжи, инструмент — фикс. цена за рейс' },
      { id: 'b2b',     label: 'Юридическим лицам',    result: 'Договор и закрывающие документы для бухгалтерии' },
    ],
  },
  // Эконом тарифа в UI обычно нет (планы из enums), но запишем дефолт на всякий
  [Prices.STANDARD]: {
    passengers: 4,
    luggageBadge: '2 чемодана',
    scenarios: [
      { id: 'max',      label: 'Максимум крупного',     result: '2 больших + 3 места под ручную кладь' },
      { id: 'standard', label: 'Стандартный на каждого', result: '3 средних + ручная кладь' },
      { id: 'family',   label: 'Семейная поездка',      result: '1 большой + коляска + 2 сумки' },
    ],
  },
}

// Пилотные маршруты — на которых блок показывается. Расширять по мере отладки.
export const CAPACITY_PILOT_ROUTES: ReadonlyArray<string> = [
  '/mezhgorod/izhevsk/chernushka',
]

export function isCapacityPilotRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  // Сравниваем без концевого слэша
  const normalized = pathname.replace(/\/$/, '')
  return CAPACITY_PILOT_ROUTES.includes(normalized)
}
