import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const PhoneContactsIcon: FC<IconProps> = ({ fill }) => {
  return <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" rx="16" fill="#FF9C00" />
    <path d="M33.9648 29.8555L33.1211 33.4062C33.0156 33.9336 32.5938 34.2852 32.0664 34.2852C23.207 34.25 16 27.043 16 18.1836C16 17.6562 16.3164 17.2344 16.8438 17.1289L20.3945 16.2852C20.8867 16.1797 21.4141 16.4609 21.625 16.918L23.2773 20.75C23.4531 21.207 23.3477 21.7344 22.9609 22.0156L21.0625 23.5625C22.2578 25.9883 24.2266 27.957 26.6875 29.1523L28.2344 27.2539C28.5156 26.9023 29.043 26.7617 29.5 26.9375L33.332 28.5898C33.7891 28.8359 34.0703 29.3633 33.9648 29.8555Z" fill="#FEFEFE" />
  </svg>

}

export default PhoneContactsIcon