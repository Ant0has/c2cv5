'use client'
import Link from 'next/link'
import type { TocItem, SegmentConfig } from '../../types'
import s from './ArticleSidebar.module.scss'

interface Props {
  toc: TocItem[]
  segment: SegmentConfig
}

const ArticleSidebar = ({ toc, segment }: Props) => {
  return (
    <aside className={s.sidebar}>
      {toc.length > 0 && (
        <div className={s.tocBlock}>
          <h4 className={s.tocTitle}>Содержание</h4>
          <nav>
            <ul className={s.tocList}>
              {toc.map(item => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={s.tocLink}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      <div className={s.ctaBlock}>
        <p className={s.ctaTitle}>Узнайте больше</p>
        <p className={s.ctaText}>{segment.title} — все услуги и цены на одной странице</p>
        <Link href={segment.pillarHref} className={s.ctaButton}>
          Перейти к услуге
        </Link>
      </div>
    </aside>
  )
}

export default ArticleSidebar
