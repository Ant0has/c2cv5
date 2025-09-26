import LogoIcon from '@/public/icons/LogoIcon';
import TelegramIcon from '@/public/icons/TelegramIcon';
import WhatsUpIcon from '@/public/icons/WhatsUpIcon';
import { TELEGRAM_LINK, WHATS_UP_LINK } from '@/shared/constants';
import { ButtonTypes } from '@/shared/types/enums';
import clsx from 'clsx';
import Link from 'next/link';
import MenuContent from '../../shared/components/MenuContent/MenuContent';
import Button from '../../shared/components/ui/Button/Button';
import HeaderAdress from './ui/HeaderAdress';
import HeaderPhones from './ui/HeaderPhones';
import s from './Header.module.scss';
import { Suspense } from 'react';

const Header = () => {
  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.left}>
          <div
            className={clsx(s.burger, { [s.open]: false })}
          >
            <Suspense>
              <MenuContent />
            </Suspense>
          </div>

          <div className={s.logo}>
            <Link href='/index.html'>
              <LogoIcon />
            </Link>

          </div>
        </div>
        <div className={s.right}>
          <div className={clsx(s.marker, 'margin-r-24')}>
            <Suspense>
              <MenuContent />
            </Suspense>
          </div>
          <div className={clsx(s.social, 'row-flex-8 margin-r-32')}>
            <Button
              type={ButtonTypes.LINK}
              text='Написать'
              link={TELEGRAM_LINK}
              icon={<TelegramIcon />}
            />
            <Button
              type={ButtonTypes.LINK}
              text='Написать'
              link={WHATS_UP_LINK}
              icon={<WhatsUpIcon />}
            />
          </div>
          <HeaderAdress />
          <HeaderPhones />
        </div>
      </div>
    </header>
  )
}

export default Header;
