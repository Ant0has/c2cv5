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

    // Split FOs into pages for Swiper
    const pagesCount = isMobile ? 4 : 2
    const fosPerPage = Math.ceil(FEDERAL_DISTRICTS.length / pagesCount)
    const pages: typeof FEDERAL_DISTRICTS[] = []
    for (let i = 0; i < FEDERAL_DISTRICTS.length; i += fosPerPage) {
        pages.push(FEDERAL_DISTRICTS.slice(i, i + fosPerPage))
    }

    return (
        <>
            <div className={s.block}>
                <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/regions/cfo/moskva') })}
                    href="/regions/cfo/moskva/"
                >
                    Москва
                </Link>
                <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/regions/szfo/sankt-peterburg') })}
                    href="/regions/szfo/sankt-peterburg/"
                >
                    Санкт-Петербург
                </Link>
                <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('text-black', { ['text-primary']: pathname?.startsWith('/regions/yufo/krasnodar') })}
                    href="/regions/yufo/krasnodar/"
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
                                        <Link
                                            href={`/regions/${fo.slug}/`}
                                            onClick={() => setIsOpenMenu(false)}
                                            className="text-black"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {fo.shortName}
                                        </Link>
                                    </h2>
                                    <ul className={s.list}>
                                        {fo.cities.map((city) => (
                                            <Link
                                                onClick={() => setIsOpenMenu(false)}
                                                className={clsx('text-black', {
                                                    ['text-primary']: pathname?.startsWith(`/regions/${fo.slug}/${city.slug}`)
                                                })}
                                                href={`/regions/${fo.slug}/${city.slug}/`}
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
