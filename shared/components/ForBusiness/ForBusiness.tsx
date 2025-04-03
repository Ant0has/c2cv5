import { ModalContext } from "@/app/providers";
import { Blocks, ButtonTypes } from "@/shared/types/enums";
import clsx from "clsx";
import { FC, useContext } from "react";
import Button from "../ui/Button/Button";
import s from './ForBusiness.module.scss';
import ForBusinessContent from "./ForBusinessContent/ForBusinessContent";

interface IProps {
  title?: unknown;
}

const ForBusiness: FC<IProps> = () => {
  const { setQuestionModalData } = useContext(ModalContext)

  return (
    <div className={s.wrapper}>
      <div className={clsx(s.container, "container-40")}>
        <div className={s.content}>
          <ForBusinessContent />
          <div className={s.block}>
            <Button type={ButtonTypes.PRIMARY} text="Трансферы Сотрудников и Руководителей" handleClick={() => setQuestionModalData({ status: true, blockFrom: Blocks.TRANSFERS_EMPLOYEES_MANAGERS })} />

            <ul className={s.advantages}>
              <li className={s.advantage}>Оплата <span>по Счету</span></li>
              <li className={s.advantage}>Оплата по Карте - <span>чек с QR кодом</span></li>
              <li className={s.advantage}>Доставка <span>срочных грузов и документов</span></li>
            </ul>

            <Button className={s.green} type={ButtonTypes.SECONDARY} text="Работа по ЭДО.Диадок" handleClick={() => setQuestionModalData({ status: true, blockFrom: Blocks.EDO_DYADOK })} />
            <Button type={ButtonTypes.PRIMARY} text="Рассчет для Юрлиц" handleClick={() => setQuestionModalData({ status: true, blockFrom: Blocks.LEGAL_ENTITIES })} />
          </div>

        </div>

      </div>
    </div>
  )
}

export default ForBusiness;