import clsx from "clsx";
import { FC } from "react";
import s from './WelcomeContent.module.scss';
import { IRouteData } from "@/shared/types/route.interface";
import { calcTripsCount } from "@/shared/services/seo-utils";

interface IProps {
  city?: string
  isMilitary?:boolean
  route?: IRouteData
}

const WelcomeContent: FC<IProps> = ({ city,isMilitary,route }) => {

  const hasData = route && route.distance_km && route.distance_km > 0;

  const trips = route && route.url ? calcTripsCount(route.url, route.is_whitelist || false) : 0;

  const advantages = hasData ? [
    {
      id: 1,
      title: `${route.distance_km} км`,
      description: 'Расстояние',
    },
    {
      id: 2,
      title: `~${route.duration_hours || 0} ч`,
      description: 'В пути'
    },
    {
      id: 3,
      title: `${trips}+`,
      description: `Поездок из ${city}`
    }
  ] : [
    {
      id: 1,
      title: '24/7',
      description: 'Приём заказов',
    },
    {
      id: 2,
      title: '5 мин',
      description: 'Подтверждение',
      isWide: true
    },
    {
      id: 3,
      title: `${trips}+`,
      description: `Поездок из ${city}`
    }
  ]

  return (
    <>
      <h1 className={clsx(s.title, 'font-40-semibold black-color')}>
        {'Такси '}
        {city && <span className="font-40-semibold orange-color">{city}</span>}
        {!city && ' межгород'}
      </h1>
      <div className={s.listWrapper}>
        <h4 className={clsx('font-18-normal', {
          'white-color':isMilitary,
          'black-color' :!isMilitary
        },s.description)}>
          Услуги качественного сервиса заказа такси в России
        </h4>
        <ul className={s.advantages}>
          {advantages.map(advantage => (
            <li key={advantage.id} className={clsx(s.advantage, { [s.wide]: advantage.isWide })}>
              <span className="font-32-semibold orange-color">{advantage.title}</span>
              <span className="font-14-normal black-color">{advantage.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default WelcomeContent;
