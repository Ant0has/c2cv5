'use client'

import { ModalContext } from '@/app/providers'
import { routesConfig } from '@/shared/configs/routes.config'
import { scrollToBlockById } from '@/shared/services/scroll-to-block'
import { Blocks } from '@/shared/types/enums'
import { IRouteData } from '@/shared/types/route.interface'
import Link from 'next/link'
import { MouseEvent, useCallback, useContext, useMemo } from 'react'
import s from '../Footer.module.scss'
import { requisitsData } from '@/shared/data/requisits.data'

const FooterNavigation = ({route}: {route: IRouteData}) => {
  const { setQuestionModalData } = useContext(ModalContext)
  const handleCalculate = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (document.getElementById('order')) {
      event.preventDefault()
      scrollToBlockById('order')
    }
  }, [])

  const navList = useMemo(() => ([
    { id: 13, label: 'Такси межгород', route: '/mezhgorod' },
    { id: 14, label: 'Направления отдыха', route: '/napravleniya' },
    { id: 4, label: 'О компании', route: routesConfig.getAboutRoute() },
    { id: 7, label: 'Контакты', route: routesConfig.getContactsRoute() },
    { id: 2, label: 'Рассчитать', route: '/mezhgorod#order', handleClick: handleCalculate },
    { id: 6, label: 'Для бизнеса', route: routesConfig.getForBusinessRoute() },
    { id: 12, label: 'Доставка грузов', route: routesConfig.getDostavkaGruzovRoute() },
    { id: 3, label: 'Консультация', route: '', handleClick: () => setQuestionModalData({ status: true, blockFrom: Blocks.FOOTER }) },
  ]), [setQuestionModalData, handleCalculate])

  const legalInfoNavList = useMemo(() => ([
    { id: 8, label: 'Оферта для юр.лиц', route: routesConfig.getOfertaRoute() },
    { id: 9, label: 'Пользовательское соглашение', route: routesConfig.getTermsRoute() },
    { id: 10, label: 'Политика конфиденциальности', route: routesConfig.getPrivacyPolicyRoute() },
    { id: 11, label: 'Условия отмены и возврата', route: routesConfig.getCancellationRoute() },
  ]), [])

  const showNavlist = useCallback((list: Array<{ id: number, label: string, route: string, handleClick?: (event: MouseEvent<HTMLAnchorElement>) => void }>) => {
    return list.map(link => !link?.handleClick ? (
      <Link
        key={link.id}
        className='text-white font-18-medium' href={link.route}>{link.label}</Link>
    ) : (
      <a key={link.id} href={link.route || undefined} onClick={link?.handleClick} className='text-white font-18-medium cursor-pointer'>{link.label}</a>
    ))
  }, [scrollToBlockById, setQuestionModalData])

  return (
    <div className={s.navigationBlock}>
      <div className={s.navigation}>
        <div className={s.navigationColumn}>{showNavlist(navList)}</div>
        <div className={s.navigationColumn}>{showNavlist(legalInfoNavList)}</div>
        <div className={s.navigationColumn}>
          <p className='text-white font-18-medium'>{requisitsData.NAME}</p>
          <p className='text-white font-18-normal'>ИНН {requisitsData.INN}</p>
          <p className='text-white font-18-normal'>ОГРНИП {requisitsData.OGRNIP}</p>
        </div>

      </div>
    </div>
  );
};

export default FooterNavigation;
