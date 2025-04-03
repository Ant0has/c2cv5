'use client'

import { ModalContext } from '@/app/providers';
import { Blocks, ButtonTypes } from '@/shared/types/enums';
import clsx from 'clsx';
import { FC, useContext } from 'react';
import Button from '../ui/Button/Button';
import s from './Welcome.module.scss';
import WelcomeContent from './WelcomeContent/WelcomeContent';

interface IWelcomeProps {
  city?: string
  isMilitary?: boolean
  handleGoToOrder: () => void,
}

const Welcome: FC<IWelcomeProps> = ({ city, isMilitary, handleGoToOrder }) => {
  const { setQuestionModalData } = useContext(ModalContext)

  return (
    <div className={clsx(s.wrapper, { [s.military]: isMilitary })}>
      <div className="container-24">
        <div className={clsx(s.content)}>
          <div className={s.left}>
            <WelcomeContent city={city} />
            <div className={s.buttons}>
              <Button type={ButtonTypes.PRIMARY} text='Заказать поездку' handleClick={handleGoToOrder} />
              <Button type={ButtonTypes.DEFAULT} text='Получить консультацию' handleClick={() => setQuestionModalData({ status: true, blockFrom: Blocks.WELCOME })} />
            </div>
          </div>
          <div className={s.right}>
            <img
              src={`/images${isMilitary ? '/military' : ''}/welcome-image.png`}
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
