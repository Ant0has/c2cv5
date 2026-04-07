// Toll points data — actualized 2026-04-07 (after Avtodor indexation 02.03.2026)
// Source: пвп_апрель_2026.xlsx
// Tariffs: Category 1, weekdays (Mon-Thu), day, without transponder, in rubles
// For M-11 (58-679 km): cumulative from 58 km (closed system)
// For MSD: only during peak hours (weekdays 07:00-11:00, 16:00-20:00)

export interface TollPoint {
  id: string
  road: string
  name: string
  lat: number
  lon: number
  system: 'open' | 'closed' | 'freeflow'
  fee_day: number
}

export const TOLL_POINTS: TollPoint[] = [
  // Псковская область
  { id: "pvp_0", road: "Платные дороги в Псковской области", name: "Остров-Вышгородок", lat: 57.8317, lon: 27.59979, system: "open", fee_day: 300 },
  // М-1 Беларусь
  { id: "pvp_1", road: "М-1 Беларусь", name: "46 км.", lat: 55.600077, lon: 36.980367, system: "open", fee_day: 250 },
  // Обход Одинцова
  { id: "pvp_2", road: "Обход Одинцова", name: "4,6 км А", lat: 55.718774, lon: 37.314234, system: "open", fee_day: 100 },
  { id: "pvp_3", road: "Обход Одинцова", name: "4,6 км Б", lat: 55.710443, lon: 37.317236, system: "open", fee_day: 100 },
  { id: "pvp_4", road: "Обход Одинцова", name: "6,9 км.", lat: 55.697712, lon: 37.29393, system: "open", fee_day: 350 },
  { id: "pvp_5", road: "Обход Одинцова", name: "13,4 км из МСК", lat: 55.662717, lon: 37.223681, system: "open", fee_day: 100 },
  { id: "pvp_6", road: "Обход Одинцова", name: "13,4 в МСК", lat: 55.66283, lon: 37.22456, system: "open", fee_day: 100 },
  { id: "pvp_7", road: "Обход Одинцова", name: "17,7 км", lat: 55.641781, lon: 37.177788, system: "open", fee_day: 250 },
  // М-3 «Украина»
  { id: "pvp_8", road: "М-3 «Украина»", name: "136 км", lat: 54.867141, lon: 36.348148, system: "open", fee_day: 190 },
  { id: "pvp_9", road: "М-3 «Украина»", name: "168 км", lat: 54.617783, lon: 36.115197, system: "open", fee_day: 230 },
  { id: "pvp_85", road: "М-3 «Украина»", name: "86 км", lat: 55.296, lon: 36.725, system: "open", fee_day: 100 },
  // М-4 «Дон»
  { id: "pvp_10", road: "М-4 «Дон»", name: "62 км.", lat: 55.238722, lon: 37.870587, system: "open", fee_day: 220 },
  { id: "pvp_11", road: "М-4 «Дон»", name: "71 км.", lat: 55.168126, lon: 37.920031, system: "open", fee_day: 400 },
  { id: "pvp_12", road: "М-4 «Дон»", name: "133 км", lat: 54.694286, lon: 38.161397, system: "open", fee_day: 500 },
  { id: "pvp_13", road: "М-4 «Дон»", name: "228 км", lat: 53.878166, lon: 38.048577, system: "open", fee_day: 320 },
  { id: "pvp_14", road: "М-4 «Дон»", name: "322 км.", lat: 53.088916, lon: 38.169854, system: "open", fee_day: 320 },
  { id: "pvp_15", road: "М-4 «Дон»", name: "339 км.", lat: 52.931002, lon: 38.215354, system: "open", fee_day: 400 },
  { id: "pvp_16", road: "М-4 «Дон»", name: "355 км.", lat: 52.79799, lon: 38.31471, system: "open", fee_day: 220 },
  { id: "pvp_17", road: "М-4 «Дон»", name: "416 км.", lat: 52.430166, lon: 38.824653, system: "open", fee_day: 360 },
  { id: "pvp_18", road: "М-4 «Дон»", name: "460 км.", lat: 52.125634, lon: 39.195676, system: "open", fee_day: 360 },
  { id: "pvp_19", road: "М-4 «Дон»", name: "515 км.", lat: 51.663031, lon: 39.302283, system: "open", fee_day: 170 },
  { id: "pvp_20", road: "М-4 «Дон»", name: "545 км. (517-544 км)", lat: 51.470265, lon: 39.554491, system: "open", fee_day: 160 },
  { id: "pvp_86", road: "М-4 «Дон»", name: "545 км. (545-589 км)", lat: 51.52, lon: 39.98, system: "open", fee_day: 250 },
  { id: "pvp_21", road: "М-4 «Дон»", name: "620 км.", lat: 50.867029, lon: 39.976033, system: "open", fee_day: 250 },
  { id: "pvp_22", road: "М-4 «Дон»", name: "636 км.", lat: 50.750831, lon: 40.047448, system: "open", fee_day: 640 },
  { id: "pvp_23", road: "М-4 «Дон»", name: "672 км.", lat: 50.451522, lon: 40.167128, system: "open", fee_day: 440 },
  { id: "pvp_24", road: "М-4 «Дон»", name: "803 км.", lat: 49.373049, lon: 40.600474, system: "open", fee_day: 620 },
  { id: "pvp_25", road: "М-4 «Дон»", name: "911 км.", lat: 48.481335, lon: 40.340668, system: "open", fee_day: 250 },
  { id: "pvp_26", road: "М-4 «Дон»", name: "1046 км.", lat: 47.345806, lon: 39.949971, system: "open", fee_day: 450 },
  { id: "pvp_27", road: "М-4 «Дон»", name: "1093 км.", lat: 47.013196, lon: 39.733994, system: "open", fee_day: 150 },
  { id: "pvp_28", road: "М-4 «Дон»", name: "1184 км.", lat: 46.230444, lon: 39.831516, system: "open", fee_day: 350 },
  { id: "pvp_29", road: "М-4 «Дон»", name: "1223 км.", lat: 45.915535, lon: 39.709977, system: "open", fee_day: 500 },
  { id: "pvp_30", road: "М-4 «Дон»", name: "46 км. ДЗОК", lat: 45.127769, lon: 38.740454, system: "open", fee_day: 410 },
  // М-11 «Нева» (closed system, cumulative pricing)
  { id: "pvp_31", road: "М-11 «Нева»", name: "Москва 21 км.", lat: 55.935527, lon: 37.450416, system: "closed", fee_day: 1130 },
  { id: "pvp_87", road: "М-11 «Нева»", name: "36 км (Москва-ЦКАД)", lat: 56.06, lon: 37.25, system: "closed", fee_day: 880 },
  { id: "pvp_38", road: "М-11 «Нева»", name: "67 км.", lat: 56.138476, lon: 37.047376, system: "closed", fee_day: 100 },
  { id: "pvp_39", road: "М-11 «Нева»", name: "89 км.", lat: 56.16146, lon: 36.915137, system: "closed", fee_day: 260 },
  { id: "pvp_40", road: "М-11 «Нева»", name: "97 км.", lat: 56.298259, lon: 36.674386, system: "closed", fee_day: 350 },
  { id: "pvp_41", road: "М-11 «Нева»", name: "124 км.", lat: 56.360536, lon: 36.619573, system: "closed", fee_day: 570 },
  { id: "pvp_42", road: "М-11 «Нева»", name: "147 км.", lat: 56.571502, lon: 36.46885, system: "closed", fee_day: 750 },
  { id: "pvp_43", road: "М-11 «Нева»", name: "159 км.", lat: 56.829044, lon: 36.19128, system: "closed", fee_day: 850 },
  { id: "pvp_44", road: "М-11 «Нева»", name: "177 км.", lat: 56.932171, lon: 35.996077, system: "closed", fee_day: 1030 },
  { id: "pvp_45", road: "М-11 «Нева»", name: "209 км.", lat: 56.73368, lon: 36.252926, system: "closed", fee_day: 1380 },
  { id: "pvp_46", road: "М-11 «Нева»", name: "214 км.", lat: 56.955537, lon: 35.506864, system: "closed", fee_day: 1390 },
  { id: "pvp_47", road: "М-11 «Нева»", name: "258 км.", lat: 56.983502, lon: 35.430375, system: "closed", fee_day: 1620 },
  { id: "pvp_48", road: "М-11 «Нева»", name: "330 км.", lat: 57.225815, lon: 34.916475, system: "closed", fee_day: 2050 },
  { id: "pvp_49", road: "М-11 «Нева»", name: "348 км", lat: 57.70424, lon: 34.194666, system: "closed", fee_day: 2170 },
  { id: "pvp_88", road: "М-11 «Нева»", name: "385 км (Валдай)", lat: 57.97, lon: 33.25, system: "closed", fee_day: 2400 },
  { id: "pvp_50", road: "М-11 «Нева»", name: "402 км.", lat: 57.82831, lon: 34.026735, system: "closed", fee_day: 2490 },
  { id: "pvp_51", road: "М-11 «Нева»", name: "444 км.", lat: 58.206016, lon: 33.469282, system: "closed", fee_day: 2710 },
  { id: "pvp_52", road: "М-11 «Нева»", name: "524 км.", lat: 58.389753, lon: 32.970424, system: "closed", fee_day: 3200 },
  { id: "pvp_53", road: "М-11 «Нева»", name: "545 км.", lat: 58.691674, lon: 31.755279, system: "closed", fee_day: 3320 },
  { id: "pvp_54", road: "М-11 «Нева»", name: "647 км.", lat: 58.800201, lon: 31.4707, system: "closed", fee_day: 3890 },
  { id: "pvp_55", road: "М-11 «Нева»", name: "668 км.", lat: 59.571174, lon: 30.669357, system: "closed", fee_day: 4070 },
  { id: "pvp_56", road: "М-11 «Нева»", name: "679 км.", lat: 59.723634, lon: 30.508761, system: "closed", fee_day: 4200 },
  { id: "pvp_57", road: "М-11 «Нева»", name: "684 км. (Пулково)", lat: 59.775127, lon: 30.359991, system: "closed", fee_day: 220 },
  // А-113 ЦКАД (freeflow)
  { id: "pvp_58", road: "А-113 ЦКАД", name: "М10-М11 337 км.", lat: 56.090589, lon: 37.212958, system: "freeflow", fee_day: 43 },
  { id: "pvp_59", road: "А-113 ЦКАД", name: "М11-А107 49 км.", lat: 56.154263, lon: 37.347375, system: "freeflow", fee_day: 118 },
  { id: "pvp_60", road: "А-113 ЦКАД", name: "А107-М8 11 км.", lat: 56.127148, lon: 37.898667, system: "freeflow", fee_day: 359 },
  { id: "pvp_61", road: "А-113 ЦКАД", name: "М7-М8 81 км.", lat: 55.973389, lon: 38.3249, system: "freeflow", fee_day: 458 },
  { id: "pvp_62", road: "А-113 ЦКАД", name: "М7-М12 107 км.", lat: 55.838954, lon: 38.54039, system: "freeflow", fee_day: 40 },
  { id: "pvp_63", road: "А-113 ЦКАД", name: "Носовихинское-М12 111 км.", lat: 55.811856, lon: 38.563868, system: "freeflow", fee_day: 155 },
  { id: "pvp_64", road: "А-113 ЦКАД", name: "Егорьевское-Носовихинское 133 км.", lat: 55.65469, lon: 38.368718, system: "freeflow", fee_day: 80 },
  { id: "pvp_65", road: "А-113 ЦКАД", name: "М5-Егорьевское 150 км.", lat: 55.508343, lon: 38.403238, system: "freeflow", fee_day: 269 },
  { id: "pvp_66", road: "А-113 ЦКАД", name: "Домодедово-М5 193 км.", lat: 55.35113, lon: 37.942907, system: "freeflow", fee_day: 246 },
  { id: "pvp_67", road: "А-113 ЦКАД", name: "М4-Домодедово 196 км.", lat: 55.350258, lon: 37.895527, system: "freeflow", fee_day: 63 },
  { id: "pvp_68", road: "А-113 ЦКАД", name: "Калужское-М2 239 км.", lat: 55.394082, lon: 37.272688, system: "freeflow", fee_day: 139 },
  { id: "pvp_69", road: "А-113 ЦКАД", name: "Калужское-ПК5 252 км.", lat: 55.444897, lon: 37.139305, system: "freeflow", fee_day: 204 },
  { id: "pvp_70", road: "А-113 ЦКАД", name: "Звенигородское-М1 275 км.", lat: 55.630915, lon: 37.010892, system: "freeflow", fee_day: 92 },
  // М-12 «Восток» (closed system, cumulative pricing)
  { id: "pvp_71", road: "М-12 «Восток»", name: "Москва-Электроугли", lat: 55.826042, lon: 38.740223, system: "closed", fee_day: 170 },
  { id: "pvp_72", road: "М-12 «Восток»", name: "Москва-ЦКАД", lat: 56.061177, lon: 39.962768, system: "closed", fee_day: 500 },
  { id: "pvp_73", road: "М-12 «Восток»", name: "Москва-Орехово-Зуево (А108)", lat: 55.716209, lon: 38.075511, system: "closed", fee_day: 750 },
  { id: "pvp_74", road: "М-12 «Восток»", name: "Москва-Петушки", lat: 55.822641, lon: 38.4484, system: "closed", fee_day: 1130 },
  { id: "pvp_75", road: "М-12 «Восток»", name: "Москва-Владимир", lat: 55.826014, lon: 38.74025, system: "closed", fee_day: 1780 },
  { id: "pvp_76", road: "М-12 «Восток»", name: "Москва-Гусь-Хрустальный (Р132)", lat: 55.909207, lon: 39.28534, system: "closed", fee_day: 1940 },
  { id: "pvp_89", road: "М-12 «Восток»", name: "Москва-Муром", lat: 55.573, lon: 42.046, system: "closed", fee_day: 2300 },
  { id: "pvp_90", road: "М-12 «Восток»", name: "Москва-Арзамас", lat: 55.39, lon: 43.83, system: "closed", fee_day: 3100 },
  { id: "pvp_91", road: "М-12 «Восток»", name: "Москва-Канаш", lat: 55.51, lon: 47.49, system: "closed", fee_day: 4200 },
  { id: "pvp_92", road: "М-12 «Восток»", name: "Москва-Казань (Иннополис)", lat: 55.753, lon: 48.746, system: "closed", fee_day: 5250 },
  // М-12 обход Нижнекамска и Набережных Челнов (freeflow, тарифы с 22.03.2026)
  // Попарные: Нижнекамск↔Бегишево=278₽, Бегишево↔Челны=208₽, полный=486₽
  { id: "pvp_108", road: "М-12 Обход Нижнекамска/Челнов", name: "Обход Нижнекамска (Костенеево)", lat: 55.486, lon: 51.926, system: "freeflow", fee_day: 278 },
  { id: "pvp_109", road: "М-12 Обход Нижнекамска/Челнов", name: "Обход Челнов (Сосновый Бор)", lat: 55.561, lon: 52.260, system: "freeflow", fee_day: 208 },
  // ЗСД
  { id: "pvp_77", road: "ЗСД", name: "КАД(Юг)-Благодатная", lat: 60.128199, lon: 30.064685, system: "closed", fee_day: 300 },
  { id: "pvp_78", road: "ЗСД", name: "Благодатная-Макарова", lat: 60.018146, lon: 30.222526, system: "closed", fee_day: 300 },
  { id: "pvp_79", road: "ЗСД", name: "Макарова-Каменка", lat: 60.018458, lon: 30.223617, system: "closed", fee_day: 300 },
  { id: "pvp_80", road: "ЗСД", name: "Каменка-КАД(Север)", lat: 60.000567, lon: 30.231757, system: "closed", fee_day: 300 },
  { id: "pvp_106", road: "ЗСД", name: "КАД(Север)-Скандинавия", lat: 60.1, lon: 30.2, system: "closed", fee_day: 300 },
  { id: "pvp_107", road: "ЗСД", name: "Благодатная-Витебский пр.", lat: 59.862, lon: 30.321, system: "closed", fee_day: 300 },
  // Удмуртия
  { id: "pvp_82", road: "Платные дороги Удмуртии", name: "Мост через р. Кама", lat: 56.243516, lon: 54.123701, system: "open", fee_day: 380 },
  { id: "pvp_83", road: "Платные дороги Удмуртии", name: "Мост через р. Буй", lat: 56.228769, lon: 54.196663, system: "open", fee_day: 270 },
  // Рязань
  { id: "pvp_84", road: "Платная дорога в Рязани", name: "Путепровод Соколовка", lat: 54.58066, lon: 39.818601, system: "open", fee_day: 35 },
  // А-289 Краснодар-Крымский мост (новая платная дорога с 22.04.2025)
  { id: "pvp_94", road: "А-289 Краснодар-Крымский мост", name: "Краснодар-Славянск-на-Кубани", lat: 45.36, lon: 38.46, system: "freeflow", fee_day: 170 },
  { id: "pvp_95", road: "А-289 Краснодар-Крымский мост", name: "Славянск-на-Кубани-Темрюк", lat: 45.31, lon: 37.55, system: "freeflow", fee_day: 350 },
  { id: "pvp_96", road: "А-289 Краснодар-Крымский мост", name: "Темрюк-Крымский мост", lat: 45.27, lon: 36.75, system: "freeflow", fee_day: 800 },
  // МСД (Московский скоростной диаметр) — только пиковые часы будних дней
  { id: "pvp_97", road: "МСД", name: "Участок (пиковые часы)", lat: 55.79, lon: 37.73, system: "freeflow", fee_day: 19 },
  { id: "pvp_98", road: "МСД", name: "Транзит ЦКАД-МСД-ЦКАД", lat: 55.79, lon: 37.73, system: "freeflow", fee_day: 950 },
  // Проспект Багратиона (СДКП)
  { id: "pvp_99", road: "Проспект Багратиона", name: "МКАД - Москва-Сити", lat: 55.747, lon: 37.406, system: "freeflow", fee_day: 690 },
  // Мытищинская хорда
  { id: "pvp_100", road: "Мытищинская хорда", name: "Виноградово-Болтино-Тарасовка", lat: 55.93, lon: 37.76, system: "freeflow", fee_day: 238 },
]

export function calculateTollCost(routePoints: [number, number][]): {
  totalCost: number
  tolls: { id: string; road: string; name: string; fee: number }[]
} {
  // 1. Walk route and collect passed PVPs in traversal order
  const passedTolls: TollPoint[] = []
  const passedIds = new Set<string>()

  for (const [lat, lon] of routePoints) {
    for (const toll of TOLL_POINTS) {
      if (passedIds.has(toll.id)) continue
      if (
        Math.abs(lat - toll.lat) < 0.003 &&
        Math.abs(lon - toll.lon) < 0.004
      ) {
        passedTolls.push(toll)
        passedIds.add(toll.id)
      }
    }
  }

  // 2. Group by road
  const roadGroups = new Map<string, TollPoint[]>()
  for (const toll of passedTolls) {
    const group = roadGroups.get(toll.road) || []
    group.push(toll)
    roadGroups.set(toll.road, group)
  }

  // 3. Compute cost per road and build display list
  let totalCost = 0
  const tolls: { id: string; road: string; name: string; fee: number }[] = []

  for (const [road, roadTolls] of roadGroups) {
    const system = roadTolls[0].system

    if (system === 'open' || system === 'freeflow') {
      // Each PVP — independent payment
      for (const t of roadTolls) {
        totalCost += t.fee_day
        tolls.push({ id: t.id, road: t.road, name: t.name, fee: t.fee_day })
      }
    } else {
      // Closed system (M-11, M-12, ZSD): fee_day is cumulative entry→exit
      const fees = roadTolls.map(t => t.fee_day)
      const maxFee = Math.max(...fees)
      const minFee = Math.min(...fees)

      let roadCost: number
      if (maxFee === minFee) {
        // Uniform pricing (ZSD): each PVP = section boundary
        roadCost = Math.ceil(roadTolls.length / 2) * maxFee
      } else if (roadTolls.length === 1) {
        roadCost = maxFee
      } else {
        // Variable pricing (M-11, M-12): cost = exit_fee - entry_fee
        roadCost = maxFee - minFee
      }

      totalCost += roadCost

      // Show as single combined entry: entry → exit
      const first = roadTolls[0]
      const last = roadTolls[roadTolls.length - 1]
      const name = first.id === last.id ? first.name : `${first.name} → ${last.name}`
      tolls.push({ id: first.id, road, name, fee: roadCost })
    }
  }

  return { totalCost, tolls }
}
