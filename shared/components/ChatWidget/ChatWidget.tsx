'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { requisitsData } from '@/shared/data/requisits.data'

// На /admin/* виджет чата не нужен (служебные страницы)
const HIDE_ON_PATH_PREFIXES = ['/admin/']

const ChatWidget = () => {
  const pathname = usePathname()
  const hidden = HIDE_ON_PATH_PREFIXES.some(p => pathname?.startsWith(p))
  if (hidden) return null

  return (
    <Script
      id="chat-widget"
      strategy="lazyOnload"
      src="https://chat.city2city.ru/widget.js"
      data-source="city2city.ru"
      data-brand={requisitsData.BRAND_NAME}
      data-color="var(--primary)"
      data-bg-color="#000"
      data-tooltip="Не работает WhatsApp/Telegram? Пиши СЮДА!"
    />
  )
}

export default ChatWidget
