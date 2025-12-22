'use client'

import { ModalContext, RouteContext } from '@/app/providers'
import Link from 'next/link'
import { useCallback, useContext, useMemo } from 'react'
import s from '../Footer.module.scss'
import { getSelectedRegion } from '@/shared/services/get-selected-region'
import { goToOrder } from '@/shared/services/go-to-order'
import { Blocks } from '@/shared/types/enums'
import { routesConfig } from '@/shared/configs/routes.config'

const FooterNavigation = () => {
  const { route } = useContext(RouteContext)
  const { setQuestionModalData } = useContext(ModalContext)

  const regionData = useMemo(() => getSelectedRegion(route), [route])

  const navList = useMemo(() => ([
    // { id: 0, label: 'О компании', route: '/about' },
    { id: 2, label: 'Рассчитать', route: '', handleClick: goToOrder },
    { id: 3, label: 'Консультация', route: '', handleClick: () => setQuestionModalData({ status: true, blockFrom: Blocks.FOOTER }) },
    { id: 4, label: 'Наша команда', route: routesConfig.getAboutRoute() },
    { id: 6, label: 'Для бизнеса', route: routesConfig.getForBusinessRoute() },
  ]), [setQuestionModalData, goToOrder])

  const legalInfoNavList = useMemo(() => ([
    { id: 1, label: 'Контакты', route: routesConfig.getContactsRoute() },
    { id: 1, label: 'Оферта для юр.лиц', route: routesConfig.getForBusinessRoute() },
    { id: 2, label: 'Пользовательское соглашение', route: routesConfig.getTermsRoute() },
    { id: 0, label: 'Политика конфиденциальности', route: routesConfig.getPrivacyPolicyRoute() },
    { id: 3, label: 'Условия отмены и возврата', route: routesConfig.getCancellationRoute() },
  ]), [])

  const showNavlist = useCallback((list: Array<{ id: number, label: string, route: string, handleClick?: () => void }>) => {
    return list.map(link => !link?.handleClick ? (
      <Link
        key={link.id}
        className='white-color font-18-medium' href={link.route}>{link.label}</Link>
    ) : (
      <a key={link.id} onClick={link?.handleClick} className='white-color font-18-medium cursor-pointer'>{link.label}</a>
    ))
  }, [goToOrder, setQuestionModalData])

  return (
    <div className={s.navigationBlock}>
      <div className={s.navigation}>
        <div className={s.navigationColumn}>{showNavlist(navList)}</div>
        <div className={s.navigationColumn}>{showNavlist(legalInfoNavList)}</div>
        <div className={s.navigationColumn}>
          <p className='white-color font-18-medium'>ИП Фурсенко К.В.</p>
          <p className='white-color font-18-normal'>ИНН 616606322786</p>
          <p className='white-color font-18-normal'>ОГРНИП 318619600202822</p>
        </div>

      </div>
      {regionData?.address && <p className='white-color'>{regionData?.address}</p>}
    </div>
  );
};

export default FooterNavigation;
