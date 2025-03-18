'use client'

import { useNavigationLoading } from '@/shared/hooks/useNavigationLoading'
import Loader from '../ui/Loader/Loader'

export default function NavigationLoader() {
    const isLoading = useNavigationLoading()

    if (!isLoading) return null

    return <Loader />
} 