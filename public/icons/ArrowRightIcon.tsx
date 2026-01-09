import { FC } from 'react';
import { IconProps } from '@/shared/types/types';

const ArrowRightIcon: FC<IconProps> = ({ fill = '#FEFEFE'  , className }) => {
    return (
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M8.25 0.207045L13.75 5.4535C13.9062 5.60964 14 5.79701 14 6.01561C14 6.20299 13.9062 6.39036 13.75 6.5465L8.25 11.793C7.96875 12.074 7.46875 12.074 7.1875 11.7617C6.90625 11.4807 6.90625 10.981 7.21875 10.6999L11.375 6.76511H0.75C0.3125 6.76511 0 6.42159 0 6.01561C0 5.57841 0.3125 5.26612 0.75 5.26612H11.375L7.21875 1.30006C6.90625 1.019 6.90625 0.519334 7.1875 0.238274C7.46875 -0.0740144 7.9375 -0.0740144 8.25 0.207045Z" fill={fill || '#FEFEFE'} />
        </svg>
    );
};

export default ArrowRightIcon;
