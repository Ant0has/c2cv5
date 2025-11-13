'use client'
import { EMAIL_ADDRESS, PHONE_NUMBER_FIRST } from '@/shared/constants';
import { formatPhoneNumber } from '@/shared/services/formate-phone-number';
import s from '../Header.module.scss';
import { useContext } from 'react';
import { RouteContext } from '@/app/providers';
import { getSelectedRegion } from '@/shared/services/get-selected-region';

const HeaderAdress = () => {
    const { route } = useContext(RouteContext)
    const regionData = getSelectedRegion(route)

    const {markedPhone:markedPhoneFirst,phone:phoneFirst} = formatPhoneNumber(PHONE_NUMBER_FIRST)
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
                <a href={`mailto:${EMAIL_ADDRESS}`} className='font-14-medium orange-color'>
                    {EMAIL_ADDRESS}
                </a>
            </div>
        </address>
    );
};

export default HeaderAdress;


