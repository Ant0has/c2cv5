"use-client"

import { FC } from "react";
import s from './OrderSteps.module.scss'
import clsx from "clsx";
import OrderStepsContent from "./OrderStepsContent/OrderStepsContent";
import { ButtonTypes } from "@/shared/types/enums";
import Button from "../ui/Button/Button";
import { PHONE_NUMBER_FIRST } from "@/shared/constants";
import { formatPhoneNumber } from "@/shared/services/formate-phone-number";
import Image from "next/image";

import bigCarImage from '@/public/images/cars/car-big.png'

interface IProps {

}

const OrderSteps: FC<IProps> = () => {

  return (
    <div className={s.wrapper}>
      <div className={clsx(s.container, 'container')}>
        <OrderStepsContent />

        <div className={s.actions}>
          <Button type={ButtonTypes.PRIMARY} text='Заказать поездку' />
          <div className={s.contacts}><span className='font-14-normal black-color'>Закажите такси онлайн или по телефону </span> <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-14-normal orange-color'>
            {formatPhoneNumber(PHONE_NUMBER_FIRST)}
          </a></div>
        </div>

        <div className={s.imageContainer}>
          <Image src={bigCarImage} alt="car" layout="fill" objectFit="contain" className={s.image} />
        </div>
      </div>

    </div>
  )
}

export default OrderSteps;
