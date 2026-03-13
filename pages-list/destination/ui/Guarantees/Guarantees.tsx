'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import s from './Guarantees.module.scss'
import clsx from "clsx"

interface Props {
  destination: IHubDestination
}

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="currentColor"/>
  </svg>
)

const MoneyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
  </svg>
)

const DocIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
  </svg>
)

const BabyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M13 2V10L11 8L9 10V2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2H13Z" fill="currentColor"/>
  </svg>
)

const Guarantees = ({ destination }: Props) => {
  const isSeaHub = destination.hub?.slug === 'morskoj-otdyh'

  const guarantees = [
    {
      icon: <MoneyIcon />,
      title: 'Фиксированная цена',
      description: 'Стоимость известна до поездки. Без счётчика, скрытых доплат и сюрпризов.',
    },
    {
      icon: <ClockIcon />,
      title: 'Бесплатная отмена',
      description: 'Отмена за 24 часа до поездки — бесплатно. Полный возврат предоплаты.',
    },
    {
      icon: <ShieldIcon />,
      title: 'Страхование пассажиров',
      description: 'Каждая поездка застрахована. ОСАГО + дополнительная страховка пассажиров.',
    },
    {
      icon: <DocIcon />,
      title: 'Договор и чек',
      description: 'Работаем по оферте. Выдаём кассовый чек и все документы для отчётности.',
    },
  ]

  if (isSeaHub) {
    guarantees.push({
      icon: <BabyIcon />,
      title: 'Детские кресла бесплатно',
      description: 'Автокресла и бустеры для детей любого возраста — включены в стоимость.',
    })
  }

  return (
    <section className={s.guarantees}>
      <div className="container">
        <h2 className={clsx('title', 'margin-b-32')}>Гарантии безопасности</h2>
        <div className={s.grid}>
          {guarantees.map((item, index) => (
            <div key={index} className={s.card}>
              <div className={s.cardIcon}>{item.icon}</div>
              <h3 className={s.cardTitle}>{item.title}</h3>
              <p className={s.cardDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Guarantees
