'use client'

import { useIsMobile } from '@/shared/hooks/useResize'
import s from './SeoText.module.scss'
import clsx from 'clsx'

interface Props {
  content: string
  className?: string
}

const SeoText = ({ content, className }: Props) => {
  const isMobile = useIsMobile()
  if (!content) return null

  return (
    <section className={clsx('bg-gray', {'padding-y-40':!isMobile}, className)}>
      <div className="container">
        <div
          className={s.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  )
}

export default SeoText
