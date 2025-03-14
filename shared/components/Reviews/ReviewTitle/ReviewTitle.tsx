import clsx from "clsx";
import { FC } from "react";
import s from './ReviewTitle.module.scss';

interface IProps {

}

const ReviewTitle: FC<IProps> = () => {

  return (
    <div className={s.container}>
      <h2 className={clsx(s.title, 'font-56-medium black-color')}>
        Отзывы - Междугороднее такси <span className="font-56-medium orange-color">«CITY 2 CITY»</span>
      </h2>

      <div className={s.description}>
        Комфорт, Бизнес и Минивэн - поездки на любой случай
      </div>
    </div>
  )
}

export default ReviewTitle;