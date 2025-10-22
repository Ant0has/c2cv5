import clsx from 'clsx';
import { FC } from 'react';
import s from './Welcome.module.scss';
import WelcomeButtons from './WelcomeButtons';
import WelcomeContent from './WelcomeContent/WelcomeContent';
import Image from 'next/image';

import welcomeImage from '@/public/images/welcome-image.png';
import militaryImage from '@/public/images/military/welcome-image.png';

interface IWelcomeProps {
  city?: string
  isMilitary?: boolean
  handleGoToOrder: () => void,
}

const Welcome: FC<IWelcomeProps> = ({ city, isMilitary, handleGoToOrder }) => {

  return (
    <div className={clsx(s.wrapper, { [s.military]: isMilitary })}>
      <div className="container-24">
        <div className={clsx(s.content)}>
          <div className={s.left}>
            <WelcomeContent city={city} isMilitary={isMilitary} />
            <WelcomeButtons handleGoToOrder={handleGoToOrder} />
          </div>
          <div className={s.right}>
          <Image
              priority
              width={600}
              height={400}
              quality={85}
              className={s.image}
              alt="welcome city2city"
              src={isMilitary ? militaryImage : welcomeImage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome;
