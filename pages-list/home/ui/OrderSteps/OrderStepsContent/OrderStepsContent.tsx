import { FC } from "react";
import s from './OrderStepsContent.module.scss'
import clsx from "clsx";
import ApplicationIcon from "@/public/icons/ApplicationIcon";
import MobileIcon from "@/public/icons/MobileIcon";
import MessageIcon from "@/public/icons/MessageIcon";

interface IProps {
 title?:unknown;
}

const OrderStepsContent: FC<IProps> = () => {

  const orderContent = [
    {
      id: 1,
      icon: <ApplicationIcon />,
      label: 'Оставить заявку',
      description: 'Онлайн или по телефону'
    },
    {
      id: 2,
      icon: <MobileIcon />,
      label: 'Мы позвоним вам',
      description: 'Уточним детали заказа'
    },
    {
      id: 3,
      icon: <MessageIcon />,
      label: 'Получите уведомление',
      description: 'Пришлем информацию по водителю и машине за день до поездки'
    }
  ]

  return (
    <>
      <div className={clsx(s.title, 'font-56-medium')}>
        <span className="font-56-medium orange-color">3 шага</span> для заказа Такси
      </div>

      <div className={s.steps}>
        {orderContent.map(step => (
          <div key={step.id} className={s.card}>
            <div className={s.icon}>{step.icon}</div>
            <div className={s.content}>
              <div className={clsx(s.top, 'font-24-medium black-color')}>{step.label}</div>
              <div className={clsx(s.bottom, 'font-14-normal gray-color')}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default OrderStepsContent;
