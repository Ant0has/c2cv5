import Link from 'next/link'
import { getCasesBySegment } from '@/pages-list/cases/config/registry'
import type { BlogSegment } from '@/pages-list/blog/types'
import s from './BusinessCaseStudies.module.scss'

interface Props {
  segment: BlogSegment
  title?: string
}

const BusinessCaseStudies = ({ segment, title = 'Кейсы наших клиентов' }: Props) => {
  const cases = getCasesBySegment(segment)

  if (cases.length === 0) return null

  return (
    <div className={s.wrapper}>
      <div className="container">
        <div className={s.header}>
          <h2 className={s.title}>{title}</h2>
          <Link href="/dlya-biznesa/cases" className={s.allLink}>
            Все кейсы &rarr;
          </Link>
        </div>
        <div className={s.grid}>
          {cases.map(c => (
            <Link
              key={c.slug}
              href={`/dlya-biznesa/cases/${c.slug}`}
              className={s.card}
            >
              <span className={s.badge}>{c.client}</span>
              <h3 className={s.cardTitle}>{c.title}</h3>
              <div className={s.metrics}>
                {c.metrics.map((m, i) => (
                  <div key={i} className={s.metric}>
                    <span className={s.metricValue}>{m.value}</span>
                    <span className={s.metricLabel}>{m.label}</span>
                  </div>
                ))}
              </div>
              <span className={s.readTime}>{c.readingTime} мин &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BusinessCaseStudies
