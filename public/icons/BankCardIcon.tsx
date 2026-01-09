import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const BankCardIcon: FC<IconProps> = ({ fill }) => {
    return (
        <svg width="27" height="21" viewBox="0 0 27 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0C25.6406 0 27 1.35938 27 3V4.5H0V3C0 1.35938 1.3125 0 3 0H24ZM27 18C27 19.6875 25.6406 21 24 21H3C1.3125 21 0 19.6875 0 18V9H27V18ZM5.25 15C4.82812 15 4.5 15.375 4.5 15.75C4.5 16.1719 4.82812 16.5 5.25 16.5H8.25C8.625 16.5 9 16.1719 9 15.75C9 15.375 8.625 15 8.25 15H5.25ZM11.25 16.5H17.25C17.625 16.5 18 16.1719 18 15.75C18 15.375 17.625 15 17.25 15H11.25C10.8281 15 10.5 15.375 10.5 15.75C10.5 16.1719 10.8281 16.5 11.25 16.5Z" fill={fill || '#FF9C00'} />
        </svg>
    )
}

export default BankCardIcon;
