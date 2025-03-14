import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const ApplicationIcon: FC<IconProps> = ({ fill }) => {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="16" fill="#121212" />
    <path d="M12 16.5C12 14.8594 13.3125 13.5 15 13.5H33C34.6406 13.5 36 14.8594 36 16.5V31.5C36 33.1875 34.6406 34.5 33 34.5H15C13.3125 34.5 12 33.1875 12 31.5V16.5ZM16.5 19.5C17.2969 19.5 18 18.8438 18 18C18 17.2031 17.2969 16.5 16.5 16.5C15.6562 16.5 15 17.2031 15 18C15 18.8438 15.6562 19.5 16.5 19.5ZM33 18C33 17.3906 32.4844 16.875 31.875 16.875H20.625C19.9688 16.875 19.5 17.3906 19.5 18C19.5 18.6562 19.9688 19.125 20.625 19.125H31.875C32.4844 19.125 33 18.6562 33 18Z" fill="#FEFEFE" />
  </svg>

}

export default ApplicationIcon