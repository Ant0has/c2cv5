'use client'

import { useContext, useState } from "react"
import clsx from "clsx"
import Link from "next/link"
import { IRegion } from "@/shared/types/types"
import s from './MenuContent.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { IRoute, IRouteData } from "@/shared/types/route.interface"
import { useMemo } from "react"
import { RegionsContext } from "@/app/providers"

const getValidName = (region: IRegion) => {
    return region.region_value || region.meta_value || region.url || ''
}

interface IMenuRoutesProps {
    // moscow: IRegion
    // piter: IRegion
    // krym: IRegion
    route: IRouteData
    setIsOpenMenu: (value: boolean) => void
}

const MenuRoutes = ({ route, setIsOpenMenu }: IMenuRoutesProps) => {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const regions = useContext(RegionsContext) as IRegion[]





    const splitIntoPages = (groups: Record<string, IRegion[]>) => {
        const letters = Object.keys(groups);
        let totalItems = 0;
        const itemsPerGroup = letters.map(letter => ({
            letter,
            count: groups[letter].length
        }));

        // Считаем общее количество элементов
        totalItems = itemsPerGroup.reduce((sum, group) => sum + group.count, 0);
        const pagesCount = isMobile ? 7 : 3;
        const targetItemsPerPage = Math.ceil(totalItems / pagesCount);

        const pages: string[][] = [[]];
        let currentPage = 0;
        let currentPageItems = 0;

        itemsPerGroup.forEach(({ letter, count }) => {
            // Если текущая страница уже близка к целевому количеству и не последняя, начинаем новую
            if (currentPageItems > targetItemsPerPage && currentPage < (pagesCount - 1)) {
                currentPage++;
                currentPageItems = 0;
                pages[currentPage] = [];
            }

            pages[currentPage].push(letter);
            currentPageItems += count;
        });

        return pages;
    }



    const groupByFirstLetter = (data: IRegion[]): Record<string, IRegion[]> => {
        return data
            .sort((a, b) => getValidName(a).localeCompare(getValidName(b)))
            .reduce((acc: Record<string, IRegion[]>, item) => {
                const firstLetter = getValidName(item)[0].toUpperCase();
                if (!acc[firstLetter]) {
                    acc[firstLetter] = [];
                }
                acc[firstLetter].push(item);
                return acc;
            }, {});
    };

    const groupedData = useMemo(() => {
        return groupByFirstLetter(regions)
    }, [regions])

    const pages = useMemo(() => {
        return splitIntoPages(groupedData)
    }, [groupedData, isMobile])

    const renderPage = (letters: string[]) => (
        <div className={clsx(s.content, { [s.contentMobile]: isMobile })}>
            {letters.map((letter) => (
                <div className={s.group} key={letter}>
                    <h2>{letter}</h2>
                    <ul className={s.list}>
                        {groupedData[letter].map((region) => (
                            <Link
                                onClick={() => setIsOpenMenu(false)}
                                className={clsx('black-color', { ['orange-color']: region.url === route?.regions_data?.url })}
                                href={`/${region.url || ''}.html`}
                                key={region.meta_id}
                            >
                                {getValidName(region)}
                            </Link>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )

    return (
        <>
            <div className={s.block}>

                {/* <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('black-color', { ['orange-color']: moscow.url === route?.regions_data?.url })}
                    href={`/${moscow.url || ''}.html`}
                >
                    {getValidName(moscow)}
                </Link>
                <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('black-color', { ['orange-color']: piter.url === route?.regions_data?.url })}
                    href={`/${piter.url || ''}.html`}
                >
                    {getValidName(piter)}
                </Link>
                <Link
                    onClick={() => setIsOpenMenu(false)}
                    className={clsx('black-color', { ['orange-color']: krym.url === route?.regions_data?.url })}
                    href={`/${krym.url || ''}.html`}
                >
                    {getValidName(krym)}
                </Link> */}
            </div>

            <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={30}
                style={{ maxWidth: isMobile ? '300px' : '620px' }}
                className={s.swiper}
            >
                {pages.map((page, index) => (
                    <SwiperSlide key={index}>
                        {renderPage(page)}
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

export default MenuRoutes