'use client'
import { ButtonTypes } from "@/shared/types/enums";
import { Blocks } from "@/shared/types/enums";
import s from './Welcome.module.scss';
import Button from "@/shared/components/ui/Button/Button";
import { useContext } from "react";
import { ModalContext } from "@/app/providers";

interface IWelcomeButtonsProps {
    handleGoToOrder: () => void;
}

const WelcomeButtons = ({ handleGoToOrder }: IWelcomeButtonsProps) => {
    const { setQuestionModalData } = useContext(ModalContext)

    return (
        <div className={s.buttons}>
        <Button type={ButtonTypes.PRIMARY} text='Заказать поездку' handleClick={handleGoToOrder} />
        <Button type={ButtonTypes.DEFAULT} text='Получить консультацию' handleClick={() => setQuestionModalData({ status: true, blockFrom: Blocks.WELCOME })} />
      </div>
    )

}

export default WelcomeButtons;