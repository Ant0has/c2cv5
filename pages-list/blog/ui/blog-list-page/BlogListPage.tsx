'use client'
import { useState, useMemo } from 'react'
import { BusinessCooperation } from '@/entities/buziness'
import { ARTICLES } from '../../config/registry'
import type { BlogSegment } from '../../types'
import SegmentFilter from '../segment-filter/SegmentFilter'
import ArticleCard from '../article-card/ArticleCard'
import s from './BlogListPage.module.scss'

const cooperationData = {
  title: [
    { text: 'Готовы ', isPrimary: false },
    { text: 'к сотрудничеству?', isPrimary: true },
  ],
  description: 'Оставьте заявку — менеджер подготовит коммерческое предложение за 1 рабочий день',
  image: '/images/dlya-biznesa/businessman-lg.png',
  buttonText: 'Получить предложение',
}

const BlogListPage = () => {
  const [activeSegment, setActiveSegment] = useState<BlogSegment | null>(null)

  const filtered = useMemo(() => {
    if (!activeSegment) return ARTICLES
    return ARTICLES.filter(a => a.segment === activeSegment)
  }, [activeSegment])

  return (
    <div className={s.page}>
      <div className="container">
        <h1 className={s.title}>Блог для бизнеса</h1>
        <p className={s.subtitle}>
          Полезные материалы о корпоративных перевозках: руководства, чек-листы, кейсы и обзоры цен
        </p>
        <SegmentFilter active={activeSegment} onChange={setActiveSegment} />
        <div className={s.grid}>
          {filtered.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
      <BusinessCooperation {...cooperationData} />
    </div>
  )
}

export default BlogListPage
