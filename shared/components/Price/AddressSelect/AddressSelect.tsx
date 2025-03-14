"use client"

import clsx from "clsx";
import { FC, useState } from "react";
import RoadIcon from "@/public/icons/RoadIcon";
import SwapIcon from "@/public/icons/SwapIcon";
import TimeIcon from "@/public/icons/TimeIcon";
import WalletIcon from "@/public/icons/WalletIcon";
import { ButtonTypes } from "@/shared/types/enums";
import Button from "../../ui/Button/Button";
import s from './AddressSelect.module.scss';

interface IProps {

}

const AddressSelect: FC<IProps> = () => {

  const [departurePoint, setDeparturePoint] = useState<string>('')
  const [arrivalPoint, setArrivalPoint] = useState<string>('')

  const handleClickSwapAddress = () => {
    setDeparturePoint(arrivalPoint)
    setArrivalPoint(departurePoint)
  }

  const infoData = [
    {
      id: 1,
      icon: <RoadIcon />,
      value: 'от 10 км',
      description: 'Протяженность'
    },
    {
      id: 2,
      icon: <TimeIcon />,
      value: '1 ч',
      description: 'Время в пути'
    },
    {
      id: 3,
      icon: <WalletIcon />,
      value: 'от — руб.',
      description: 'Стоимость'
    }
  ]

  return (
    <div className={s.wrapper}>
      <div className={clsx(s.title, 'font-24-medium white-color')}>Укажите куда вам надо?</div>

      <div className={s.selection}>
        <div className={s.part}>
          <div className={clsx(s.label, 'font-16-normal white-color')}>Точка отправления<span className="orange-color">*</span></div>
          <input
            type="text"
            placeholder="Санкт-Петербург"
            className={s.input}
            value={departurePoint}
            onChange={(e) => setDeparturePoint(e.target.value)}
          />
        </div>

        <div className={s.swapButtonWrapper}>
          <div
            onClick={handleClickSwapAddress}
            className={s.swapButton}>
            <SwapIcon />
          </div>
        </div>


        <div className={s.part}>
          <div className={clsx(s.label, 'font-16-normal white-color')}>Точка прибытия<span className="orange-color">*</span></div>
          <input
            type="text"
            placeholder="Пенза"
            className={s.input}
            value={arrivalPoint}
            onChange={(e) => setArrivalPoint(e.target.value)}
          />
        </div>
      </div>

      <div className={s.info}>
        {infoData.map(info => (
          <div key={info.id} className={s.card}>
            <div className={s.icon}>{info.icon}</div>
            <div className={s.content}>
              <div className={clsx(s.top, 'font-24-medium white-color')}>{info.value}</div>
              <div className={clsx(s.bottom, 'font-14-normal gray-color')}>{info.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={s.order}>
        <div className={s.buttons}>
          <Button type={ButtonTypes.PRIMARY} text="Рассчитать поездку" />
          <Button type={ButtonTypes.SECONDARY} text="Заказать поездку" />
        </div>

        <div className={clsx(s.warning, 'font-14-normal white-color')}>
          Расчеты носят информационно-справочный характер, нажмите Заказать, чтобы узнать точную стоимость. Нажимая на кнопку, вы соглашаетесь на <span className={clsx(s.policy, 'font-14-normal orange-color')}>обработку персональных данных</span>.
        </div>
      </div>

    </div>
  )
}

export default AddressSelect;