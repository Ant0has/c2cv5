'use client'
import { useState, useEffect } from 'react'
import s from './TelegramBar.module.scss'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

const STORAGE_KEY = 'tgBarClosed'
const HIDE_DAYS = 7
const SCROLL_THRESHOLD = 50
const MOBILE_BREAKPOINT = 768

function isBarClosed(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return false

  try {
    const data = JSON.parse(stored)
    const daysPassed = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24)
    if (data.closed && daysPassed < HIDE_DAYS) {
      return true
    } else {
      localStorage.removeItem(STORAGE_KEY)
      return false
    }
  } catch {
    return false
  }
}

const TelegramBar = () => {
  const [hidden, setHidden] = useState(false)
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  const isDeliveryPage = pathname.includes('dostavka-gruzov')

  const getText = () => {
    if (isDeliveryPage) {
      return (
        <>
          <span className={s.textDesktop}>
            Новая услуга: доставка грузов между городами в тот же день
          </span>
          <span className={s.textMobile}>
            Доставка грузов между городами в тот же день
          </span>
        </>
      )
    }

    return (
      <>
        <span className={s.textDesktop}>
          Подписывайся на MAX канал — гайды, маршруты, лайфхаки
        </span>
        <span className={s.textMobile}>
          MAX канал — гайды, маршруты, лайфхаки
        </span>
      </>
    )
  }

  useEffect(() => {
    if (isBarClosed()) {
      setHidden(true)
      return
    }

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT

    if (!isMobile) {
      setVisible(true)
    } else {
      const handleScroll = () => {
        if (window.scrollY >= SCROLL_THRESHOLD) {
          setVisible(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (hidden) return
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setVisible(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [hidden])

  const handleClose = () => {
    setHidden(true)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ closed: true, timestamp: Date.now() })
    )
  }

  if (hidden) return null

  return (
    <div className={clsx(s.tgBar, { [s.visible]: visible })}>
      <svg
        className={s.icon}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-1-1 3.5-3.5L10 9l1-1 4.5 4.5L11 17z" />
      </svg>

      {getText()}

      <a
        href="https://max.ru/id616606322786_biz"
        className={s.cta}
        target="_blank"
        rel="noopener noreferrer"
      >
        Подписаться
      </a>

      <button
        className={s.close}
        onClick={handleClose}
        aria-label="Закрыть"
      >
        &times;
      </button>
    </div>
  )
}

export default TelegramBar
