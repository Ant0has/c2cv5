import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const WalletIcon: FC<IconProps> = ({ fill }) => {
  return <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="46" height="46" rx="16" fill="#FF9C00" />
    <path d="M32 12.5C32.7969 12.5 33.5 13.2031 33.5 14C33.5 14.8438 32.7969 15.5 32 15.5H14.75C14.3281 15.5 14 15.875 14 16.25C14 16.6719 14.3281 17 14.75 17H32C33.6406 17 35 18.3594 35 20V30.5C35 32.1875 33.6406 33.5 32 33.5H14C12.3125 33.5 11 32.1875 11 30.5V15.5C11 13.8594 12.3125 12.5 14 12.5H32ZM30.5 26.75C31.2969 26.75 32 26.0938 32 25.25C32 24.4531 31.2969 23.75 30.5 23.75C29.6562 23.75 29 24.4531 29 25.25C29 26.0938 29.6562 26.75 30.5 26.75Z" fill="#FEFEFE" />
  </svg>

}

export default WalletIcon