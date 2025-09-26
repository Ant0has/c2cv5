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

    return (
        <address className={s.phone}>
            {regionData?.address && <p>{regionData.address}</p>}

            <div className={s.block}>
                {regionData?.phoneNumber && (
                    <a href={`tel:+${regionData.phoneNumber}`} className='font-18-semibold'>
                        {formatPhoneNumber(regionData.phoneNumber)}
                    </a>
                )}

                <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-18-semibold'>
                    {formatPhoneNumber(PHONE_NUMBER_FIRST)}
                </a>
                <a href={`mailto:${EMAIL_ADDRESS}`} className='font-14-medium orange-color'>
                    {EMAIL_ADDRESS}
                </a>
            </div>
        </address>
    );
};

export default HeaderAdress;


