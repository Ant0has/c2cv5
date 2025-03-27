'use client'

import { FC, useState, useContext } from 'react';
import s from './Header.module.scss'
import LogoIcon from '@/public/icons/LogoIcon';
import MarkerIcon from '@/public/icons/MarkerIcon';
import Button from '../ui/Button/Button';
import { ButtonTypes } from '@/shared/types/enums';
import { EMAIL_ADDRESS, PHONE_NUMBER_FIRST, PHONE_NUMBER_SECOND, TELEGRAM_LINK, WHATS_UP_LINK } from '@/shared/constants';
import TelegramIcon from '@/public/icons/TelegramIcon';
import WhatsUpIcon from '@/public/icons/WhatsUpIcon';
import { formatPhoneNumber } from '@/shared/services/formate-phone-number';
import clsx from 'clsx';
import PhoneIcon from '@/public/icons/PhoneIcon';
import { Popover } from 'antd';
import Link from 'next/link';
import MenuContent from '../MenuContent/MenuContent';
import { RegionsContext } from '@/app/providers';
import { usePathname } from 'next/navigation';
import { getSelectedRegion } from '@/shared/services/get-selected-region';

interface IHeaderProps {

}

const Header: FC<IHeaderProps> = () => {
  const regions = useContext(RegionsContext)

  const pathname = usePathname()
  const [isOpenPhone, setIsOpenPhone] = useState<boolean>(false)

  const regionData = getSelectedRegion({ regions, pathname })

  console.log('regionData', regionData)

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.left}>
          <div
            className={clsx(s.burger, { [s.open]: false })}
          >
            <MenuContent />
          </div>

          <div className={s.logo}>
            <Link href='/'>
              <LogoIcon />
            </Link>

          </div>
        </div>
        <div className={s.right}>
          <div className={clsx(s.marker, 'margin-r-24')}>
            <MenuContent />

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

          <address className={s.phone}>
            {regionData?.address && <p>{regionData?.address}</p>}

            <div className={s.block}>
              {regionData?.phoneNumber && <a href={`tel:+${regionData?.phoneNumber}`} className='font-18-semibold'>
                {formatPhoneNumber(regionData?.phoneNumber)}
              </a>}

              <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-18-semibold'>
                {formatPhoneNumber(PHONE_NUMBER_FIRST)}
              </a>
              <a href={`mailto:${EMAIL_ADDRESS}`} className='font-14-medium orange-color'>{EMAIL_ADDRESS}</a>
            </div>
          </address>


          <Popover
            content={
              <div className={s.content}>
                {regionData?.phoneNumber && <a href={`tel:+${regionData?.phoneNumber}`} className='font-18-semibold black-color'>
                  {formatPhoneNumber(regionData?.phoneNumber)}
                </a>}
                <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-18-semibold black-color'>
                  {formatPhoneNumber(PHONE_NUMBER_FIRST)}
                </a>
                <a href={`mailto:${EMAIL_ADDRESS}`} className='font-14-medium orange-color'>{EMAIL_ADDRESS}</a>
              </div>
            }
            trigger="click"
            open={isOpenPhone}
            onOpenChange={(value) => setIsOpenPhone(value)}
            placement="bottomLeft"
            className={s.icon}
          >
            <div>
              <PhoneIcon />
            </div>
          </Popover>
        </div>
      </div>
    </header>
  )
}

export default Header;
