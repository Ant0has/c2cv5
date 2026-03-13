'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import s from './TripCounter.module.scss'
import { useEffect, useState } from "react"

interface Props {
  destination: IHubDestination
}

const TripCounter = ({ destination }: Props) => {
  const [count, setCount] = useState(0)
  const totalCount = destination.tripCountBase || 0

  useEffect(() => {
    if (totalCount <= 0) return
    const duration = 1200
    const steps = 30
    const increment = totalCount / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= totalCount) {
        setCount(totalCount)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [totalCount])

  if (totalCount <= 0) return null

  return (
    <div className={s.counter}>
      <div className={s.icon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13S8 13.67 8 14.5S7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13S19 13.67 19 14.5S18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="currentColor"/>
        </svg>
      </div>
      <div className={s.info}>
        <span className={s.number}>{count.toLocaleString('ru-RU')}</span>
        <span className={s.label}>поездок выполнено за всё время</span>
      </div>
    </div>
  )
}

export default TripCounter
