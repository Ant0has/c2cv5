'use client'
import { BLOG_SEGMENTS } from '../../config/segments'
import type { BlogSegment } from '../../types'
import s from './SegmentFilter.module.scss'
import clsx from 'clsx'

interface Props {
  active: BlogSegment | null
  onChange: (segment: BlogSegment | null) => void
}

const SegmentFilter = ({ active, onChange }: Props) => {
  return (
    <div className={s.wrapper}>
      <button
        className={clsx(s.tab, { [s.active]: active === null })}
        onClick={() => onChange(null)}
      >
        Все
      </button>
      {BLOG_SEGMENTS.map(seg => (
        <button
          key={seg.slug}
          className={clsx(s.tab, { [s.active]: active === seg.slug })}
          onClick={() => onChange(seg.slug)}
        >
          {seg.shortTitle}
        </button>
      ))}
    </div>
  )
}

export default SegmentFilter
