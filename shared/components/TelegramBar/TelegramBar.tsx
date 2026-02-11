'use client'
import { useState, useEffect } from 'react'
import s from './TelegramBar.module.scss'
import clsx from 'clsx'

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
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>

      <span className={s.textDesktop}>
        Новости сервиса и условия для бизнеса — в Telegram
      </span>
      <span className={s.textMobile}>
        Акции и выгодные поездки — в Telegram
      </span>

      <a
        href="https://t.me/city2cityru"
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
