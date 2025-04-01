import { ModalContext } from "@/app/providers";
import { ButtonTypes } from "@/shared/types/enums";
import clsx from "clsx";
import { FC, useContext } from "react";
import Button from "../ui/Button/Button";
import s from './ForBusiness.module.scss';
import ForBusinessContent from "./ForBusinessContent/ForBusinessContent";

interface IProps {
  title?: unknown;
}

const ForBusiness: FC<IProps> = () => {
  const { setIsOpenQuestionModal } = useContext(ModalContext)

  return (
    <div className={s.wrapper}>
      <div className={clsx(s.container, "container-40")}>
        <div className={s.content}>
          <ForBusinessContent />
          <div className={s.block}>
            <Button type={ButtonTypes.PRIMARY} text="Трансферы Сотрудников и Руководителей" handleClick={() => setIsOpenQuestionModal(true)} />

            <ul className={s.advantages}>
              <li className={s.advantage}>Оплата <span>по Счету</span></li>
              <li className={s.advantage}>Оплата по Карте - <span>чек с QR кодом</span></li>
              <li className={s.advantage}>Доставка <span>срочных грузов и документов</span></li>
            </ul>

            <Button className={s.green} type={ButtonTypes.SECONDARY} text="Работа по ЭДО.Диадок" handleClick={() => setIsOpenQuestionModal(true)} />
            <Button type={ButtonTypes.PRIMARY} text="Рассчет для Юрлиц" handleClick={() => setIsOpenQuestionModal(true)} />
          </div>

        </div>

      </div>
    </div>
  )
}

export default ForBusiness;