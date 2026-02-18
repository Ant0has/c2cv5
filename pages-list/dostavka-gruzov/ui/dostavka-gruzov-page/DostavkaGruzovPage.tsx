import { BusinessHero, BusinessAnswers, BusinessB2bCalculator, BusinessContract, BusinessServiceAreas, BusinessPopularRoutes, BusinessChoise, BusinessInstruction, BusinessReviews, BusinessFaq, BusinessCooperation, BusinessComprasion } from '@/entities/buziness'
import s from './DostavkaGruzovPage.module.scss'
import FactoryIcon from '@/public/icons/FactoryIcon'
import MedicalIcon from '@/public/icons/MedicalIcon'
import ServerIcon from '@/public/icons/ServerIcon'
import FileIcon from '@/public/icons/FileIcon'
import SafetyIcon from '@/public/icons/SafetyIcon'
import WifiIcon from '@/public/icons/WifiIcon'
import PeopleIcon from '@/public/icons/PeopleIcon'
import PunctualityIcon from '@/public/icons/PunctualityIcon'
import CarIcon from '@/public/icons/CarIcon'

const pageData = {
  hero: {
    title: [{ text: 'Доставка', isPrimary: false }, { text: 'грузов', isPrimary: true }, { text: 'между городами в тот же день', isPrimary: false }],
    description: 'Забираем за 1 час. Везём напрямую. Быстрее любой ТК.',
    image: '/images/dostavka-gruzov/hero-phone.png',
    bullets: [
      'Прямая доставка точка-точка без сортировок',
      'Груз до 50 кг — помещается в легковой авто',
      'Документы для юрлиц: договор, акт, счёт-фактура',
    ],
    staticsList: [
      { id: 1, label: '< 1 часа', value: 'Время подачи' },
      { id: 2, label: '2-6 ч', value: 'Доставка до 500км' },
      { id: 3, label: '79', value: 'регионов' },
      { id: 4, label: 'до 50 кг', value: 'вес груза' },

    ]
  },
  answers: {
    title: [{ text: 'Почему транспортные компании', isPrimary: false }, { text: 'не подходят для срочных грузов', isPrimary: true }],
    list: [
      { id: 1, problem: { title: 'Груз едет через сортировочный центр', description: 'Клиент ждёт груз 3 дня, а не 1' }, solution: { title: 'Прямая доставка', description: 'Водитель забирает груз и везёт напрямую к получателю. Без перегрузов и складов' } },
      { id: 2, problem: { title: 'Нельзя отследить в реальном времени', description: 'Клиент не знает, где груз и когда он будет доставлен' }, solution: { title: 'GPS-отслеживание', description: 'Видите машину на карте в реальном времени. Знаете точное время доставки' } },
      { id: 3, problem: { title: 'Невозможно забрать в выходной или после 18:00', description: 'Клиент не может забрать груз' }, solution: { title: 'Работаем 24/7', description: 'Забираем груз в любое время, включая выходные и праздники' } },
    ],
  },
  calculator: {
    title: [{ text: 'Узнайте', isPrimary: false }, { text: 'стоимость доставки', isPrimary: true }, { text: 'за 30 секунд', isPrimary: false }],
    image: '/images/dostavka-gruzov/calculator-phone.png',
    description: 'Откуда и куда везём груз?',
    buttonText: 'Рассчитать доставку',
  },
  contract: {
    title: [{ text: 'Работа', isPrimary: false }, { text: 'по договору', isPrimary: true }],
    documentsList: [
      'Договор транспортной экспедиции',
      'Акт выполненных работ',
      'Счет-фактура для НДС',
      'Электронный чек с QR-кодом',
      'Путевой лист по требованию',
      'Экспедиторская расписка на груз'
    ],
  },
  serviceAreas: {
    title: [{ text: 'Кому нужна', isPrimary: false }, { text: 'сверхсрочная доставка', isPrimary: true }],
    list: [
      { id: 1, title: 'Производство и промышленность', description: 'Запчасти для оборудования — простой линии стоит десятки тысяч в час', icon: <FactoryIcon /> },
      { id: 2, title: 'Медицина и фармацевтика', description: 'Биоматериалы, анализы, лекарства — когда счёт идёт на часы', icon: <MedicalIcon /> },
      { id: 3, title: 'IT и серверное оборудование', description: 'Сервер, коммутатор, ИБП — простой систем обходится в ₽84 000/час', icon: <ServerIcon /> },
      { id: 4, title: '	Документы, автозапчасти, комплектующие', description: 'Оригиналы на подпись, детали для автосервиса — всё что не ждёт', icon: <FileIcon /> },
    ]
  },
  popularRoutes: {
    title: [{ text: 'Популярные', isPrimary: false }, { text: ' направления доставки', isPrimary: true }],
    description: 'Цена фиксируется сразу. Доставка в тот же день.',
    list: [
      {
        id: 1,
        from: 'Москва',
        to: 'Санкт-Петербург',
        price: '20 000 ₽',
        distance: '420 км',
        duration: '5 ч',
      },
      {
        id: 1,
        from: 'Ростов-на-Дону',
        to: 'Краснодар',
        price: '8 000 ₽',
        distance: '420 км',
        duration: '5 ч',
      },
      {
        id: 3,
        from: 'Москва',
        to: 'Казань',
        price: '23 000 ₽',
        distance: '420 км',
        duration: '5 ч',
      },

      {
        id: 4,
        from: 'Санкт-Петербург',
        to: 'Великий Новгород',
        price: '5 500 ₽',
        distance: '420 км',
        duration: '5 ч',
      },
      {
        id: 5,
        from: 'Краснодар',
        to: 'Сочи',
        price: '7 000 ₽',
        distance: '420 км',
        duration: '5 ч',
      },
      {
        id: 6,
        from: 'Москва',
        to: 'Нижний Новгород',
        price: '12 000 ₽',
        distance: '420 км',
        duration: '5 ч',
      },
    ],
  },
  instruction: {
    list: [
      {
        id: 1,
        title: 'Заявка',
        description: 'Оставьте заявку или позвоните. Назовём точную цену и время доставки за 5 минут.'
      },
      {
        id: 2,
        title: 'Договор',
        description: 'Заключаем договор экспедиции. Разовый заказ — можно без договора, по оферте.'
      },
      {
        id: 3,
        title: 'Заказ',
        description: 'Водитель приезжает к отправителю в течение 1 часа. Принимает груз по описи.'
      },
      {
        id: 4,
        title: 'Поездка',
        description: 'Груз едет напрямую. Отслеживайте на карте. По прибытии — фото, подпись, закрывающие документы.'
      }
    ],
  },
  choise: {
    list: [
      {
        id: 1,
        title: 'Пунктуальность',
        icon: <PunctualityIcon />,
        description: 'Забор за 1 час. Водитель приезжает к отправителю в течение 60 минут после подтверждения заказа'
      },
      {
        id: 2,
        title: 'Связь без интернета',
        icon: <WifiIcon />,
        description: 'Уникальная система связи клиент-диспетчер-водитель работает даже при блокировках мобильного интернета'
      },
      {
        id: 3,
        title: 'Опытные водители',
        icon: <PeopleIcon />,
        description: 'Проверенные водители со стажем от 5 лет. Аккуратное обращение с грузом, фотофиксация при приёмке'
      },
      {
        id: 4,
        title: 'Безопасность',
        icon: <SafetyIcon />,
        description: 'Страхование груза. Ответственность экспедитора. Все автомобили застрахованы по КАСКО'
      },
      {
        id: 5,
        title: 'Комфортный автопарк',
        icon: <CarIcon />,
        description: 'Вместительные багажники. Автомобили не старше 5 лет. Груз до 50 кг, габариты до 60×40×40 см'
      },
    ],
  },
  reviews: {
    list: [
      {
        id: 1,
        name: 'Дмитрий Бородин',
        company: 'Главный инженер, ООО «ПромТехСервис»"',
        text: 'Станок встал, нужен был подшипник из Москвы. СДЭК — 2 дня. City2city привезли за 4 часа. Линия заработала в тот же день.',
        rating: 5,
        date: '12 января 2026',
      },
      {
        id: 2,
        name: 'Анна Соловьёва',
        company: 'Логист, медицинский центр «Здоровье+»',
        text: 'Регулярно передаём биоматериалы в лабораторию в соседний город. Раньше мучились с попутками. Теперь водитель забирает за час, документы приходят на почту.',
        rating: 5,
        date: '10 февраля 2026',
      },
      {
        id: 3,
        name: 'Игорь Масленников',
        company: 'IT-директор, ООО «DataCenter»',
        text: 'Сервер нужно было доставить из Нижнего в Москву срочно. Заказал вечером — утром модуль уже стоял в стойке. Проще чем я думал.',
        rating: 5,
        date: '30 января 2026',
      },
    ],
  },
  faq: {
    list: [
      {
        id: 1,
        question: 'Какой груз можно отправить?',
        answer: 'Любой, что помещается в багажник/салон легкового авто: до 50 кг, габариты до 60×40×40 см. Документы, запчасти, образцы, оборудование, посылки. Нельзя: опасные, запрещённые грузы.'
      },
      {
        id: 2,
        question: 'Сколько стоит доставка?',
        answer: 'Цена зависит от расстояния и веса. Например, Москва→Тула (170 км) — от 8 000 ₽, Москва→Нижний Новгород (400 км) — от 12 000 ₽. Точную цену назовём за 5 минут после заявки.'
      },
      {
        id: 3,
        question: 'Как быстро заберут груз?',
        answer: 'Водитель приезжает в течение 1 часа после подтверждения. В крупных городах (Москва, СПб, Ростов, Краснодар) — часто быстрее.'
      },
      {
        id: 4,
        question: 'Нужен ли договор?',
        answer: 'Для разовой доставки достаточно оферты. Для регулярного сотрудничества заключаем договор транспортной экспедиции. Работаем по ЭДО (Диадок, СБИС) и классическим документооборотом.'
      },
      {
        id: 5,
        question: 'ДОБАВИТЬ 5-й вопрос: Чем вы лучше СДЭК / Деловых Линий?',
        answer: 'Мы не используем сортировочные центры. Ваш груз едет напрямую от двери до двери на выделенном автомобиле. Поэтому доставка занимает часы, а не дни. Идеально когда нужно срочно.'
      },
    ],
  },
  cooperation: {
    title: [{ text: 'Нужно доставить', isPrimary: false }, { text: 'груз сегодня?', isPrimary: true }],
    description: 'Оставьте заявку — назовём цену и пришлём водителя в течение часа',
    image: '/images/dostavka-gruzov/cooperation-phone.png',
    buttonText: 'Заказать доставку',
  },
  comprasion: {
    title: [{ text: 'Сравните', isPrimary: false }, { text: 'сами', isPrimary: true }],
    description: 'Чем мы лучше других перевозчиков?',
    organizations: [
      {
        id: 1,
        name: 'СДЭК Экспресс',
        description: 'Услуги курьерской службы для частных лиц',
        isCompetitor: true,
        features: [
          {
            id: 11,
            name: 'Минимальный срок',
            description: '1-2 рабочий день',
            isBest: false
          },
          {
            id: 12,
            name: 'Забор груза',
            description: 'На следующий день',
            isBest: false
          },
          {
            id: 13,
            name: 'Модель доставки',
            description: 'Сортировочный центр → хаб → доставка',
            isBest: false
          },
          {
            id: 14,
            name: 'Отслеживание',
            description: 'Статусы («принят», «в пути»)',
            isBest: false
          },
          {
            id: 15,
            name: 'Выходные',
            description: 'Ограниченно',
            isBest: false
          },
          {
            id: 16,
            name: 'Документы для юрлиц',
            description: 'Да',
            isBest: true
          },
        ]
      },
      {
        id: 2,
        name: 'Деловые Линии',
        description: 'Грузоперевозки по России, доставка грузов транспортной компанией',
        isCompetitor: true,
        features: [
          {
            id: 21,
            name: 'Минимальный срок',
            description: '1-3 рабочий день',
            isBest: false
          },
          {
            id: 22,
            name: 'Забор груза',
            description: 'По графику',
            isBest: false
          },
          {
            id: 23,
            name: 'Модель доставки',
            description: 'Терминал → терминал',
            isBest: false
          },
          {
            id: 24,
            name: 'Отслеживание',
            description: 'Статусы',
            isBest: false
          },
          {
            id: 25,
            name: 'Выходные',
            description: 'Нет',
            isBest: true
          },
          {
            id: 26,
            name: 'Документы для юрлиц',
            description: 'Да',
            isBest: true
          },
        ]
      },
      {
        id: 3,
        name: 'City2City',
        description: 'Трансфер для бизнеса. Бронируйте заранее — машина гарантированно будет',
        isCompetitor: false,
        features: [
          {
            id: 31,
            name: 'Минимальный срок',
            description: '2-6 часов',
            isBest: true
          },
          {
            id: 32,
            name: 'Забор груза',
            description: 'В течение 1 часа',
            isBest: true
          },
          {
            id: 33,
            name: 'Модель доставки',
            description: 'Прямая, точка-точка',
            isBest: true
          },
          {
            id: 34,
            name: 'Отслеживание',
            description: 'GPS на карте в реальном времени',
            isBest: true
          },
          {
            id: 35,
            name: 'Выходные',
            description: '24/7',
            isBest: true
          },
          {
            id: 36,
            name: 'Документы для юрлиц',
            description: 'Да',
            isBest: true
          },
        ]
      }
    ]
  },
}

const DostavkaGruzovPage = () => {
  return <div className={s.page}>
    <BusinessHero {...pageData.hero} />
    <BusinessAnswers {...pageData.answers} />
    <BusinessB2bCalculator {...pageData.calculator} />
    <BusinessContract {...pageData.contract} />
    <BusinessComprasion {...pageData.comprasion} />
    <BusinessServiceAreas {...pageData.serviceAreas} />
    <BusinessPopularRoutes {...pageData.popularRoutes} />
    <BusinessInstruction {...pageData.instruction} />
    <BusinessChoise {...pageData.choise} />
    <BusinessReviews {...pageData.reviews} />
    <BusinessFaq {...pageData.faq} />
    <BusinessCooperation {...pageData.cooperation} />
  </div>
}

export default DostavkaGruzovPage