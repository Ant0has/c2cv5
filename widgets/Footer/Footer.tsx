'use client'
import LogoLightIcon from '@/public/icons/LogoLightIcon';
import { getSelectedRegion } from '@/shared/services/get-selected-region';
import { IRouteData } from '@/shared/types/route.interface';
import clsx from 'clsx';
import s from './Footer.module.scss';
import FooterContacts from './ui/FooterContacts';
import FooterNavigation from './ui/FooterNavigation';
import { useContext, useMemo } from 'react';
import { RouteContext } from '@/app/providers';

const Footer = () => {
  const { route } = useContext(RouteContext)
  const regionData = useMemo(() => getSelectedRegion(route), [route])
  return (
    <footer className={clsx(s.footer)}>
      <div className={s.container}>
        <div className={s.top}>
          <div className={s.description}>
            <LogoLightIcon />
            <p className='font-16-normal white-color'>Добро пожаловать на страницу City2City.ru - ведущего сервиса заказа междугороднего такси! Если вам требуется надежный и комфортабельный транспорт от аэропорта</p>
            {regionData?.address && <p className='white-color text-left align-left'>{regionData?.address}</p>}
          </div>



          <FooterNavigation route={route as IRouteData} />

          {
            regionData?.address && (
              <div className={s.addressMobile}>
                <p className='white-color text-left align-left'>{regionData?.address}</p>
              </div>
            )
          }
          <FooterContacts />
        </div>
      </div>
    </footer>
  )
}

export default Footer;
