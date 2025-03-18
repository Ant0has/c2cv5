'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export function useNavigationLoading() {
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const startLoading = useCallback(() => {
        setIsLoading(true)
        document.body.style.cursor = 'wait'
        document.body.style.pointerEvents = 'none'
        // Блокируем прокрутку
        document.body.style.overflow = 'hidden'
        document.body.style.touchAction = 'none' // Для мобильных устройств
    }, [])

    const stopLoading = useCallback(() => {
        setIsLoading(false)
        document.body.style.cursor = ''
        document.body.style.pointerEvents = ''
        // Разблокируем прокрутку
        document.body.style.overflow = ''
        document.body.style.touchAction = ''
    }, [])

    // Отслеживаем клики по ссылкам
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const link = target.closest('a')
            if (link?.href && !link.target && !e.ctrlKey && !e.metaKey) {
                const url = new URL(link.href)
                const currentUrl = new URL(window.location.href)
                
                if (url.origin === window.location.origin && 
                    (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
                    startLoading()
                }
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [pathname, startLoading])

    // Перехватываем программную навигацию
    useEffect(() => {
        const originalPush = router.push
        router.push = (...args: Parameters<typeof router.push>) => {
            const [href] = args
            const url = typeof href === 'string' ? new URL(href, window.location.origin) : null
            const currentUrl = new URL(window.location.href)

            if (url && (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
                startLoading()
            }
            return originalPush.apply(router, args)
        }

        return () => {
            router.push = originalPush
        }
    }, [router, startLoading])

    // Останавливаем загрузку при завершении навигации
    useEffect(() => {
        const timer = setTimeout(stopLoading, 100)
        return () => clearTimeout(timer)
    }, [pathname, searchParams, stopLoading])

    return isLoading
} 