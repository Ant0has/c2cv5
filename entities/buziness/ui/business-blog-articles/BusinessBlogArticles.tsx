import Link from 'next/link'
import { getArticlesBySegment } from '@/pages-list/blog/config/registry'
import type { BlogSegment } from '@/pages-list/blog/types'
import s from './BusinessBlogArticles.module.scss'

const FORMAT_LABELS: Record<string, string> = {
  guide: 'Гайд',
  checklist: 'Чек-лист',
  comparison: 'Сравнение',
  'case-study': 'Кейс',
  'price-review': 'Обзор цен',
}

interface Props {
  segment: BlogSegment
  title?: string
  limit?: number
}

const BusinessBlogArticles = ({ segment, title = 'Полезные статьи', limit = 4 }: Props) => {
  const articles = getArticlesBySegment(segment).slice(0, limit)

  if (articles.length === 0) return null

  return (
    <div className={s.wrapper}>
      <div className="container">
        <div className={s.header}>
          <h2 className={s.title}>{title}</h2>
          <Link href="/dlya-biznesa/blog" className={s.allLink}>
            Все статьи &rarr;
          </Link>
        </div>
        <div className={s.grid}>
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/dlya-biznesa/blog/${article.slug}`}
              className={s.card}
            >
              <span className={s.badge}>{FORMAT_LABELS[article.format]}</span>
              <h3 className={s.cardTitle}>{article.title}</h3>
              <p className={s.cardExcerpt}>{article.description}</p>
              <span className={s.readTime}>{article.readingTime} мин &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BusinessBlogArticles
