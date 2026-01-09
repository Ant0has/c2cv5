import BankCardIcon from "@/public/icons/BankCardIcon"
import CarIcon from "@/public/icons/CarIcon"
import BankIcon from "@/public/icons/BankIcon"
import TransportationIcon from "@/public/icons/TransportationIcon"
import AirportTransfersIcon from "@/public/icons/AirportTransfersIcon"
import EventsIcon from "@/public/icons/EventsIcon"
import HomeIcon from "@/public/icons/HomeIcon"

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
