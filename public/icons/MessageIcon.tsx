import { IconProps } from '@/shared/types/types'
import { FC } from 'react'


const MessageIcon: FC<IconProps> = ({ fill }) => {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="16" fill="#121212" />
    <path d="M35.9531 15V28.4531C35.9531 30.0938 34.5938 31.4062 32.9531 31.4062H26.2031L20.3438 35.7656C19.9688 36.0469 19.4531 35.8125 19.4531 35.3438V31.4062H14.9531C13.2656 31.4062 11.9531 30.0469 11.9531 28.4531V15C11.9531 13.3125 13.2656 12 14.9531 12H32.9531C34.6406 12 35.9531 13.3594 35.9531 15Z" fill="#FEFEFE" />
  </svg>


}

export default MessageIcon