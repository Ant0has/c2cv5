import { FC, ReactElement } from 'react';
import Image from 'next/image'
import s from './Welcome.module.scss'
import WelcomeContent from './WelcomeContent/WelcomeContent';
import Button from '../ui/Button/Button';
import { ButtonTypes } from '@/shared/types/enums';
import clsx from 'clsx';

interface IWelcomeProps {
}

const Welcome: FC<IWelcomeProps> = () => {
  return (
    <div className={s.wrapper}>
      <div className="container">
        <div className={clsx(s.content)}>
          <div className={s.left}>
            <WelcomeContent city='Москва' />
            <div className={s.buttons}>
              <Button type={ButtonTypes.PRIMARY} text='Заказать поездку' />
              <Button type={ButtonTypes.DEFAULT} text='Получить консультацию' />
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
