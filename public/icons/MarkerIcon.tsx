import { FC } from 'react'
import { IconProps } from '@/shared/types/types';

const MarkerIcon: FC<IconProps> = ({ fill }) => {
  return (
    <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M21.5001 37.9629L22.7921 36.507C24.2582 34.8293 25.5776 33.2329 26.7502 31.7176L27.7187 30.4399C31.7634 24.9919 33.7858 20.6693 33.7858 17.4723C33.7858 10.6497 28.2859 5.11905 21.5001 5.11905C14.7143 5.11905 9.21436 10.6497 9.21436 17.4723C9.21436 20.6693 11.2367 24.9926 15.2815 30.442L16.25 31.7197C17.924 33.8641 19.6752 35.9452 21.5001 37.9629Z"
        fill="#F5F5F5"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21.4999 22.5238C24.3271 22.5238 26.619 20.2319 26.619 17.4048C26.619 14.5776 24.3271 12.2857 21.4999 12.2857C18.6727 12.2857 16.3809 14.5776 16.3809 17.4048C16.3809 20.2319 18.6727 22.5238 21.4999 22.5238Z"
        fill="#F5F5F5"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  )
}

export default MarkerIcon