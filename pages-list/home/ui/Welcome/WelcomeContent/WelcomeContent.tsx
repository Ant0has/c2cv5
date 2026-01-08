import clsx from "clsx";
import { FC } from "react";
import s from './WelcomeContent.module.scss';
import { IRouteData } from "@/shared/types/route.interface";
import { getAdvantages } from "@/pages-list/home/libs/get-advantages";

interface IProps {
  city?: string
  isMilitary?: boolean
  route?: IRouteData
}

const WelcomeContent: FC<IProps> = ({ city, isMilitary, route }) => {

  const advantages = getAdvantages(route, city)

  return (
    <>
      <h1 className={clsx('title font-40-semibold text-black')}>
        {'Такси '}
        {city && <span className="font-40-semibold text-primary">{city}</span>}
        {!city && ' межгород'}
      </h1>
      <div className={''}>
        <h4 className={clsx('font-18-normal', {
          'text-white': isMilitary,
          'text-black': !isMilitary
        }, s.description)}>
          Услуги качественного сервиса заказа такси в России
        </h4>
        <ul className={clsx(s.advantages, 'margin-t-16')}>
          {advantages.map(advantage => (
            <li key={advantage.id} className={clsx(s.advantage)}>
              <span className="font-32-semibold text-primary">{advantage.title}</span>
              <span className="font-14-normal text-black">{advantage.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default WelcomeContent;
