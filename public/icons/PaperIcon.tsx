import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const PaperIcon: FC<IconProps> = ({ fill }) => {
  return <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="46" height="46" rx="16" fill="#FF9C00" />
    <path d="M14 14C14 12.3594 15.3125 11 17 11H24.5V17C24.5 17.8438 25.1562 18.5 26 18.5H32V32C32 33.6875 30.6406 35 29 35H17C15.3125 35 14 33.6875 14 32V14ZM26 17V11L32 17H26Z" fill="#FEFEFE" />
  </svg>

}

export default PaperIcon