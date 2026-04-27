// СВО-специфичные данные. На время hot-fix-а лежат в коде; позже мигрируют в БД (10 новых полей destinations).
// Источник: docs/svo_redesign/data/{02_kpp_directory.json, 03_seed_donetsk_PRIORITY.json}

export const SVO_TRUST_FACTS = {
  yearsInRegion: 8,
  tripsCompleted: 500,
  dispatcher24_7: true,
} as const

export interface KppInfo {
  name: string
  fullName: string
  region: string // ДНР / ЛНР / Запорожская обл. / Херсонская обл.
  passageHours: string
  lat: number
  lng: number
}

export const KPP_BY_DESTINATION_SLUG: Record<string, KppInfo> = {
  donetsk: { name: 'Куйбышево', fullName: 'МАПП Куйбышево', region: 'ДНР', passageHours: '2-4 часа', lat: 47.730, lng: 38.892 },
  makeevka: { name: 'Куйбышево', fullName: 'МАПП Куйбышево', region: 'ДНР', passageHours: '2-4 часа', lat: 47.730, lng: 38.892 },
  gorlovka: { name: 'Куйбышево', fullName: 'МАПП Куйбышево', region: 'ДНР', passageHours: '2-4 часа', lat: 47.730, lng: 38.892 },
  yenakievo: { name: 'Куйбышево', fullName: 'МАПП Куйбышево', region: 'ДНР', passageHours: '2-4 часа', lat: 47.730, lng: 38.892 },
  starobeshevo: { name: 'Куйбышево', fullName: 'МАПП Куйбышево', region: 'ДНР', passageHours: '2-4 часа', lat: 47.730, lng: 38.892 },
  snezhnoe: { name: 'Куйбышево', fullName: 'МАПП Куйбышево', region: 'ДНР', passageHours: '2-4 часа', lat: 47.730, lng: 38.892 },

  lugansk: { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },
  alchevsk: { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },
  stahanov: { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },
  bryanka: { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },
  antracit: { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },
  sverdlovsk: { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },
  rovenki: { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },
  'krasnyy-luch': { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },
  kamenka: { name: 'Изварино', fullName: 'МАПП Изварино', region: 'ЛНР', passageHours: '1-3 часа', lat: 48.181, lng: 39.855 },

  krasnodon: { name: 'Гуково', fullName: 'МАПП Гуково', region: 'ЛНР', passageHours: '1-2 часа', lat: 48.014, lng: 39.937 },

  starobilsk: { name: 'Чертково-Меловое', fullName: 'МАПП Чертково', region: 'ЛНР (север)', passageHours: '2-4 часа', lat: 49.378, lng: 40.101 },
  starobelsk: { name: 'Чертково-Меловое', fullName: 'МАПП Чертково', region: 'ЛНР (север)', passageHours: '2-4 часа', lat: 49.378, lng: 40.101 },
  severodonetsk: { name: 'Чертково-Меловое', fullName: 'МАПП Чертково', region: 'ЛНР (север)', passageHours: '2-4 часа', lat: 49.378, lng: 40.101 },
  rubezhnoe: { name: 'Чертково-Меловое', fullName: 'МАПП Чертково', region: 'ЛНР (север)', passageHours: '2-4 часа', lat: 49.378, lng: 40.101 },

  mariupol: { name: 'Весело-Вознесенка', fullName: 'МАПП Весело-Вознесенка', region: 'Запорожская обл./ДНР', passageHours: '2-4 часа', lat: 47.052, lng: 38.213 },
  melitopol: { name: 'Весело-Вознесенка', fullName: 'МАПП Весело-Вознесенка', region: 'Запорожская обл.', passageHours: '2-4 часа', lat: 47.052, lng: 38.213 },
  berdyansk: { name: 'Весело-Вознесенка', fullName: 'МАПП Весело-Вознесенка', region: 'Запорожская обл.', passageHours: '2-4 часа', lat: 47.052, lng: 38.213 },

  tokmak: { name: 'Джанкой (Чонгар)', fullName: 'МАПП Чонгар', region: 'Запорожская обл.', passageHours: '1-3 часа', lat: 46.063, lng: 34.474 },
  kahovka: { name: 'Джанкой (Чонгар)', fullName: 'МАПП Чонгар', region: 'Херсонская обл.', passageHours: '1-3 часа', lat: 46.063, lng: 34.474 },
}

export const SVO_DOCUMENTS = [
  'Паспорт РФ или загранпаспорт (для иностранных граждан + миграционная карта)',
  'Цель визита: приглашение или официальное основание принимающей стороны',
  'Контактные данные принимающей стороны в регионе',
  'Для несовершеннолетних — нотариальное согласие родителей',
  'Полис ОМС/ДМС (рекомендуется)',
] as const

export const SVO_SAFETY_FEATURES = [
  'Связь с диспетчером 24/7 — родственники получают локацию пассажира на ключевых точках',
  'Водители работают по ДНР/ЛНР с до-СВО — знание региона 8+ лет',
  'Информирование пассажира о текущей обстановке перед выездом',
  'Знание актуальных требований КПП (документы, время работы)',
  'Помощь с заполнением документов на КПП',
  'При закрытии КПП — оперативная связь с диспетчером и проработка вариантов индивидуально',
] as const

// 8 СВО-FAQ. Без формулировок «гарантия» — по правке от пользователя.
export const SVO_FAQ = [
  {
    question: 'Можно ли проехать сейчас в этот город?',
    answer: 'Маршрут работает регулярно. Текущую обстановку по КПП и режим работы диспетчер уточняет в день поездки и сообщает вам перед выездом.',
  },
  {
    question: 'Какие документы нужны для въезда?',
    answer: 'Паспорт РФ, цель визита (приглашение или основание), контактные данные принимающей стороны. Для несовершеннолетних — нотариальное согласие родителей. Полный список и помощь с оформлением — у диспетчера.',
  },
  {
    question: 'Что если КПП закроется в день поездки?',
    answer: 'Диспетчер заранее предупреждает об изменениях. Если выезд уже состоялся — связываемся с водителем, прорабатываем варианты индивидуально: объезд, перенос времени или возврат.',
  },
  {
    question: 'Кто водитель — есть ли опыт в зоне?',
    answer: 'Наши водители работали по ДНР/ЛНР до начала СВО — регион знают давно. С СВО мы покрываем все актуальные маршруты в новых регионах. Опыт прохождения КПП регулярный.',
  },
  {
    question: 'Возите ли военнослужащих, журналистов, гуманитарных работников?',
    answer: 'Да, всех категорий. Для журналистов — нужна аккредитация. Для гуманитарной помощи — список перевозимых вещей по таможенным правилам. Для родственников военнослужащих — поездки в зону и обратно.',
  },
  {
    question: 'Какая страховка действует?',
    answer: 'Стандартное страхование пассажиров и КАСКО автомобиля. Особые условия зоны СВО уточняются при бронировании — диспетчер предоставит актуальную информацию.',
  },
  {
    question: 'Можно ли с детьми, животными, большим багажом?',
    answer: 'Да. Детское кресло предоставляется бесплатно по запросу. Для животных — согласовать с диспетчером, нужны ветеринарные документы. Багаж по правилам перевозчика.',
  },
  {
    question: 'Как оплачивается поездка?',
    answer: 'Наличные водителю, карта, СБП, безналичный расчёт для юрлиц с НДС. Предоплата не обязательна, но возможна частичная при бронировании дальних маршрутов по согласованию.',
  },
] as const

export interface RouteStage {
  name: string
  hours: number
  distanceKm: number
  details: string
}

// Шаблон этапов: точные значения собираются по KPP и destination.
export function buildRouteStages(destSlug: string, destName: string, distanceKm: number): RouteStage[] {
  const kpp = KPP_BY_DESTINATION_SLUG[destSlug]
  if (!kpp) {
    return [
      { name: 'От точки отправления до пограничной зоны', hours: Math.max(1, Math.round(distanceKm / 80)), distanceKm: Math.round(distanceKm * 0.85), details: 'Основной участок по федеральной трассе. Остановки на АЗС каждые 200-300 км.' },
      { name: `Прохождение КПП`, hours: 2, distanceKm: 0, details: 'Российский паспортный контроль и таможенная проверка.' },
      { name: `КПП — ${destName}`, hours: 1, distanceKm: Math.round(distanceKm * 0.15), details: 'Финальный участок по территории региона.' },
    ]
  }
  const passHrs = kpp.passageHours.includes('-') ? Number(kpp.passageHours.split('-')[1].split(' ')[0]) : 2
  return [
    { name: 'До пограничной зоны (Ростов / Белгород)', hours: Math.max(2, Math.round(distanceKm / 80) - passHrs - 1), distanceKm: Math.round(distanceKm * 0.85), details: 'Основной участок по федеральной трассе. Остановки на АЗС.' },
    { name: `Прохождение ${kpp.fullName}`, hours: passHrs, distanceKm: 0, details: 'Российский паспортный контроль и таможенная проверка, далее пограничная служба региона.' },
    { name: `КПП — ${destName}`, hours: 1, distanceKm: Math.round(distanceKm * 0.15), details: 'Финальный участок по территории региона.' },
  ]
}

export const SVO_REGION_BY_DEST: Record<string, string> = {
  donetsk: 'ДНР', makeevka: 'ДНР', gorlovka: 'ДНР', yenakievo: 'ДНР', starobeshevo: 'ДНР', snezhnoe: 'ДНР',
  lugansk: 'ЛНР', alchevsk: 'ЛНР', stahanov: 'ЛНР', bryanka: 'ЛНР', antracit: 'ЛНР', sverdlovsk: 'ЛНР', rovenki: 'ЛНР', 'krasnyy-luch': 'ЛНР', kamenka: 'ЛНР', krasnodon: 'ЛНР',
  starobilsk: 'ЛНР', starobelsk: 'ЛНР', severodonetsk: 'ЛНР', rubezhnoe: 'ЛНР',
  mariupol: 'ДНР', melitopol: 'Запорожская обл.', berdyansk: 'Запорожская обл.',
  tokmak: 'Запорожская обл.', kahovka: 'Херсонская обл.',
}
