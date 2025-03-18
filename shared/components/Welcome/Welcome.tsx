'use client'

import { FC, useContext } from 'react';
import s from './Welcome.module.scss'
import WelcomeContent from './WelcomeContent/WelcomeContent';
import Button from '../ui/Button/Button';
import { ButtonTypes } from '@/shared/types/enums';
import clsx from 'clsx';
import { ModalContext } from '@/app/providers';

interface IWelcomeProps {
  handleGoToOrder: () => void,
  city?: string
}

const Welcome: FC<IWelcomeProps> = ({ handleGoToOrder, city }) => {
  const { setIsOpenQuestionModal } = useContext(ModalContext)

  return (
    <div className={s.wrapper}>
      <div className="container-24">
        <div className={clsx(s.content)}>
          <div className={s.left}>
            <WelcomeContent city={city ?? ''} />
            <div className={s.buttons}>
              <Button type={ButtonTypes.PRIMARY} text='Заказать поездку' handleClick={handleGoToOrder} />
              <Button type={ButtonTypes.DEFAULT} text='Получить консультацию' handleClick={() => setIsOpenQuestionModal(true)} />
            </div>
          </div>
          <div className={s.right}>
            <img
              src="/images/welcome-image.png"
              alt="welcome city2city"
              loading='lazy'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome;
