import LogoLightIcon from '@/public/icons/LogoLightIcon';
import clsx from 'clsx';
import s from './Footer.module.scss';
import FooterContacts from './ui/FooterContacts';
import FooterNavigation from './ui/FooterNavigation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={clsx(s.footer)}>
      <div className={s.container}>
        <div className={s.top}>
          <div className={s.description}>
            <LogoLightIcon />
            <p className='font-16-normal white-color'>Добро пожаловать на страницу City2City.ru - ведущего сервиса заказа междугороднего такси! Если вам требуется надежный и комфортабельный транспорт от аэропорта</p>
          </div>
          <FooterNavigation />
          <FooterContacts />
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
