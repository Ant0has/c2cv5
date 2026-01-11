import BankCardIcon from "@/public/icons/BankCardIcon"
import CarIcon from "@/public/icons/CarIcon"
import BankIcon from "@/public/icons/BankIcon"
import TransportationIcon from "@/public/icons/TransportationIcon"
import AirportTransfersIcon from "@/public/icons/AirportTransfersIcon"
import EventsIcon from "@/public/icons/EventsIcon"
import HomeIcon from "@/public/icons/HomeIcon"
import PunctualityIcon from "@/public/icons/PunctualityIcon"
import WifiIcon from "@/public/icons/WifiIcon"
import SafetyIcon from "@/public/icons/SafetyIcon"
import PeopleIcon from "@/public/icons/PeopleIcon"

export const companyExperienceList = [
    {
      id: 1,
      label: '9 лет',
      value: 'на рынке'
    },
    {
      id: 2,
      label: '12 000+',
      value: 'трансферов'
    },
    {
      id: 3,
      label: '79',
      value: 'регионов'
    },
    {
      id: 4,
      label: '60+',
      value: 'партнёров'
    }
  ]


export const companyAdvantagesList = ['Фиксированная цена при бронировании','Чек с QR-кодом для авансового отчёта','Связь работает даже без интернета']


export const problemSolutionsList = [
  {
    id: 1,
    problem: {
      title: 'Водитель отменил за час до поездки',
      description: 'Сотрудник на вокзале — машины нет'
    },
    solution: {
      title: 'Гарантия подачи',
      description: 'Водитель назначается сразу при бронированиит'
    }
  },
  {
    id: 2,
    problem: {
      title: 'Цена выросла в 2 раза',
      description: 'Праздники, погода — тариф непредсказуем'
    },
    solution: {
      title: 'Цена фиксируется при брони',
      description: 'Сколько согласовали — столько заплатите'
    }
  },
  {
    id: 3,
    problem: {
      title: 'Нет документов для бухгалтерии',
      description: 'Только электронный чек'
    },
    solution: {
      title: 'Полный пакет документов',
      description: 'Чек с QR, акт, счёт-фактура на email'
    }
  }
]


export const contractDocumentsList: string[] = [
  'Договор на оказание транспортных услуг',
  'Акт выполненных работ',
  'Счет-фактура для НДС',
  'Электронный чек с QR-кодом',
  'Путевой лист по требованию'
]

export const paymentMethodsList = [
  {
    id: 1,
    icon: <CarIcon fill='var(--primary)' />,
    title: 'Оплата при посадке',
    descriptionList: ['Сотрудник платит сам — наличными, картой или СБП', 'Чек с QR-кодом выдаётся сразу']
  },
  {
    id: 2,
    icon: <BankCardIcon fill='var(--primary)' />,
    title: 'Банковская карта',
    descriptionList: ['Оплата картой на сайте или по ссылке', 'Электронный чек придет в личный кабинет для отчета']
  },
  {
    id: 3,
    icon: <BankIcon fill='var(--primary)' />,
    title: 'Безналичный расчёт',
    descriptionList: ['Оплата по счету для юрлиц, постоплата', 'Полный пакет документов отправим в ЭДО']
  }
]

export const serviceAreasList = [
  {
    id: 1,
    title: 'Корпоративный транспорт',
    icon: <HomeIcon />,
    description: 'Доставка сотрудников на работу, деловые встречи и конференции'
  },
  {
    id: 2,
    title: 'Корпоративы и мероприятия',
    icon: <EventsIcon />,
    description: 'Трансфер гостей и сотрудников после корпоративных вечеринок'
  },
  {
    id: 3,
    title: 'Вахтовые перевозки',
    icon:<TransportationIcon/>,
    description: 'Доставка персонала на объекты'
  },
  {
    id: 4,
    title: 'Аэропортовые трансферы',
    icon:<AirportTransfersIcon/>,
    description: 'Встреча партнеров и гостей, VIP-трансферы'
  }
]

export const popularRoutesList = [
  {
    id: 1,
    from: 'Москва',
    to: 'Санкт-Петербург',
    price: '26 000 ₽',
    distance: '420 км',
    duration: '5 ч',
  },
  {
    id: 1,
    from: 'Ростов-на-Дону',
    to: 'Краснодар',
    price: '10 000 ₽',
    distance: '420 км',
    duration: '5 ч',
  },
  {
    id: 3,
    from: 'Москва',
    to: 'Казань',
    price: '30 000 ₽',
    distance: '420 км',
    duration: '5 ч',
  },

  {
    id: 4,
    from: 'Санкт-Петербург',
    to: 'Великий Новгород',
    price: '7 000 ₽',
    distance: '420 км',
    duration: '5 ч',
  },
  {
    id: 5,
    from: 'Краснодар',
    to: 'Сочи',
    price: '10 500 ₽',
    distance: '420 км',
    duration: '5 ч',
  },
  {
    id: 6,
    from: 'Москва',
    to: 'Нижний Новгород',
    price: '15 500 ₽',
    distance: '420 км',
    duration: '5 ч',
  },
]


export const instructionList = [
  {
    id: 1,
    title: 'Заявка',
    description: 'Оставьте заявку на сайте или позвоните нам. Менеджер свяжется в течение 15 минут.'
  },
  {
    id: 2,
    title: 'Договор',
    description: 'Заключаем договор. Работаем по ЭДО Диадок или классическим документооборотом.'
  },
  {
    id: 3,
    title: 'Заказ',
    description: 'Оформляете заказы через личный кабинет, мессенджер или звонком менеджеру.'
  },
  {
    id: 4,
    title: 'Поездка',
    description: 'Водитель прибывает вовремя. После поездки — электронный чек и закрывающие документы.'
  }
] 


export const choiseList = [
  {
    id: 1,
    title: 'Пунктуальность',
    icon: <PunctualityIcon />,
    description: 'Водитель прибывает в назначенное время. Отслеживание рейсов при встрече в аэропорту'
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
    description: 'Проверенные водители со стажем от 5 лет. Знание деловой этики и дресс-код'
  },
  {
    id: 4,
    title: 'Безопасность',
    icon: <SafetyIcon />,
    description: 'Все автомобили застрахованы по КАСКО. Регулярный техосмотр и обслуживание'
  },
  {
    id: 5,
    title: 'Комфортный автопарк',
    icon: <CarIcon />,
    description: 'Автомобили не старше 5 лет. Кондиционер, зарядные устройства для гаджетов'
  },
]


export const reviewsList = [
  {
    id: 1,
    name: 'Алексей Петров',
    company: 'ООО "ТехноСервис"',
    text: 'Работаем с CITY 2 CITY уже 2 года. Отличный сервис для корпоративных перевозок. Водители всегда пунктуальны, документы оформляются быстро.',
    rating: 5,
    date: '30 января 2025',
  },
  {
    id: 2,
    name: 'Елена Смирнова',
    company: 'HR-директор "Альфа Групп"',
    text: 'Используем для доставки сотрудников на вахту. Очень удобно работать по договору, все прозрачно. Рекомендую для крупных компаний.',
    rating: 5,
    date: '30 января 2025',
  },
  {
    id: 3,
    name: 'Дмитрий Козлов', 
    company: 'Логист "СтройМастер"',
    text: 'Заказывали трансфер для делегации партнеров из аэропорта. Встретили с табличкой, довезли с комфортом. Партнеры остались довольны.',
    rating: 5,
    date: '30 января 2025',
  },
]