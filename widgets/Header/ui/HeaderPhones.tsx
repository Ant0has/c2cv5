'use client'
import PhoneIcon from '@/public/icons/PhoneIcon';
import Link from 'next/link';
import s from '../Header.module.scss';
import { requisitsData } from '@/shared/data/requisits.data';
import { clsx } from 'clsx';
import { FC } from 'react';

interface IProps {
    isDark?: boolean;
}

const HeaderPhones: FC<IProps> = ({ isDark }) => {
    return (
        <div className={s.phones}>
            <Link target='_blank' href={`tel:+${requisitsData.PHONE}`} className={clsx('font-18-semibold',{ ['text-white']: isDark },{ ['text-black']: !isDark })}>
                <PhoneIcon />
            </Link>
        </div>
    );
}

export default HeaderPhones;
