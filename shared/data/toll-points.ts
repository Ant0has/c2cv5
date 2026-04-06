export interface TollPoint {
  id: string
  road: string
  name: string
  km: number
  lat: number
  lon: number
  system: 'open' | 'closed' | 'freeflow'
  fee_day: number  // ₽, 1 кат., день, будни, наличные
}

// Тарифы: 1₽ по умолчанию — заменить на реальные после проверки
export const TOLL_POINTS: TollPoint[] = [
  // === М-4 «Дон» (Москва → Новороссийск) ===
  { id: 'm4_62', road: 'М-4', name: 'ПВП 62 км', km: 62, lat: 55.23711, lon: 37.86908, system: 'open', fee_day: 1 },
  { id: 'm4_71', road: 'М-4', name: 'ПВП 71 км', km: 71, lat: 55.16828, lon: 37.91925, system: 'open', fee_day: 1 },
  { id: 'm4_133', road: 'М-4', name: 'ПВП 133 км', km: 133, lat: 54.69434, lon: 38.16129, system: 'open', fee_day: 1 },
  { id: 'm4_228', road: 'М-4', name: 'ПВП 228 км', km: 228, lat: 53.87819, lon: 38.04851, system: 'open', fee_day: 1 },
  { id: 'm4_322', road: 'М-4', name: 'ПВП 322 км', km: 322, lat: 53.08853, lon: 38.16980, system: 'open', fee_day: 1 },
  { id: 'm4_339', road: 'М-4', name: 'ПВП 339 км', km: 339, lat: 52.93109, lon: 38.21466, system: 'open', fee_day: 1 },
  { id: 'm4_355', road: 'М-4', name: 'ПВП 355 км', km: 355, lat: 52.79802, lon: 38.31479, system: 'open', fee_day: 1 },
  { id: 'm4_380', road: 'М-4', name: 'ПВП 380 км', km: 380, lat: 52.66325, lon: 38.58503, system: 'open', fee_day: 1 },
  { id: 'm4_416', road: 'М-4', name: 'ПВП 416 км', km: 416, lat: 52.43015, lon: 38.82462, system: 'open', fee_day: 1 },
  { id: 'm4_460', road: 'М-4', name: 'ПВП 460 км', km: 460, lat: 52.12562, lon: 39.19519, system: 'open', fee_day: 1 },
  { id: 'm4_515', road: 'М-4', name: 'ПВП 515 км', km: 515, lat: 51.66300, lon: 39.30228, system: 'open', fee_day: 1 },
  { id: 'm4_545', road: 'М-4', name: 'ПВП 545 км', km: 545, lat: 51.47141, lon: 39.55413, system: 'open', fee_day: 1 },
  { id: 'm4_620', road: 'М-4', name: 'ПВП 620 км', km: 620, lat: 50.86699, lon: 39.97597, system: 'open', fee_day: 1 },
  { id: 'm4_636', road: 'М-4', name: 'ПВП 636 км', km: 636, lat: 50.75081, lon: 40.04738, system: 'open', fee_day: 1 },
  { id: 'm4_672', road: 'М-4', name: 'ПВП 672 км', km: 672, lat: 50.45148, lon: 40.16711, system: 'open', fee_day: 1 },
  { id: 'm4_1093', road: 'М-4', name: 'ПВП 1093 км', km: 1093, lat: 47.01319, lon: 39.73397, system: 'open', fee_day: 1 },
  { id: 'm4_1184', road: 'М-4', name: 'ПВП 1184 км', km: 1184, lat: 46.23045, lon: 39.83153, system: 'open', fee_day: 1 },
  { id: 'm4_1223', road: 'М-4', name: 'ПВП 1223 км', km: 1223, lat: 45.91567, lon: 39.71004, system: 'open', fee_day: 1 },

  // === М-11 «Нева» (Москва → СПб) — только точки с координатами ===
  { id: 'm11_385', road: 'М-11', name: 'ПВП 385 км', km: 385, lat: 58.08903, lon: 33.67052, system: 'closed', fee_day: 1 },
  { id: 'm11_649', road: 'М-11', name: 'ПВП 649 км', km: 649, lat: 59.57120, lon: 30.66951, system: 'closed', fee_day: 1 },

  // === М-12 «Восток» (Москва → Казань) ===
  { id: 'm12_86', road: 'М-12', name: 'ПВП 86 км', km: 86, lat: 55.26374, lon: 36.69133, system: 'closed', fee_day: 1 },

  // === М-1 «Беларусь» ===
  { id: 'm1_46', road: 'М-1', name: 'ПВП 46 км', km: 46, lat: 55.60020, lon: 36.98021, system: 'open', fee_day: 1 },

  // === М-3 «Украина» ===
  { id: 'm3_136', road: 'М-3', name: 'ПВП 136 км', km: 136, lat: 54.86721, lon: 36.34801, system: 'open', fee_day: 1 },
  { id: 'm3_168', road: 'М-3', name: 'ПВП 168 км', km: 168, lat: 54.61774, lon: 36.11519, system: 'open', fee_day: 1 },

  // === А-289 обход Краснодара ===
  { id: 'a289_23', road: 'А-289', name: 'ПВП 23 км', km: 23, lat: 45.17137, lon: 38.53272, system: 'open', fee_day: 1 },
  { id: 'a289_46', road: 'А-289', name: 'ПВП 46 км', km: 46, lat: 45.12776, lon: 38.74075, system: 'open', fee_day: 1 },

  // === ЗСД (Санкт-Петербург) ===
  { id: 'zsd_south', road: 'ЗСД', name: 'ПВП-1/ПВП-2', km: 0, lat: 59.85556, lon: 30.27562, system: 'closed', fee_day: 1 },
  { id: 'zsd_center1', road: 'ЗСД', name: 'ПВП 3-6', km: 0, lat: 59.87049, lon: 30.29480, system: 'closed', fee_day: 1 },
  { id: 'zsd_center2', road: 'ЗСД', name: 'ПВП 7-8', km: 0, lat: 59.87614, lon: 30.29474, system: 'closed', fee_day: 1 },
  { id: 'zsd_north', road: 'ЗСД', name: 'ПВП-9/ПВП-10', km: 0, lat: 59.89951, lon: 30.24510, system: 'closed', fee_day: 1 },
  { id: 'zsd_spad', road: 'ЗСД', name: 'СПАД', km: 0, lat: 59.72369, lon: 30.50879, system: 'closed', fee_day: 1 },

  // === Северный обход Одинцова ===
  { id: 'odintsovo_1', road: 'Обход Одинцова', name: 'ПВП 4,6 км А', km: 4.6, lat: 55.71879, lon: 37.31420, system: 'open', fee_day: 1 },
  { id: 'odintsovo_2', road: 'Обход Одинцова', name: 'ПВП 4,6 км Б', km: 4.6, lat: 55.71040, lon: 37.31723, system: 'open', fee_day: 1 },
  { id: 'odintsovo_3', road: 'Обход Одинцова', name: 'ПВП 6,9 км', km: 6.9, lat: 55.69774, lon: 37.29399, system: 'open', fee_day: 1 },
  { id: 'odintsovo_4', road: 'Обход Одинцова', name: 'ПВП 13,4 км', km: 13.4, lat: 55.66274, lon: 37.22407, system: 'open', fee_day: 1 },
  { id: 'odintsovo_5', road: 'Обход Одинцова', name: 'ПВП 17,7 км', km: 17.7, lat: 55.64176, lon: 37.17775, system: 'open', fee_day: 1 },

  // === Восточный выезд Уфы ===
  { id: 'ufa_east', road: 'Вост. выезд Уфа', name: 'ПВП Бураево-Октябрьский', km: 0, lat: 56.40324, lon: 56.34526, system: 'open', fee_day: 1 },

  // === Подъезд к аэр. Бегишево ===
  { id: 'begishevo_1', road: 'Подъезд Бегишево', name: 'ПВП Нижнекамск', km: 0, lat: 55.64840, lon: 51.68339, system: 'open', fee_day: 1 },
  { id: 'begishevo_2', road: 'Подъезд Бегишево', name: 'ПВП Наб.Челны', km: 0, lat: 55.64058, lon: 52.56721, system: 'open', fee_day: 1 },
]

/**
 * Проверяет проходит ли маршрут через ПВП.
 * routePoints — массив [lat, lon] из декодированного polyline.
 * Возвращает список ПВП через которые проходит маршрут и сумму.
 */
export function calculateTollCost(routePoints: [number, number][]): {
  totalCost: number
  tolls: { id: string; road: string; name: string; fee: number }[]
} {
  const passedTolls: TollPoint[] = []
  const passedIds = new Set<string>()

  for (const toll of TOLL_POINTS) {
    for (const [lat, lon] of routePoints) {
      if (
        Math.abs(lat - toll.lat) < 0.003 &&
        Math.abs(lon - toll.lon) < 0.004 &&
        !passedIds.has(toll.id)
      ) {
        passedTolls.push(toll)
        passedIds.add(toll.id)
        break
      }
    }
  }

  const totalCost = passedTolls.reduce((sum, t) => sum + t.fee_day, 0)

  return {
    totalCost,
    tolls: passedTolls.map(t => ({
      id: t.id,
      road: t.road,
      name: t.name,
      fee: t.fee_day,
    })),
  }
}
