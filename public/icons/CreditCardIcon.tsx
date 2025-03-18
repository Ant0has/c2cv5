import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const CreditCardIcon: FC<IconProps> = ({ fill }) => {
  return <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="46" height="46" rx="16" fill="#FF9C00" />
    <path d="M34 12.5C35.6406 12.5 37 13.8594 37 15.5V17H10V15.5C10 13.8594 11.3125 12.5 13 12.5H34ZM37 30.5C37 32.1875 35.6406 33.5 34 33.5H13C11.3125 33.5 10 32.1875 10 30.5V21.5H37V30.5ZM15.25 27.5C14.8281 27.5 14.5 27.875 14.5 28.25C14.5 28.6719 14.8281 29 15.25 29H18.25C18.625 29 19 28.6719 19 28.25C19 27.875 18.625 27.5 18.25 27.5H15.25ZM21.25 29H27.25C27.625 29 28 28.6719 28 28.25C28 27.875 27.625 27.5 27.25 27.5H21.25C20.8281 27.5 20.5 27.875 20.5 28.25C20.5 28.6719 20.8281 29 21.25 29Z" fill="#FEFEFE" />
  </svg>

}

export default CreditCardIcon