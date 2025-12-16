'use client'

import { ModalContext, RouteContext } from '@/app/providers'
import Link from 'next/link'
import { useContext, useMemo } from 'react'
import s from '../Footer.module.scss'
import { getSelectedRegion } from '@/shared/services/get-selected-region'
import { goToOrder } from '@/shared/services/go-to-order'
import { Blocks } from '@/shared/types/enums'

const FooterNavigation = () => {
  const { route } = useContext(RouteContext)
  const { setQuestionModalData } = useContext(ModalContext)

  const regionData = useMemo(() => getSelectedRegion(route), [route])

  const navList = useMemo(() => ([
    { id: 1, label: 'Контакты', route: 'contacts' },
    { id: 2, label: 'Рассчитать', route: '', handleClick: () => goToOrder() },
    { id: 3, label: 'Консультация', route: '', handleClick: () => setQuestionModalData({ status: true, blockFrom: Blocks.FOOTER }) },
    { id: 4, label: 'Наша команда', route: 'team' },
    { id: 5, label: 'Оферта для юр.лиц', route: 'oferta' },
    { id: 6, label: 'Для бизнеса', route: 'dlya-biznesa' },
  ]), [setQuestionModalData])

  return (
    <div className={s.navigationBlock}>
      <div className={s.navigation}>
        {navList.map(link => !link?.handleClick ? (
          <Link
            key={link.id}
            className='white-color font-18-medium'
            href={link.route}>{link.label}</Link>
        ) : (
          <a key={link.id} onClick={link?.handleClick} className='white-color font-18-medium cursor-pointer'>{link.label}</a>
        ))}
      </div>
      {regionData?.address && <p className='white-color'>{regionData?.address}</p>}
    </div>
  )
}

export default FooterNavigation



