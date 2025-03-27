'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export const useNavigationLoading = () => {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStart = (href: string) => {
      try {
        const url = typeof href === 'string' ? new URL(href, window.location.origin) : null
        const currentUrl = new URL(window.location.href)

        if (url && url.origin === window.location.origin && url.pathname !== currentUrl.pathname) {
          setIsLoading(true)
        }
      } catch (error) {
        console.error('Error in navigation loading:', error)
      }
    }

    const handleComplete = () => {
      setIsLoading(false)
    }

    // Обработка кликов по ссылкам
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link?.href && !link.target && !e.ctrlKey && !e.metaKey) {
        handleStart(link.href)
      }
    }

    document.addEventListener('click', handleClick)
    window.addEventListener('beforeunload', handleComplete)
    window.addEventListener('popstate', handleComplete)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('beforeunload', handleComplete)
      window.removeEventListener('popstate', handleComplete)
    }
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  return isLoading
}

export default useNavigationLoading 