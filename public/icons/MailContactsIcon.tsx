import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const MailContactsIcon: FC<IconProps> = ({ fill }) => {
  return <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" rx="16" fill="#FF9C00" />
    <path d="M32.3125 18.5C33.2266 18.5 34 19.2734 34 20.1875C34 20.75 33.7188 21.2422 33.2969 21.5586L25.668 27.2891C25.2461 27.6055 24.7188 27.6055 24.2969 27.2891L16.668 21.5586C16.2461 21.2422 16 20.75 16 20.1875C16 19.2734 16.7383 18.5 17.6875 18.5H32.3125ZM23.6289 28.2031C24.4375 28.8008 25.5273 28.8008 26.3359 28.2031L34 22.4375V29.75C34 31.0156 32.9805 32 31.75 32H18.25C16.9844 32 16 31.0156 16 29.75V22.4375L23.6289 28.2031Z" fill="#FEFEFE" />
  </svg>

}

export default MailContactsIcon