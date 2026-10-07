import { SERVICE_POLICY } from '@/shared/configs/service-policy'
import { requisitsData } from '@/shared/data/requisits.data'

// SEO-текст разбит на секции с подзаголовками (H3) — легче читать, лучше SEO
export const ROOT_SEO_SECTIONS = [
  {
    title: 'Что такое «такси межгород»',
    body: `Это не городской счётчик и не «поехали куда скажете». Это поездка между двумя конкретными городами с заранее известной ценой, подачей к подъезду и машиной, которая принадлежит вам на время дороги. Ни с кем не делим маршрут, не ждём попутчиков, не заезжаем за третьим пассажиром.`,
  },
  {
    title: 'География работы',
    body: `Возим из десятков городов России — от Калининграда до Южно-Сахалинска. Каждый город — это точка отправления: десятки направлений в соседние региональные центры, трансферы в московские и петербургские аэропорты, поездки к морю (Сочи, Крым, Абхазия, Анапа), на горнолыжные курорты Кавказа, по рабочим маршрутам в СВО и на вахты. Новые направления добавляем по запросу — если в справочнике нужного маршрута нет, позвоните, чаще всего возим.`,
  },
  {
    title: 'Цена фиксированная',
    body: SERVICE_POLICY.price,
  },
  {
    title: 'Чем отличаемся от альтернатив',
    body: `Автомобиль подаётся к согласованному адресу и довозит до нужной точки, без поиска попутчиков и пересадок. Маршрут и необходимые остановки обсуждаем заранее. ${SERVICE_POLICY.baggage}`,
  },
  {
    title: 'Оплата и документы',
    body: `Для бизнеса — договор, безналичный расчёт и закрывающие документы. Способ оплаты и состав документов согласуем при заказе. ${SERVICE_POLICY.availability} ${SERVICE_POLICY.waiting}`,
  },
]

// Для обратной совместимости
export const ROOT_SEO_TEXT = ROOT_SEO_SECTIONS.map(s => s.body).join('\n\n')

// Trust-показатели (выводятся в hero и отдельным trust-bar)
export const TRUST_STATS = {
  rating: 4.8,
  reviewsCount: 4280,
  totalTrips: 12847,
  yearsOnMarket: 10, // Первые перевозки в апреле 2016 года; подтверждено владельцем 07.10.2026.
  driversCount: 220,
  tripsToday: 47, // обновляется в клиенте через setInterval для «live»-эффекта
}

// «Как заказать» — 3 шага
export const ORDER_STEPS = [
  {
    num: '1',
    title: 'Рассчитайте стоимость',
    description: 'Укажите города отправления и назначения в калькуляторе. Цена по 4 классам авто появится за 2 секунды.',
  },
  {
    num: '2',
    title: 'Подтвердите заказ',
    description: SERVICE_POLICY.callback,
  },
  {
    num: '3',
    title: 'Едьте',
    description: SERVICE_POLICY.driver,
  },
]

// Юридическая информация (для блока «Документы и реквизиты»)
export const LEGAL_INFO = {
  entity: requisitsData.NAME,
  inn: requisitsData.INN,
  ogrnip: requisitsData.OGRNIP,
  documentsNote: `${SERVICE_POLICY.started}. Для юридических лиц — договор, безналичный расчёт и закрывающие документы. Состав документов согласуем при заказе.`,
}

export const ROOT_ADVANTAGES = [
  { title: 'Цена согласована заранее', description: 'Фиксируем стоимость для согласованных условий. Дополнительные заезды, ожидание и платные дороги обсуждаем при заказе.' },
  { title: 'Машина для вашей компании', description: 'Без попутчиков. Количество пассажиров, багаж и остановки согласуем заранее.' },
  { title: 'Срочная подача от 30 минут', description: 'Возможность срочной поездки и точное время подачи подтверждает диспетчер.' },
  { title: 'Поездки в любое время суток', description: SERVICE_POLICY.availability },
  { title: 'Четыре класса автомобилей', description: 'Комфорт, Комфорт+, Бизнес, Минивэн. Выбираете под пассажиров и багаж.' },
  { title: 'Документы для бизнеса', description: 'Безнал с НДС, ЭДО, договор. Ездите — сдаёте в бухгалтерию как обычную командировку.' },
]

export const ROOT_FAQ = [
  {
    question: 'В каких городах работает City2City?',
    answer: 'Возим из десятков городов России — крупные региональные центры и часть районных. Полный список отправлений — в каталоге на этой странице. Если нужного города нет в списке, позвоните по +7 (938) 156-87-57 — возможно, маршрут есть, просто ещё не добавили на сайт.',
  },
  {
    question: 'Как рассчитывается цена поездки?',
    answer: SERVICE_POLICY.price,
  },
  {
    question: 'Можно ли заказать на сегодня или прямо сейчас?',
    answer: SERVICE_POLICY.driver,
  },
  {
    question: 'Сколько можно ждать бесплатно при подаче и задержке рейса?',
    answer: SERVICE_POLICY.waiting,
  },
  {
    question: 'Можно ли поехать с ребёнком?',
    answer: SERVICE_POLICY.children,
  },
  {
    question: 'Как согласовать багаж и длинные вещи?',
    answer: SERVICE_POLICY.baggage,
  },
  {
    question: 'Как оплачивается поездка?',
    answer: 'Наличные, карта водителю по терминалу, онлайн-оплата картой или СБП перед поездкой, безналичный расчёт с юрлицами. Чек по запросу — электронный или бумажный. Для бизнеса — НДС в счёте.',
  },
  {
    question: 'Это такси или трансфер? В чём разница?',
    answer: 'Формально — это междугородняя перевозка по фиксированной цене. «Такси межгород» — привычное название запроса; по сути ближе к заказному трансферу: конкретная точка А, конкретная точка Б, заранее известная цена. От городского такси отличается тем, что мы не берём поездки внутри города и не включаем счётчик — только междугородние маршруты.',
  },
  {
    question: 'Работаете ли с ИП и юрлицами?',
    answer: 'Да. Заключаем договор, предоставляем закрывающие документы, работаем по ЭДО (Диадок, СБИС, Контур). Счета с НДС и без, на выбор. Для корпоративных клиентов — безлимитная постоплата, выделенный менеджер, единый счёт в конце месяца. Подробнее на странице /dlya-biznesa.',
  },
]

export interface PopularRoute {
  title: string
  url: string
  distanceKm: number
  priceComfort: number  // ₽ за комфорт-класс
  timeH: number          // часов в пути (приблизительно, distance / 80 + остановки)
}

// Published route-price snapshot, CRM revision 1, refreshed 2026-09-11.
// Refresh these examples together with route publications.
export const POPULAR_ROUTES: PopularRoute[] = [
  { title: 'Москва — Казань', url: '/moskva-kazan.html', distanceKm: 840, priceComfort: 28500, timeH: 12.0 },
  { title: 'Санкт-Петербург — Москва', url: '/sankt-peterburg-moskva.html', distanceKm: 720, priceComfort: 24500, timeH: 10.5 },
  { title: 'Белгород — Москва', url: '/mezhgorod/belgorod/moskva', distanceKm: 670, priceComfort: 22500, timeH: 9.5 },
  { title: 'Воронеж — Москва', url: '/mezhgorod/voronezh/moskva', distanceKm: 520, priceComfort: 17500, timeH: 7.5 },
  { title: 'Самара — Казань', url: '/samara-kazan.html', distanceKm: 370, priceComfort: 12000, timeH: 5.5 },
  { title: 'Ярославль — Москва', url: '/mezhgorod/yaroslavl/moskva', distanceKm: 270, priceComfort: 9500, timeH: 4.0 },
  { title: 'Екатеринбург — Челябинск', url: '/ekaterinburg-chelyabinsk.html', distanceKm: 220, priceComfort: 8000, timeH: 3.0 },
  { title: 'Владимир — Москва', url: '/mezhgorod/vladimir/moskva', distanceKm: 200, priceComfort: 8000, timeH: 3.0 },
  { title: 'Москва — Тула', url: '/moskva-tula.html', distanceKm: 190, priceComfort: 7500, timeH: 2.5 },
  { title: 'Тверь — Москва', url: '/mezhgorod/tver/moskva', distanceKm: 190, priceComfort: 7500, timeH: 2.5 },
  { title: 'Краснодар — Анапа', url: '/krasnodar-anapa.html', distanceKm: 190, priceComfort: 7500, timeH: 2.5 },
  { title: 'Курск — Воронеж', url: '/mezhgorod/kursk/voronezh', distanceKm: 230, priceComfort: 8500, timeH: 3.5 },
  { title: 'Белгород — Воронеж', url: '/mezhgorod/belgorod/voronezh', distanceKm: 260, priceComfort: 9500, timeH: 3.5 },
  { title: 'Ярославль — Кострома', url: '/mezhgorod/yaroslavl/kostroma', distanceKm: 90, priceComfort: 5000, timeH: 1.5 },
]

// Отзывы — реальные из route_reviews БД (rate=5, review_date >= 2025-06)
export interface Review {
  username: string
  city: string
  route: string
  text: string
  date: string
}

export const REVIEWS: Review[] = [
  { username: 'Екатерина', city: 'Мурманск', route: 'Мурманск — Суздаль', text: 'Заказывали машину Мурманск — Суздаль. В салоне было прохладно. Дорога прошла быстро. Рекомендую!', date: '2026-02-05' },
  { username: 'Полина', city: 'Казань', route: 'Казань — Краснотурьинск', text: 'Заказывали машину Казань — Краснотурьинск. Евгений оказался отличным водителем. Доехали без проблем. Рекомендую!', date: '2026-01-04' },
  { username: 'Ольга', city: 'Санкт-Петербург', route: 'СПб — Красное-на-Волге', text: 'Не могу не поделиться. Заказывали машину Санкт-Петербург — Красное-на-Волге. Автомобиль комфортный. Доехали без проблем. Всё понравилось.', date: '2026-02-17' },
  { username: 'Дарья', city: 'Липецк', route: 'Липецк — Апрелевка', text: 'Не могу не поделиться. Заказывали машину Липецк — Апрелевка. Алексей оказался отличным водителем. Автомобиль комфортный. Всё понравилось.', date: '2026-02-24' },
  { username: 'Кирилл', city: 'Тамбов', route: 'Тамбов — Полазна', text: 'Решил написать отзыв. Бронировали поездку Тамбов — Полазна. Всё понравилось.', date: '2025-12-24' },
  { username: 'Дмитрий', city: 'Санкт-Петербург', route: 'СПб — Калининск', text: 'Заказывали машину Санкт-Петербург — Калининск. Водитель Андрей приехал вовремя. Автомобиль комфортный. Доехали без проблем.', date: '2026-01-23' },
  { username: 'Дмитрий', city: 'Краснодар', route: 'Краснодар — Верхнее Дуброво', text: 'Не могу не поделиться. Бронировали поездку Краснодар — Верхнее Дуброво. Автомобиль комфортный. Всё понравилось.', date: '2026-02-10' },
  { username: 'Илья', city: 'Йошкар-Ола', route: 'Йошкар-Ола — Каргаполье', text: 'Хочу поделиться впечатлениями. Ехали по маршруту Йошкар-Ола — Каргаполье. Спасибо водителю Николай! Автомобиль комфортный. Советую всем!', date: '2025-12-28' },
  { username: 'Алексей', city: 'Архангельск', route: 'Архангельск — Зарайск', text: 'Бронировали поездку Архангельск — Зарайск. Водитель Сергей приехал вовремя. Доехали без проблем. Рекомендую!', date: '2026-01-06' },
]

// Категории направлений — для вкладок «По типу»
export interface DirectionCategory {
  key: string
  label: string
  emoji: string
  description: string
  routes: { title: string; url: string; priceFrom?: number }[]
}

export const DIRECTION_CATEGORIES: DirectionCategory[] = [
  {
    key: 'airports',
    label: 'В аэропорты',
    emoji: '✈️',
    description: 'Трансферы в Шереметьево, Внуково, Домодедово, Пулково из региональных центров. Подача под утренние рейсы без наценки.',
    routes: [
      { title: 'Ярославль → Шереметьево', url: '/mezhgorod/yaroslavl/moskva', priceFrom: 9500 },
      { title: 'Владимир → Домодедово', url: '/mezhgorod/vladimir/moskva', priceFrom: 8000 },
      { title: 'Калуга → Внуково', url: '/mezhgorod/kaluga/moskva', priceFrom: 7000 },
      { title: 'Тверь → Шереметьево', url: '/mezhgorod/tver/moskva', priceFrom: 7500 },
      { title: 'Воронеж → Домодедово', url: '/mezhgorod/voronezh/moskva', priceFrom: 17500 },
      { title: 'Белгород → Внуково', url: '/mezhgorod/belgorod/moskva', priceFrom: 22500 },
    ],
  },
  {
    key: 'sea',
    label: 'К морю',
    emoji: '🌊',
    description: 'Сезонные поездки на Чёрное море: Сочи, Анапа, Геленджик, Новороссийск. Крым через Крымский мост. Для семей с багажом — минивэны.',
    routes: [
      { title: 'Воронеж → Сочи', url: '/mezhgorod/voronezh/sochi' },
      { title: 'Воронеж → Анапа', url: '/mezhgorod/voronezh/anapa' },
      { title: 'Воронеж → Геленджик', url: '/mezhgorod/voronezh/gelendzhik' },
      { title: 'Краснодар → Сочи', url: '/krasnodar-sochi.html' },
      { title: 'Ростов-на-Дону → Сочи', url: '/rostov-na-donu-sochi.html' },
      { title: 'Краснодар → Анапа', url: '/krasnodar-anapa.html', priceFrom: 7500 },
    ],
  },
  {
    key: 'ski',
    label: 'Горнолыжка',
    emoji: '⛷',
    description: 'Курорты Северного Кавказа: Красная Поляна (Сочи), Домбай, Архыз, Эльбрус. Подача от Краснодара, Минеральных Вод, Ставрополя.',
    routes: [
      { title: 'Все горнолыжные направления', url: '/gornolyzhka', priceFrom: undefined },
    ],
  },
  {
    key: 'svo',
    label: 'СВО-зона',
    emoji: '🔹',
    description: 'Поездки в ЛНР, ДНР, приграничные районы Белгородской и Курской областей. Водители знают оперативную обстановку, документы в порядке.',
    routes: [
      { title: 'Все направления СВО', url: '/svo', priceFrom: undefined },
    ],
  },
  {
    key: 'business',
    label: 'Для бизнеса',
    emoji: '💼',
    description: 'Корпоративные поездки с НДС, ЭДО через Диадок/СБИС, выделенный менеджер, единый счёт в конце месяца.',
    routes: [
      { title: 'Корпоративное такси межгород', url: '/dlya-biznesa/korporativnoe-taksi-mezhgorod' },
      { title: 'Медицинский трансфер', url: '/dlya-biznesa/medicinskij-transfer' },
      { title: 'Трансфер для мероприятий', url: '/dlya-biznesa/transfer-dlya-meropriyatiy' },
      { title: 'Перевозка вахтовых рабочих', url: '/dlya-biznesa/perevozka-vakhtovyh-rabochih' },
    ],
  },
]
