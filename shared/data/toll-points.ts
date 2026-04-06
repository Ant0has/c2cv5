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
  // === Платные дороги в Псковской области ===
  { id: "pvp_0", road: "Платные дороги в Псковской области", name: "Остров-Вышгородок", lat: 57.8317, lon: 27.59979, system: "open", fee_day: 300 },
  // === М-1 Беларусь ===
  { id: "pvp_1", road: "М-1 Беларусь", name: "46 км.", lat: 55.600077, lon: 36.980367, system: "open", fee_day: 200 },
  // === «Северный обход Одинцова» на М1 ===
  { id: "pvp_2", road: "«Северный обход Одинцова» на М1", name: "4,6 км А", lat: 55.718774, lon: 37.314234, system: "open", fee_day: 100 },
  { id: "pvp_3", road: "«Северный обход Одинцова» на М1", name: "4,6 км Б", lat: 55.710443, lon: 37.317236, system: "open", fee_day: 100 },
  { id: "pvp_4", road: "«Северный обход Одинцова» на М1", name: "6,9 км.", lat: 55.697712, lon: 37.29393, system: "open", fee_day: 350 },
  { id: "pvp_5", road: "«Северный обход Одинцова» на М1", name: "13,4 км из МСК", lat: 55.662717, lon: 37.223681, system: "open", fee_day: 100 },
  { id: "pvp_6", road: "«Северный обход Одинцова» на М1", name: "13,4 в МСК", lat: 55.66283, lon: 37.22456, system: "open", fee_day: 100 },
  { id: "pvp_7", road: "«Северный обход Одинцова» на М1", name: "17,7 км", lat: 55.641781, lon: 37.177788, system: "open", fee_day: 250 },
  // === М-3 «Украина» ===
  { id: "pvp_8", road: "М-3 «Украина»", name: "136 км", lat: 54.867141, lon: 36.348148, system: "open", fee_day: 110 },
  { id: "pvp_9", road: "М-3 «Украина»", name: "168 км", lat: 54.617783, lon: 36.115197, system: "open", fee_day: 170 },
  // === М-4 «Дон» ===
  { id: "pvp_10", road: "М-4 «Дон»", name: "62 км.", lat: 55.238722, lon: 37.870587, system: "open", fee_day: 200 },
  { id: "pvp_11", road: "М-4 «Дон»", name: "71 км.", lat: 55.168126, lon: 37.920031, system: "open", fee_day: 280 },
  { id: "pvp_12", road: "М-4 «Дон»", name: "133 км", lat: 54.694286, lon: 38.161397, system: "open", fee_day: 380 },
  { id: "pvp_13", road: "М-4 «Дон»", name: "228 км", lat: 53.878166, lon: 38.048577, system: "open", fee_day: 240 },
  { id: "pvp_14", road: "М-4 «Дон»", name: "322 км.", lat: 53.088916, lon: 38.169854, system: "open", fee_day: 240 },
  { id: "pvp_15", road: "М-4 «Дон»", name: "339 км.", lat: 52.931002, lon: 38.215354, system: "open", fee_day: 340 },
  { id: "pvp_16", road: "М-4 «Дон»", name: "355 км.", lat: 52.79799, lon: 38.31471, system: "open", fee_day: 190 },
  { id: "pvp_17", road: "М-4 «Дон»", name: "416 км.", lat: 52.430166, lon: 38.824653, system: "open", fee_day: 210 },
  { id: "pvp_18", road: "М-4 «Дон»", name: "460 км.", lat: 52.125634, lon: 39.195676, system: "open", fee_day: 210 },
  { id: "pvp_19", road: "М-4 «Дон»", name: "515 км.", lat: 51.663031, lon: 39.302283, system: "open", fee_day: 130 },
  { id: "pvp_20", road: "М-4 «Дон»", name: "545 км. (517 км - 544 км)", lat: 51.470265, lon: 39.554491, system: "open", fee_day: 130 },
  { id: "pvp_21", road: "М-4 «Дон»", name: "620 км.", lat: 50.867029, lon: 39.976033, system: "open", fee_day: 160 },
  { id: "pvp_22", road: "М-4 «Дон»", name: "636 км.", lat: 50.750831, lon: 40.047448, system: "open", fee_day: 530 },
  { id: "pvp_23", road: "М-4 «Дон»", name: "672 км.", lat: 50.451522, lon: 40.167128, system: "open", fee_day: 330 },
  { id: "pvp_24", road: "М-4 «Дон»", name: "803 км.", lat: 49.373049, lon: 40.600474, system: "open", fee_day: 520 },
  { id: "pvp_25", road: "М-4 «Дон»", name: "911 км.", lat: 48.481335, lon: 40.340668, system: "open", fee_day: 170 },
  { id: "pvp_26", road: "М-4 «Дон»", name: "1046 км.", lat: 47.345806, lon: 39.949971, system: "open", fee_day: 360 },
  { id: "pvp_27", road: "М-4 «Дон»", name: "1093 км.", lat: 47.013196, lon: 39.733994, system: "open", fee_day: 130 },
  { id: "pvp_28", road: "М-4 «Дон»", name: "1184 км.", lat: 46.230444, lon: 39.831516, system: "open", fee_day: 270 },
  { id: "pvp_29", road: "М-4 «Дон»", name: "1223 км.", lat: 45.915535, lon: 39.709977, system: "open", fee_day: 360 },
  { id: "pvp_30", road: "М-4 «Дон»", name: "46 км. ДЗОК", lat: 45.127769, lon: 38.740454, system: "open", fee_day: 380 },
  // === М-11 «Нева» ===
  { id: "pvp_31", road: "М-11 «Нева»", name: "Москва 21 км.", lat: 55.935527, lon: 37.450416, system: "closed", fee_day: 460 },
  { id: "pvp_32", road: "М-11 «Нева»", name: "\"Шереметьево-2\" 24 км.", lat: 55.955992, lon: 37.420344, system: "closed", fee_day: 460 },
  { id: "pvp_33", road: "М-11 «Нева»", name: "\"Шереметьево-1\" 28 км.", lat: 55.955987, lon: 37.420221, system: "closed", fee_day: 100 },
  { id: "pvp_34", road: "М-11 «Нева»", name: "\" Зеленоград\" 36 км.", lat: 55.960714, lon: 37.365178, system: "closed", fee_day: 800 },
  { id: "pvp_35", road: "М-11 «Нева»", name: "\"ММК Юг\" 48 км.", lat: 56.006817, lon: 37.282321, system: "closed", fee_day: 190 },
  { id: "pvp_36", road: "М-11 «Нева»", name: "\"ММК Север\" 50 км.", lat: 56.096833, lon: 37.185131, system: "closed", fee_day: 190 },
  { id: "pvp_37", road: "М-11 «Нева»", name: "\"Солнечногорск\" 58 км.", lat: 56.100122, lon: 37.162792, system: "closed", fee_day: 1030 },
  { id: "pvp_38", road: "М-11 «Нева»", name: "67 км.", lat: 56.138476, lon: 37.047376, system: "closed", fee_day: 60 },
  { id: "pvp_39", road: "М-11 «Нева»", name: "89 км.", lat: 56.16146, lon: 36.915137, system: "closed", fee_day: 170 },
  { id: "pvp_40", road: "М-11 «Нева»", name: "97 км.", lat: 56.298259, lon: 36.674386, system: "closed", fee_day: 240 },
  { id: "pvp_41", road: "М-11 «Нева»", name: "124 км.", lat: 56.360536, lon: 36.619573, system: "closed", fee_day: 400 },
  { id: "pvp_42", road: "М-11 «Нева»", name: "147 км.", lat: 56.571502, lon: 36.46885, system: "closed", fee_day: 540 },
  { id: "pvp_43", road: "М-11 «Нева»", name: "159 км.", lat: 56.829044, lon: 36.19128, system: "closed", fee_day: 630 },
  { id: "pvp_44", road: "М-11 «Нева»", name: "177 км.", lat: 56.932171, lon: 35.996077, system: "closed", fee_day: 800 },
  { id: "pvp_45", road: "М-11 «Нева»", name: "209 км.", lat: 56.73368, lon: 36.252926, system: "closed", fee_day: 1120 },
  { id: "pvp_46", road: "М-11 «Нева»", name: "214 км.", lat: 56.955537, lon: 35.506864, system: "closed", fee_day: 1130 },
  { id: "pvp_47", road: "М-11 «Нева»", name: "258 км.", lat: 56.983502, lon: 35.430375, system: "closed", fee_day: 1340 },
  { id: "pvp_48", road: "М-11 «Нева»", name: "330 км.", lat: 57.225815, lon: 34.916475, system: "closed", fee_day: 1740 },
  { id: "pvp_49", road: "М-11 «Нева»", name: "348 км", lat: 57.70424, lon: 34.194666, system: "closed", fee_day: 1850 },
  { id: "pvp_50", road: "М-11 «Нева»", name: "402 км.", lat: 57.82831, lon: 34.026735, system: "closed", fee_day: 2140 },
  { id: "pvp_51", road: "М-11 «Нева»", name: "444 км.", lat: 58.206016, lon: 33.469282, system: "closed", fee_day: 2340 },
  { id: "pvp_52", road: "М-11 «Нева»", name: "524 км.", lat: 58.389753, lon: 32.970424, system: "closed", fee_day: 2780 },
  { id: "pvp_53", road: "М-11 «Нева»", name: "545 км.", lat: 58.691674, lon: 31.755279, system: "closed", fee_day: 2880 },
  { id: "pvp_54", road: "М-11 «Нева»", name: "647 км.", lat: 58.800201, lon: 31.4707, system: "closed", fee_day: 3290 },
  { id: "pvp_55", road: "М-11 «Нева»", name: "668 км.", lat: 59.571174, lon: 30.669357, system: "closed", fee_day: 3460 },
  { id: "pvp_56", road: "М-11 «Нева»", name: "679 км.", lat: 59.723634, lon: 30.508761, system: "closed", fee_day: 3550 },
  { id: "pvp_57", road: "М-11 «Нева»", name: "684 км.", lat: 59.775127, lon: 30.359991, system: "closed", fee_day: 220 },
  // === А-113 ЦКАД ===
  { id: "pvp_58", road: "А-113 ЦКАД", name: "М10 -М11         337 км.", lat: 56.090589, lon: 37.212958, system: "freeflow", fee_day: 37 },
  { id: "pvp_59", road: "А-113 ЦКАД", name: "М11- А107         49 км.", lat: 56.154263, lon: 37.347375, system: "freeflow", fee_day: 103 },
  { id: "pvp_60", road: "А-113 ЦКАД", name: "А107 -М8           11 км.", lat: 56.127148, lon: 37.898667, system: "freeflow", fee_day: 312 },
  { id: "pvp_61", road: "А-113 ЦКАД", name: "М7 -М8           81 км.", lat: 55.973389, lon: 38.3249, system: "freeflow", fee_day: 398 },
  { id: "pvp_62", road: "А-113 ЦКАД", name: "М7-М12        107 км.", lat: 55.838954, lon: 38.54039, system: "freeflow", fee_day: 35 },
  { id: "pvp_63", road: "А-113 ЦКАД", name: "Носових. - М 12       111 км.", lat: 55.811856, lon: 38.563868, system: "freeflow", fee_day: 135 },
  { id: "pvp_64", road: "А-113 ЦКАД", name: "Егор. - Носових.          133 км.", lat: 55.65469, lon: 38.368718, system: "freeflow", fee_day: 70 },
  { id: "pvp_65", road: "А-113 ЦКАД", name: "М5 - Егор.              150 км.", lat: 55.508343, lon: 38.403238, system: "freeflow", fee_day: 234 },
  { id: "pvp_66", road: "А-113 ЦКАД", name: "Домод. - М5       193 км.", lat: 55.35113, lon: 37.942907, system: "freeflow", fee_day: 214 },
  { id: "pvp_67", road: "А-113 ЦКАД", name: "М4 - Домод.         196 км.", lat: 55.350258, lon: 37.895527, system: "freeflow", fee_day: 55 },
  { id: "pvp_68", road: "А-113 ЦКАД", name: "Калуж. -М2          239 км.", lat: 55.394082, lon: 37.272688, system: "freeflow", fee_day: 121 },
  { id: "pvp_69", road: "А-113 ЦКАД", name: "Калуж. - ПК5          252 км.", lat: 55.444897, lon: 37.139305, system: "freeflow", fee_day: 177 },
  { id: "pvp_70", road: "А-113 ЦКАД", name: "Звениг. - М1         275 км.", lat: 55.630915, lon: 37.010892, system: "freeflow", fee_day: 80 },
  // === М-12 «Москва-Казань» ===
  { id: "pvp_71", road: "М-12 «Москва-Казань»", name: "Москва-Электроугли", lat: 55.826042, lon: 38.740223, system: "closed", fee_day: 153 },
  { id: "pvp_72", road: "М-12 «Москва-Казань»", name: "Москва-ЦКАД", lat: 56.061177, lon: 39.962768, system: "closed", fee_day: 458 },
  { id: "pvp_73", road: "М-12 «Москва-Казань»", name: "Москва-Орехово-Зуево(А108)", lat: 55.716209, lon: 38.075511, system: "closed", fee_day: 689 },
  { id: "pvp_74", road: "М-12 «Москва-Казань»", name: "Москва-Петушки", lat: 55.822641, lon: 38.4484, system: "closed", fee_day: 1036 },
  { id: "pvp_75", road: "М-12 «Москва-Казань»", name: "Москва-Владимир", lat: 55.826014, lon: 38.74025, system: "closed", fee_day: 1633 },
  { id: "pvp_76", road: "М-12 «Москва-Казань»", name: "Москва-Гусь-Хрустальный(Р132)", lat: 55.909207, lon: 39.28534, system: "closed", fee_day: 1783 },
  // === ЗСД ===
  { id: "pvp_77", road: "ЗСД", name: "КАД(ЮГ)-ул. Благодатная", lat: 60.128199, lon: 30.064685, system: "closed", fee_day: 300 },
  { id: "pvp_78", road: "ЗСД", name: "ул. Благодатная-наб,Макарова", lat: 60.018146, lon: 30.222526, system: "closed", fee_day: 300 },
  { id: "pvp_79", road: "ЗСД", name: "наб.Макарова-Перспективная развязка ЗСД с дорогой на Каменку", lat: 60.018458, lon: 30.223617, system: "closed", fee_day: 300 },
  { id: "pvp_80", road: "ЗСД", name: "Перспектиная развязка ЗСД-КАД(Север)", lat: 60.000567, lon: 30.231757, system: "closed", fee_day: 300 },
  { id: "pvp_81", road: "ЗСД", name: "КАД(Север)-Е-18\"Скандинавия\"", lat: 60.000564, lon: 30.233011, system: "closed", fee_day: 300 },
  // === Платные дороги Удмуртии ===
  { id: "pvp_82", road: "Платные дороги Удмуртии", name: "мост через р. Кама", lat: 56.243516, lon: 54.123701, system: "open", fee_day: 380 },
  { id: "pvp_83", road: "Платные дороги Удмуртии", name: "мост через р. Буй", lat: 56.228769, lon: 54.196663, system: "open", fee_day: 270 },
  // === Платная дорога в Рязани ===
  { id: "pvp_84", road: "Платная дорога в Рязани", name: "Путепровод Соколовка", lat: 54.58066, lon: 39.818601, system: "open", fee_day: 35 },
]

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
