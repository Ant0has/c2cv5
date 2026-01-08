'use client'
import { formatPhoneNumber } from '@/shared/services/formate-phone-number';
import s from '../Header.module.scss';
import { FC, useContext } from 'react';
import { RouteContext } from '@/app/providers';
import { getSelectedRegion } from '@/shared/services/get-selected-region';
import { requisitsData } from '@/shared/data/requisits.data';
import { clsx } from 'clsx';

interface IProps {
    isDark?: boolean;
}

const HeaderAdress: FC<IProps> = ({ isDark }) => {
    const { route } = useContext(RouteContext)
    const regionData = getSelectedRegion(route)

    const {markedPhone:markedPhoneFirst,phone:phoneFirst} = formatPhoneNumber(requisitsData.PHONE)
    const {markedPhone:markedPhoneRegion,phone:phoneRegion} = formatPhoneNumber(regionData?.phoneNumber || '')

    const colorClassName = clsx({ ['text-white']: isDark },{ ['text-black']: !isDark })

    return (
        <address className={clsx(s.phone, colorClassName)}>
            {regionData?.address && <p>{regionData.address}</p>}

            <div className={s.block}>
                {regionData?.phoneNumber && (
                    <a href={`tel:${phoneRegion}`} className={clsx('font-18-semibold', colorClassName)}>
                        {markedPhoneRegion}
                    </a>
                )}

                <a href={`tel:${phoneFirst}`} className={clsx('font-18-semibold', colorClassName)}>
                    {markedPhoneFirst}
                </a>
                <a href={`mailto:${requisitsData.EMAIL}`} className={clsx('font-14-medium text-primary', colorClassName)}>
                    {requisitsData.EMAIL}
                </a>
            </div>
        </address>
    );
};

export default HeaderAdress;


