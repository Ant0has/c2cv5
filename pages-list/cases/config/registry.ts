import type { CaseStudyEntry } from '../types'
import type { BlogSegment } from '../../blog/types'

export const CASES: CaseStudyEntry[] = [
  // ===== Сегмент 1: Корпоративное такси (2 кейса) =====
  {
    slug: 'kejs-it-kompaniya-sokratila-raskhody-35',
    segment: 'korporativnoe-taksi',
    title: 'IT-компания сократила расходы на командировки на 35%',
    client: 'IT-компания, 200 сотрудников',
    description: 'Как компания ТехноСофт с 200 сотрудниками перешла на корпоративный трансфер City2City и сократила транспортные расходы на командировки на 35% за 6 месяцев.',
    keywords: 'кейс корпоративное такси, экономия на командировках, корпоративный трансфер IT',
    readingTime: 10,
    metrics: [
      { value: '35%', label: 'экономия' },
      { value: '6 мес', label: 'срок окупаемости' },
      { value: '2.1 млн ₽', label: 'сэкономлено за год' },
    ],
  },
  {
    slug: 'kejs-stroitelnaya-kompaniya-optimizirovala-logistiku',
    segment: 'korporativnoe-taksi',
    title: 'Строительная компания оптимизировала логистику командировок',
    client: 'Строительная компания, 80 инженеров',
    description: 'Кейс ГрадСтрой: как компания с 80 инженерами и 12 объектами по ЦФО наладила регулярные командировки через единого перевозчика и сократила простои.',
    keywords: 'кейс логистика командировок, строительная компания перевозки, оптимизация транспорта',
    readingTime: 9,
    metrics: [
      { value: '12', label: 'объектов обслуживается' },
      { value: '40%', label: 'меньше простоев' },
      { value: '1.4 млн ₽', label: 'экономия в год' },
    ],
  },

  // ===== Сегмент 2: Трансфер для мероприятий (2 кейса) =====
  {
    slug: 'kejs-korporativ-500-chelovek-podmoskove',
    segment: 'transfer-meropriyatiy',
    title: 'Трансфер 500 сотрудников на корпоратив в Подмосковье',
    client: 'Финансовая группа, 500 сотрудников',
    description: 'Как ФинГрупп организовала трансфер 500 сотрудников на корпоратив в Подмосковье: 5 маршрутов, 12 автобусов, нулевые опоздания.',
    keywords: 'кейс трансфер корпоратив, перевозка сотрудников мероприятие, трансфер Подмосковье',
    readingTime: 8,
    metrics: [
      { value: '500', label: 'человек перевезли' },
      { value: '0', label: 'опозданий' },
      { value: '5', label: 'маршрутов' },
    ],
  },
  {
    slug: 'kejs-logistika-foruma-v-sochi',
    segment: 'transfer-meropriyatiy',
    title: 'Логистика международного бизнес-форума в Сочи',
    client: 'Организатор форума, 500 участников',
    description: 'Кейс организации трансферной логистики для международного бизнес-форума в Сочи: аэропорт, отели, площадки — 500 участников за 3 дня.',
    keywords: 'кейс логистика форума, трансфер бизнес-форум, перевозка участников Сочи',
    readingTime: 9,
    metrics: [
      { value: '500', label: 'участников' },
      { value: '3 дня', label: 'работы' },
      { value: '98%', label: 'довольных гостей' },
    ],
  },

  // ===== Сегмент 3: Перевозка вахтовых рабочих (2 кейса) =====
  {
    slug: 'kejs-burovye-brigady-mestorozhdeniya-yugry',
    segment: 'vakhtovye-perevozki',
    title: 'Перевозка буровых бригад на месторождения Югры',
    client: 'НефтьТрансСервис, 6 бригад',
    description: 'Как НефтьТрансСервис наладил еженедельную ротацию 6 буровых бригад на месторождения ХМАО-Югры с помощью City2City и сократил простои на 45%.',
    keywords: 'кейс вахтовые перевозки, буровые бригады Югра, ротация вахтовиков',
    readingTime: 10,
    metrics: [
      { value: '45%', label: 'меньше простоев' },
      { value: '6', label: 'бригад в ротации' },
      { value: '100%', label: 'рейсов по графику' },
    ],
  },
  {
    slug: 'kejs-stroitelnye-brigady-obekty-arktiki',
    segment: 'vakhtovye-perevozki',
    title: 'Доставка строительных бригад на объекты Арктики',
    client: 'АрктикСтрой, 120 рабочих',
    description: 'Кейс АрктикСтрой: доставка 120 строительных рабочих по маршруту Мурманск — Новый Уренгой в экстремальных условиях Крайнего Севера.',
    keywords: 'кейс перевозка бригад Арктика, вахтовые перевозки Крайний Север, доставка рабочих',
    readingTime: 11,
    metrics: [
      { value: '120', label: 'рабочих' },
      { value: '3 200 км', label: 'маршрут' },
      { value: '30%', label: 'экономия vs авиа' },
    ],
  },

  // ===== Сегмент 4: Медицинский трансфер (2 кейса) =====
  {
    slug: 'kejs-onkopacient-na-lechenie-v-moskvu',
    segment: 'medicinskij-transfer',
    title: 'Перевозка онкопациентов на лечение в Москву',
    client: 'Клиника-партнёр, 40+ пациентов/мес',
    description: 'Как клиника-партнёр организовала регулярную перевозку онкопациентов из регионов в НМИЦ Москвы: 40+ пациентов в месяц, комфортные условия.',
    keywords: 'кейс медицинский трансфер, перевозка онкопациентов, трансфер на лечение Москва',
    readingTime: 10,
    metrics: [
      { value: '40+', label: 'пациентов/мес' },
      { value: '99%', label: 'вовремя' },
      { value: '4.8', label: 'оценка пациентов' },
    ],
  },
  {
    slug: 'kejs-reabilitacionnye-pacienty-v-sanatorij',
    segment: 'medicinskij-transfer',
    title: 'Трансфер реабилитационных пациентов в санаторий',
    client: 'Сеть клиник, Московская область',
    description: 'Кейс сети клиник: организация трансфера реабилитационных пациентов из Москвы в подмосковные санатории с медицинским сопровождением.',
    keywords: 'кейс трансфер реабилитация, перевозка пациентов санаторий, медицинский трансфер Подмосковье',
    readingTime: 8,
    metrics: [
      { value: '25', label: 'пациентов/нед' },
      { value: '100%', label: 'с сопровождением' },
      { value: '35%', label: 'дешевле скорой' },
    ],
  },

  // ===== Сегмент 5: Доставка грузов (2 кейса) =====
  {
    slug: 'kejs-dostavka-zapchastej-dlya-zavodskogo-prostoya',
    segment: 'dostavka-gruzov',
    title: 'Срочная доставка запчастей для устранения заводского простоя',
    client: 'ПромТехника, производство',
    description: 'Как ПромТехника устранила простой конвейера за 4 часа благодаря срочной межгородней доставке запчастей через City2City.',
    keywords: 'кейс срочная доставка запчастей, устранение простоя завод, экспресс доставка межгород',
    readingTime: 7,
    metrics: [
      { value: '4 часа', label: 'время доставки' },
      { value: '12 млн ₽', label: 'сохранили от простоя' },
      { value: '320 км', label: 'расстояние' },
    ],
  },
  {
    slug: 'kejs-ezhemesyachnaya-dostavka-obrazcov-laboratorii',
    segment: 'dostavka-gruzov',
    title: 'Ежемесячная доставка образцов для лаборатории',
    client: 'ФармаЛаб, 3 региона',
    description: 'Кейс ФармаЛаб: организация регулярной доставки биологических образцов из 3 регионов с соблюдением температурного режима.',
    keywords: 'кейс доставка образцов, фарма логистика, температурная доставка межгород',
    readingTime: 9,
    metrics: [
      { value: '3', label: 'региона' },
      { value: '0', label: 'нарушений режима' },
      { value: '40%', label: 'дешевле спецкурьера' },
    ],
  },
]

export function getAllCaseParams(): { slug: string }[] {
  return CASES.map(c => ({ slug: c.slug }))
}

export function getCaseEntryBySlug(slug: string): CaseStudyEntry | undefined {
  return CASES.find(c => c.slug === slug)
}

export function getCasesBySegment(segment: BlogSegment): CaseStudyEntry[] {
  return CASES.filter(c => c.segment === segment)
}
