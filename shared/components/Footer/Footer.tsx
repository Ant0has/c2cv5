import s from './Footer.module.scss'
import clsx from 'clsx';
import LogoLightIcon from '@/public/icons/LogoLightIcon';
import { EMAIL_ADDRESS, PHONE_NUMBER_FIRST, PHONE_NUMBER_SECOND, TELEGRAM_LINK, WHATS_UP_LINK } from '@/shared/constants';
import { formatPhoneNumber } from '@/shared/services/formate-phone-number';
import Button from '../ui/Button/Button';
import { ButtonTypes } from '@/shared/types/enums';
import TelegramIcon from '@/public/icons/TelegramIcon';
import WhatsUpIcon from '@/public/icons/WhatsUpIcon';
import Link from 'next/link';

const Footer = () => {
  const navList = [
    {
      id: 1,
      label: 'Контакты',
      route: 'contacts'
    },
    {
      id: 2,
      label: 'Рассчитать',
      route: ''
    },
    {
      id: 3,
      label: 'Консультация',
      route: ''
    },
    {
      id: 4,
      label: 'Наша команда',
      route: 'team'
    },
    {
      id: 5,
      label: 'Оферта для юр.лиц',
      route: ''
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
          <div className={s.navigation}>
            {navList.map(link => (
              <Link

                key={link.id}
                className='white-color font-18-medium'
                href={link.route}>{link.label}</Link>
            ))}
          </div>
          <div className={s.contacts}>
            <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-32-semibold white-color'>
              {formatPhoneNumber(PHONE_NUMBER_FIRST)}
            </a>
            <div>
              <a href={`tel:+${PHONE_NUMBER_SECOND}`} className='font-32-semibold white-color'>
                {formatPhoneNumber(PHONE_NUMBER_SECOND)}
              </a>
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
