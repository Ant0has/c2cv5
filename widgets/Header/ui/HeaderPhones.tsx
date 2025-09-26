'use client'
import PhoneIcon from '@/public/icons/PhoneIcon';
import { EMAIL_ADDRESS, PHONE_NUMBER_FIRST } from '@/shared/constants';
import { formatPhoneNumber } from '@/shared/services/formate-phone-number';
import { Popover } from 'antd';
import s from '../Header.module.scss';
import { useContext } from 'react';
import { RouteContext } from '@/app/providers';
import { getSelectedRegion } from '@/shared/services/get-selected-region';

const HeaderPhones = () => {
    const { route } = useContext(RouteContext)
    const regionData = getSelectedRegion(route)

    return (
        <Popover
            content={
                <div className={s.content}>
                    {regionData?.phoneNumber && (
                        <a href={`tel:+${regionData.phoneNumber}`} className='font-18-semibold black-color'>
                            {formatPhoneNumber(regionData.phoneNumber)}
                        </a>
                    )}
                    <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-18-semibold black-color'>
                        {formatPhoneNumber(PHONE_NUMBER_FIRST)}
                    </a>
                    <a href={`mailto:${EMAIL_ADDRESS}`} className='font-14-medium orange-color'>
                        {EMAIL_ADDRESS}
                    </a>
                </div>
            }
            trigger="click"
            placement="bottomLeft"
            className={s.icon}
        >
            <div>
                <PhoneIcon />
            </div>
        </Popover>
    );
}

export default HeaderPhones;
