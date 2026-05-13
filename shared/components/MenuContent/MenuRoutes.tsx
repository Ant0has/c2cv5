'use client'

import { useState, useEffect, useRef } from "react"
import clsx from "clsx"
import Link from "next/link"
import s from './MenuContent.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { FEDERAL_DISTRICTS } from "@/pages-list/region-hubs/config/registry"
import { usePathname } from "next/navigation"

const cityHref = (citySlug: string) => `/mezhgorod/${citySlug}`
const cityIsActive = (pathname: string | null, citySlug: string) =>
    pathname?.startsWith(`/mezhgorod/${citySlug}`) ?? false

interface IMenuRoutesProps {
    setIsOpenMenu: (value: boolean) => void
}

const MenuRoutes = ({ setIsOpenMenu }: IMenuRoutesProps) => {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const pathname = usePathname()
    const isInitialRender = useRef(true)

    // Close menu on navigation (skip initial render)
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false
            return
        }
        setIsOpenMenu(false)
    }, [pathname])

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

    // Filter out hidden cities and skip FOs that end up with no visible cities
    const visibleFos = FEDERAL_DISTRICTS
        .map(fo => ({ ...fo, cities: fo.cities.filter(c => !c.menuHidden) }))
        .filter(fo => fo.cities.length > 0)

    // Split FOs into pages for Swiper
    const pagesCount = isMobile ? 4 : 2
    const fosPerPage = Math.ceil(visibleFos.length / pagesCount)
    const pages: typeof visibleFos[] = []
    for (let i = 0; i < visibleFos.length; i += fosPerPage) {
        pages.push(visibleFos.slice(i, i + fosPerPage))
    }

    return (
        <>
            <div className={s.block}>
                <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('text-black', { ['text-primary']: cityIsActive(pathname, 'moskva') })}
                    href="/mezhgorod/moskva/"
                >
                    Москва
                </Link>
                <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('text-black', { ['text-primary']: cityIsActive(pathname, 'sankt-peterburg') })}
                    href="/mezhgorod/sankt-peterburg/"
                >
                    Санкт-Петербург
                </Link>
                <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('text-black', { ['text-primary']: cityIsActive(pathname, 'krasnodar') })}
                    href="/mezhgorod/krasnodar/"
                >
                    Краснодар
                </Link>
            </div>

            <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={30}
                style={{ maxWidth: isMobile ? '300px' : '620px' }}
                className={s.swiper}
            >
                {pages.map((pageFos, index) => (
                    <SwiperSlide key={index}>
                        <div className={clsx(s.content, { [s.contentMobile]: isMobile })}>
                            {pageFos.map((fo) => (
                                <div className={s.group} key={fo.slug}>
                                    <h2>
                                        <span className="text-black" style={{ fontWeight: 600 }}>
                                            {fo.shortName}
                                        </span>
                                    </h2>
                                    <ul className={s.list}>
                                        {fo.cities.map((city) => (
                                            <Link
                                                onClick={() => setIsOpenMenu(false)}
                                                className={clsx('text-black', {
                                                    ['text-primary']: cityIsActive(pathname, city.slug)
                                                })}
                                                href={cityHref(city.slug)}
                                                key={city.slug}
                                            >
                                                {city.name}
                                            </Link>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

export default MenuRoutes
