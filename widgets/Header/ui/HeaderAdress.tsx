'use client'
import { formatPhoneNumber } from '@/shared/services/formate-phone-number';
import s from '../Header.module.scss';
import { useContext } from 'react';
import { RouteContext } from '@/app/providers';
import { getSelectedRegion } from '@/shared/services/get-selected-region';
import { requisitsData } from '@/shared/data/requisits.data';

const HeaderAdress = () => {
    const { route } = useContext(RouteContext)
    const regionData = getSelectedRegion(route)

    const {markedPhone:markedPhoneFirst,phone:phoneFirst} = formatPhoneNumber(requisitsData.PHONE)
    const {markedPhone:markedPhoneRegion,phone:phoneRegion} = formatPhoneNumber(regionData?.phoneNumber || '')

    return (
        <address className={s.phone}>
            {regionData?.address && <p>{regionData.address}</p>}

            <div className={s.block}>
                {regionData?.phoneNumber && (
                    <a href={`tel:${phoneRegion}`} className='font-18-semibold'>
                        {markedPhoneRegion}
                    </a>
                )}

                <a href={`tel:${phoneFirst}`} className='font-18-semibold'>
                    {markedPhoneFirst}
                </a>
                <a href={`mailto:${requisitsData.EMAIL}`} className='font-14-medium orange-color'>
                    {requisitsData.EMAIL}
                </a>
            </div>
        </address>
    );
};

export default HeaderAdress;


