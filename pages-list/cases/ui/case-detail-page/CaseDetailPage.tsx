'use client'
import { BusinessBreadcrumbs, BusinessCooperation } from '@/entities/buziness'
import type { CaseStudyData } from '../../types'
import { getSegmentBySlug } from '../../config/segments'
import { getCasesBySegment } from '../../config/registry'
import CaseSidebar from '../case-sidebar/CaseSidebar'
import CaseMetrics from '../case-metrics/CaseMetrics'
import CaseCard from '../case-card/CaseCard'
import s from './CaseDetailPage.module.scss'

interface Props {
  data: CaseStudyData
}

const cooperationData = {
  title: [
    { text: 'Готовы ', isPrimary: false },
    { text: 'к сотрудничеству?', isPrimary: true },
  ],
  description: 'Оставьте заявку — менеджер подготовит коммерческое предложение за 1 рабочий день',
  image: '/images/dlya-biznesa/businessman-lg.png',
  buttonText: 'Получить предложение',
}

const CaseDetailPage = ({ data }: Props) => {
  const segment = getSegmentBySlug(data.segment)!
  const related = getCasesBySegment(data.segment).filter(c => c.slug !== data.slug)

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Для бизнеса', href: '/dlya-biznesa' },
    { label: 'Кейсы', href: '/dlya-biznesa/cases' },
    { label: data.title },
  ]

  return (
    <div className={s.page}>
      <BusinessBreadcrumbs items={breadcrumbs} />
      <div className="container">
        <div className={s.header}>
          <div className={s.badges}>
            <span className={s.segmentBadge}>{segment.title}</span>
            <span className={s.clientBadge}>{data.client}</span>
            <span className={s.readTime}>{data.readingTime} мин чтения</span>
          </div>
          <h1 className={s.title}>{data.title}</h1>
        </div>

        <CaseMetrics metrics={data.metrics} />

        <div className={s.layout}>
          <article className={s.article}>
            <div
              className={s.content}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </article>
          <CaseSidebar toc={data.toc} segment={segment} />
        </div>

        {related.length > 0 && (
          <div className={s.related}>
            <h2 className={s.relatedTitle}>Похожие кейсы</h2>
            <div className={s.relatedGrid}>
              {related.map(c => (
                <CaseCard key={c.slug} caseStudy={c} />
              ))}
            </div>
          </div>
        )}
      </div>
      <BusinessCooperation {...cooperationData} />
    </div>
  )
}

export default CaseDetailPage
