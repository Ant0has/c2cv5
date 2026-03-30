'use client'

import { useEffect } from 'react'
import { saveUTMFromUrl } from '@/shared/services/utm.service'

export default function UTMTracker() {
  useEffect(() => {
    saveUTMFromUrl()
  }, [])

  return null
}
