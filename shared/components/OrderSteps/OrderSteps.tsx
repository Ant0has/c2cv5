"use-client"

import { PHONE_NUMBER_FIRST } from "@/shared/constants";
import { formatPhoneNumber } from "@/shared/services/formate-phone-number";
import { Blocks, ButtonTypes } from "@/shared/types/enums";
import clsx from "clsx";
import Image from "next/image";
import { FC, useContext } from "react";
import Button from "../ui/Button/Button";
import s from './OrderSteps.module.scss';
import OrderStepsContent from "./OrderStepsContent/OrderStepsContent";

import { ModalContext } from "@/app/providers";
import bigCarImage from '@/public/images/cars/car-big.png';
import bigCarMilitaryImage from '@/public/images/military/cars/car-big.png';

interface IProps {
  isMilitary?: boolean;
}

const OrderSteps: FC<IProps> = ({ isMilitary }) => {
  const { setQuestionModalData } = useContext(ModalContext)

  return (
    <div className={s.wrapper}>
      <div className={clsx(s.container, 'container-24')}>
        <OrderStepsContent />

        <div className={s.actions}>
          <Button type={ButtonTypes.PRIMARY} text='Заказать поездку' handleClick={() => setQuestionModalData({ status: true, blockFrom: Blocks.ORDER_STEPS })} />
          <div className={s.contacts}><span className='font-14-normal black-color'>Закажите такси онлайн или по телефону </span> <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-14-normal orange-color'>
            {formatPhoneNumber(PHONE_NUMBER_FIRST)}
          </a></div>
        </div>

        <div className={s.imageContainer}>
          <Image src={isMilitary ? bigCarMilitaryImage : bigCarImage} alt="car" layout="fill" objectFit="contain" className={s.image} />
        </div>
      </div>

    </div>
  )
}

export default OrderSteps;
