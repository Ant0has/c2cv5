'use client'

import { RegionsContext, RouteContext } from "@/app/providers";
import MarkerIcon from "@/public/icons/MarkerIcon";
import { IRouteData } from "@/shared/types/route.interface";
import { IRegion } from "@/shared/types/types";
import { Popover } from "antd";
import Link from "next/link";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import s from './MenuContent.module.scss';
import MenuRoutes from "./MenuRoutes";
import clsx from "clsx";
import { usePathname } from "next/navigation";



const MenuContent: FC = () => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const regionsFull = useContext(RegionsContext)
  const { route } = useContext(RouteContext)
  const pathname = usePathname()


  const { regions, moscow, piter, krym } = useMemo(() => {
    const regionsCopy = [...regionsFull]
    let moscow: IRegion = {} as IRegion
    let piter: IRegion = {} as IRegion
    let krym: IRegion = {} as IRegion
    const updatedRegions = regionsCopy.reduce((acc: IRegion[], region) => {
      if (region.url === 'taxi777-mezhgorod-moscow') {
        moscow = region
        return acc;
      }

      if (region.url === 'taxi78-mezhgorod-piter') {
        piter = region
        return acc;
      }

      if (region.url === '82-mezhgorod-krym') {
        krym = region
        return acc;
      }
      acc.push(region);
      return acc;
    }, []);
    return {
      regions: updatedRegions,
      moscow,
      piter,
      krym
    }
  }, [regionsFull])

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
              </ul>
            </div>
          </div>
          <div className={s.menuWrapperSection}>
            <h5 className={s.menuWrapperSectionTitle}>Маршруты:</h5>
            <div className={s.menuWrapperSectionContent}>
              <MenuRoutes
                // moscow={moscow}
                // piter={piter}
                // krym={krym}
                route={route as IRouteData}
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
      className={s.icon}
    >
      <div>
        <MarkerIcon />
      </div>
    </Popover>
  )
}

export default MenuContent;