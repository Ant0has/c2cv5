'use client'

import MarkerIcon from "@/public/icons/MarkerIcon";
import { Popover } from "antd";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import s from './MenuContent.module.scss';
import MenuRoutes from "./MenuRoutes";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const MenuContent: FC = () => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 700)
      }
    }

    checkMobile()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])


  return (
    <Popover
      content={
        <div className={s.menuWrapper}>
          <div className={s.menuWrapperSection}>
            <h5 className={s.menuWrapperSectionTitle}>Направления:</h5>
            <div className={s.menuWrapperSectionContent}>
              <ul>
                <li>
                  <Link href="/gornolyzhka" className={clsx('text-black', { ['text-primary']: pathname === '/gornolyzhka' })}>
                    Горнолыжные курорты
                  </Link>
                </li>
                <li>
                  <Link href="/svo" className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/svo') })}>
                    Новые территории (СВО)
                  </Link>
                </li>
                <li>
                  <Link href="/morskoj-otdyh" className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/morskoj-otdyh') })}>
                    Морской отдых
                  </Link>
                </li>
                <li>
                  <Link href="/dlya-biznesa" className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/dlya-biznesa') })}>
                    Для бизнеса
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={s.menuWrapperSection}>
            <h5 className={s.menuWrapperSectionTitle}>Маршруты:</h5>
            <div className={s.menuWrapperSectionContent}>
              <MenuRoutes
                setIsOpenMenu={setIsOpenMenu}
              />
            </div>
          </div>
        </div>

      }
      trigger="click"
      open={isOpenMenu}
      onOpenChange={(value) => setIsOpenMenu(value)}
      placement={isMobile ? 'bottomRight' : 'bottom'}
      getPopupContainer={(trigger) => trigger.parentElement || document.body}
      className={s.icon}
    >
      <div style={{ cursor: 'pointer' }}>
        <MarkerIcon />
      </div>
    </Popover>
  )
}

export default MenuContent;