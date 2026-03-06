'use client'
import Link from 'next/link'
import type { TocItem, SegmentConfig } from '../../types'
import s from './CaseSidebar.module.scss'

interface Props {
  toc: TocItem[]
  segment: SegmentConfig
}

const CaseSidebar = ({ toc, segment }: Props) => {
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
        <p className={s.ctaTitle}>Нужна похожая услуга?</p>
        <p className={s.ctaText}>{segment.title} — подробности, цены и условия сотрудничества</p>
        <Link href={segment.pillarHref} className={s.ctaButton}>
          Узнать подробности
        </Link>
      </div>
    </aside>
  )
}

export default CaseSidebar
