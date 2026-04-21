'use client'

import MarkerIcon from "@/public/icons/MarkerIcon";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import s from './MenuContent.module.scss';
import MenuRoutes from "./MenuRoutes";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const MenuContent: FC = () => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!isOpenMenu) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpenMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpenMenu])

  // Close on Escape
  useEffect(() => {
    if (!isOpenMenu) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpenMenu(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpenMenu])

  return (
    <div className={s.menuContainer} ref={menuRef}>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => setIsOpenMenu(!isOpenMenu)}
      >
        <MarkerIcon />
      </div>

      {isOpenMenu && (
        <div className={s.dropdown}>
          <div className={s.menuWrapper}>
            <div className={s.menuWrapperSection}>
              <h5 className={s.menuWrapperSectionTitle}>Направления:</h5>
              <div className={s.menuWrapperSectionContent}>
                <ul>
                  <li>
                    <Link href="/mezhgorod" onClick={() => setIsOpenMenu(false)} className={clsx('text-black', { ['text-primary']: pathname === '/mezhgorod' || pathname?.startsWith('/mezhgorod/') })}>
                      Межгород
                    </Link>
                  </li>
                  <li>
                    <Link href="/gornolyzhka" onClick={() => setIsOpenMenu(false)} className={clsx('text-black', { ['text-primary']: pathname === '/gornolyzhka' })}>
                      Горнолыжные курорты
                    </Link>
                  </li>
                  <li>
                    <Link href="/svo" onClick={() => setIsOpenMenu(false)} className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/svo') })}>
                      Новые территории (СВО)
                    </Link>
                  </li>
                  <li>
                    <Link href="/morskoj-otdyh" onClick={() => setIsOpenMenu(false)} className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/morskoj-otdyh') })}>
                      Морской отдых
                    </Link>
                  </li>
                  <li>
                    <Link href="/dlya-biznesa" onClick={() => setIsOpenMenu(false)} className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/dlya-biznesa') })}>
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
        </div>
      )}
    </div>
  )
}

export default MenuContent;
