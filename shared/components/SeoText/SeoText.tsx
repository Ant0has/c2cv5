'use client'

import s from './SeoText.module.scss'
import clsx from 'clsx'

interface Props {
  content: string
  className?: string
}

const SeoText = ({ content, className }: Props) => {
  if (!content) return null

  return (
    <section className={clsx(s.seoText, className)}>
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
