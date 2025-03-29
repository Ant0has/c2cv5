'use client'

import { ModalContext, RegionsContext } from '@/app/providers';
import LogoLightIcon from '@/public/icons/LogoLightIcon';
import TelegramIcon from '@/public/icons/TelegramIcon';
import WhatsUpIcon from '@/public/icons/WhatsUpIcon';
import { EMAIL_ADDRESS, PHONE_NUMBER_FIRST, TELEGRAM_LINK, WHATS_UP_LINK } from '@/shared/constants';
import { formatPhoneNumber } from '@/shared/services/formate-phone-number';
import { getSelectedRegion } from '@/shared/services/get-selected-region';
import { goToOrder } from '@/shared/services/go-to-order';
import { ButtonTypes } from '@/shared/types/enums';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useMemo } from 'react';
import Button from '../ui/Button/Button';
import s from './Footer.module.scss';

const Footer = () => {
  const regions = useContext(RegionsContext)
  const { setIsOpenQuestionModal } = useContext(ModalContext)
  const pathname = usePathname()

  const regionData = useMemo(() => {
    return getSelectedRegion({ regions, pathname })
  }, [])

  const navList = [
    {
      id: 1,
      label: 'Контакты',
      route: 'contacts'
    },
    {
      id: 2,
      label: 'Рассчитать',
      route: '',
      handleClick: () => goToOrder()
    },
    {
      id: 3,
      label: 'Консультация',
      route: '',
      handleClick: () => setIsOpenQuestionModal(true)
    },
    {
      id: 4,
      label: 'Наша команда',
      route: 'team'
    },
    {
      id: 5,
      label: 'Оферта для юр.лиц',
      route: 'oferta'
    },
  ]

  const currentYear = new Date().getFullYear();

  return (
    <footer className={clsx(s.footer)}>
      <div className={s.container}>
        <div className={s.top}>
          <div className={s.description}>
            <LogoLightIcon />
            <p className='font-16-normal white-color'>Добро пожаловать на страницу City2City.ru - ведущего сервиса заказа междугороднего такси! Если вам требуется надежный и комфортабельный транспорт от аэропорта</p>
          </div>
          <div className={s.navigationBlock}>
            <div className={s.navigation}>
              {navList.map(link => !link?.handleClick ? (
                <Link
                  key={link.id}
                  className='white-color font-18-medium'
                  href={link.route}>{link.label}</Link>
              ) : (
                <a onClick={link?.handleClick} className='white-color font-18-medium cursor-pointer'>{link.label}</a>
              ))}
            </div>
            {regionData?.address && <p className='white-color'>{regionData?.address}</p>}
          </div>
          <div className={s.contacts}>
            {regionData?.phoneNumber && <a href={`tel:+${regionData?.phoneNumber}`} className='font-32-semibold white-color'>
              {formatPhoneNumber(regionData?.phoneNumber)}
            </a>}
            <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-32-semibold white-color'>
              {formatPhoneNumber(PHONE_NUMBER_FIRST)}
            </a>
            <div>
              {/* <a href={`tel:+${PHONE_NUMBER_SECOND}`} className='font-32-semibold white-color'>
                {formatPhoneNumber(PHONE_NUMBER_SECOND)}
              </a> */}
              <p className={clsx(s.phoneDescription, 'font-14-normal white-color')}>8:00 - 23:00 МСК Бесплатно по России</p>
            </div>


            <a href={`mailto:${EMAIL_ADDRESS}`} className='font-32-semibold white-color'>{EMAIL_ADDRESS}</a>

            <div className={clsx(s.social, 'row-flex-8')}>
              <Button
                type={ButtonTypes.LINK}
                link={TELEGRAM_LINK}
                icon={<TelegramIcon />}
                className={s.roundLink}
              />
              <Button
                type={ButtonTypes.LINK}
                link={WHATS_UP_LINK}
                icon={<WhatsUpIcon />}
                className={s.roundLink}
              />
            </div>

          </div>
        </div>
        <div className={s.bottom}>
          <p className='font-16-normal white-color'>© {currentYear} city2city. Все права защищены  </p>
          <div className='font-16-normal white-color'>Политика конфиденциальности</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
