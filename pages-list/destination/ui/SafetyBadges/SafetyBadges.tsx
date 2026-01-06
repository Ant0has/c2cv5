'use client'

import s from './SafetyBadges.module.scss'

interface Props {
  isSki?: boolean
}

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="currentColor"/>
  </svg>
)

const MountainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6L9.78 11.63L11.03 13.3L14 9.33L19 16H13.4L11.97 13.93L9 17.9L6 13.9L2 20H22L14 6ZM5 16L9 11L11.03 13.73L9.78 15.37L9 14.9L7 17H5.6L5 16Z" fill="currentColor"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
  </svg>
)

const SafetyBadges = ({ isSki = true }: Props) => {
  return (
    <div className={s.badges}>
      <div className={s.badge}>
        <span className={s.icon}><ShieldIcon /></span>
        <span className={s.text}>Поездка застрахована</span>
      </div>
      {isSki && (
        <div className={s.badge}>
          <span className={s.icon}><MountainIcon /></span>
          <span className={s.text}>Водители прошли курс горного вождения</span>
        </div>
      )}
      <div className={s.badge}>
        <span className={s.icon}><CheckIcon /></span>
        <span className={s.text}>Фиксированная цена</span>
      </div>
    </div>
  )
}

export default SafetyBadges
