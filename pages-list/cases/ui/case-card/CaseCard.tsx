import Link from 'next/link'
import type { CaseStudyEntry } from '../../types'
import s from './CaseCard.module.scss'

const SEGMENT_LABELS: Record<string, string> = {
  'korporativnoe-taksi': 'Корп. такси',
  'transfer-meropriyatiy': 'Мероприятия',
  'vakhtovye-perevozki': 'Вахта',
  'medicinskij-transfer': 'Мед. трансфер',
  'dostavka-gruzov': 'Грузы',
}

interface Props {
  caseStudy: CaseStudyEntry
}

const CaseCard = ({ caseStudy }: Props) => {
  return (
    <Link href={`/dlya-biznesa/cases/${caseStudy.slug}`} className={s.card}>
      <div className={s.top}>
        <span className={s.segmentBadge}>{SEGMENT_LABELS[caseStudy.segment]}</span>
        <span className={s.client}>{caseStudy.client}</span>
      </div>
      <h3 className={s.title}>{caseStudy.title}</h3>
      <div className={s.metrics}>
        {caseStudy.metrics.map((m, i) => (
          <div key={i} className={s.metric}>
            <span className={s.metricValue}>{m.value}</span>
            <span className={s.metricLabel}>{m.label}</span>
          </div>
        ))}
      </div>
      <div className={s.footer}>
        <span className={s.readTime}>{caseStudy.readingTime} мин чтения</span>
        <span className={s.arrow}>&rarr;</span>
      </div>
    </Link>
  )
}

export default CaseCard
