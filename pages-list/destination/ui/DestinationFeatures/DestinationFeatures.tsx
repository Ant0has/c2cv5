'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import s from './DestinationFeatures.module.scss'
import clsx from "clsx";

interface Props {
  destination: IHubDestination
}

const defaultFeatures = [
  {
    icon: '🚗',
    title: 'Комфортные автомобили',
    description: 'Просторные и чистые авто с кондиционером'
  },
  {
    icon: '👨‍✈️',
    title: 'Опытные водители',
    description: 'Профессионалы с многолетним стажем'
  },
  {
    icon: '💰',
    title: 'Фиксированная цена',
    description: 'Никаких скрытых доплат и сюрпризов'
  },
  {
    icon: '📱',
    title: 'Встреча с табличкой',
    description: 'Водитель встретит вас в указанном месте'
  },
  {
    icon: '🧳',
    title: 'Помощь с багажом',
    description: 'Погрузка и выгрузка вещей'
  },
  {
    icon: '⏰',
    title: 'Работаем 24/7',
    description: 'Доступны в любое время суток'
  }
]

const DestinationFeatures = ({ destination }: Props) => {
  // Можно распарсить JSON из destination.features если они есть
  const features = defaultFeatures

  return (
    <section className={s.features}>
      <div className="container">
        <h2 className={clsx('title', 'title-container')}>Почему выбирают нас</h2>

        <div className={s.grid}>
          {features.map((feature, index) => (
            <div key={index} className={s.featureCard}>
              <div className={s.featureIcon}>{feature.icon}</div>
              <h3 className={s.featureTitle}>{feature.title}</h3>
              <p className={s.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DestinationFeatures
