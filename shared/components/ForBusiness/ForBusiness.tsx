import { FC } from "react";
import s from './ForBusiness.module.scss'
import ForBusinessContent from "./ForBusinessContent/ForBusinessContent";
import clsx from "clsx";
import Button from "../ui/Button/Button";
import { ButtonTypes } from "@/shared/types/enums";

interface IProps {
 title?:unknown;
}

const ForBusiness: FC<IProps> = () => {

  return (
    <div className={s.wrapper}>
      <div className={clsx(s.container, "container-40")}>
        <div className={s.content}>
          <ForBusinessContent />
          <div className={s.block}>
            <Button type={ButtonTypes.PRIMARY} text="Трансферы Сотрудников и Руководителей" />

            <ul className={s.advantages}>
              <li className={s.advantage}>Оплата <span>по Счету</span></li>
              <li className={s.advantage}>Оплата по Карте - <span>чек с QR кодом</span></li>
              <li className={s.advantage}>Доставка <span>срочных грузов и документов</span></li>
            </ul>

            <Button type={ButtonTypes.SECONDARY} text="Работа по ЭДО.Диадок" />
            <Button type={ButtonTypes.PRIMARY} text="Рассчет для Юрлиц" />
          </div>

        </div>

      </div>
    </div>
  )
}

export default ForBusiness;