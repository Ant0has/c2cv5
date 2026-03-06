'use client'
import { BusinessBreadcrumbs, BusinessCooperation } from '@/entities/buziness'
import type { ArticleData } from '../../types'
import { getSegmentBySlug } from '../../config/segments'
import { getArticlesBySegment } from '../../config/registry'
import ArticleSidebar from '../article-sidebar/ArticleSidebar'
import ArticleCard from '../article-card/ArticleCard'
import s from './BlogArticlePage.module.scss'

const FORMAT_LABELS: Record<string, string> = {
  guide: 'Гайд',
  checklist: 'Чек-лист',
  comparison: 'Сравнение',
  'case-study': 'Кейс',
  'price-review': 'Обзор цен',
}

interface Props {
  data: ArticleData
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

const BlogArticlePage = ({ data }: Props) => {
  const segment = getSegmentBySlug(data.segment)!
  const related = getArticlesBySegment(data.segment)
    .filter(a => a.slug !== data.slug)
    .slice(0, 3)

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Для бизнеса', href: '/dlya-biznesa' },
    { label: 'Блог', href: '/dlya-biznesa/blog' },
    { label: data.title },
  ]

  return (
    <div className={s.page}>
      <BusinessBreadcrumbs items={breadcrumbs} />
      <div className="container">
        <div className={s.header}>
          <div className={s.badges}>
            <span className={s.segmentBadge}>{segment.title}</span>
            <span className={s.formatBadge}>{FORMAT_LABELS[data.format]}</span>
            <span className={s.readTime}>{data.readingTime} мин чтения</span>
          </div>
          <h1 className={s.title}>{data.title}</h1>
        </div>

        <div className={s.layout}>
          <article className={s.article}>
            <div
              className={s.content}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </article>
          <ArticleSidebar toc={data.toc} segment={segment} />
        </div>

        {related.length > 0 && (
          <div className={s.related}>
            <h2 className={s.relatedTitle}>Похожие статьи</h2>
            <div className={s.relatedGrid}>
              {related.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
      <BusinessCooperation {...cooperationData} />
    </div>
  )
}

export default BlogArticlePage
