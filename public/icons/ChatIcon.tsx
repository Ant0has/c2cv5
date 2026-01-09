import { IconProps } from '@/shared/types/types';
import { FC } from 'react';

const ChatIcon: FC<IconProps> = ({ fill }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2.00945V11.0206C16 12.1195 15.0938 12.9986 14 12.9986H9.5L5.59375 15.9186C5.34375 16.107 5 15.95 5 15.636V12.9986H2C0.875 12.9986 0 12.0881 0 11.0206V2.00945C0 0.879134 0.875 0 2 0H14C15.125 0 16 0.910532 16 2.00945Z" fill={fill} />
        </svg>
    )
}

export default ChatIcon;
