import { getTitle } from "@/shared/services/getTitle";
import clsx from "clsx";
import { FC } from "react";
import s from './WelcomeContent.module.scss';

interface IProps {
  city?: string
}

const WelcomeContent: FC<IProps> = ({ city }) => {

  const advantages = [
    {
      id: 1,
      title: '6 лет',
      description: 'На рынке пассажирских перевозок',
      isWide: true
    },
    {
      id: 2,
      title: '>70',
      description: 'Регионов присутствия'
    },
    {
      id: 3,
      title: '+8 500',
      description: 'Поездок по России'
    }
  ]

  return (
    <>
      <h1 className={clsx(s.title, 'font-40-semibold black-color')}>
        {'Такси '}
        {city && <span className="font-40-semibold orange-color">{getTitle(city)}</span>}
        {!city && ' межгород'}
      </h1>
      <h4 className={clsx(s.description, 'font-18-normal black-color')}>
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
    </>
  )
}

export default WelcomeContent;
