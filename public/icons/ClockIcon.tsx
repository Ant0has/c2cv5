import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const ClockIcon: FC<IconProps> = ({ fill = '#FEFEFE' , className }) => {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 24C5.34375 24 0 18.6562 0 12C0 5.39062 5.34375 0 12 0C18.6094 0 24 5.39062 24 12C24 18.6562 18.6094 24 12 24ZM10.875 12C10.875 12.375 11.0625 12.75 11.3438 12.9375L15.8438 15.9375C16.3594 16.3125 17.0625 16.1719 17.3906 15.6562C17.7656 15.1406 17.625 14.4375 17.1094 14.0625L13.125 11.4375V5.625C13.125 5.01562 12.6094 4.5 11.9531 4.5C11.3438 4.5 10.8281 5.01562 10.8281 5.625L10.875 12Z" fill={fill || '#FEFEFE'} />
  </svg>
}

export default ClockIcon;