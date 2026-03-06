import Link from 'next/link'
import type { ArticleEntry } from '../../types'
import s from './ArticleCard.module.scss'

const FORMAT_LABELS: Record<string, string> = {
  guide: 'Гайд',
  checklist: 'Чек-лист',
  comparison: 'Сравнение',
  'case-study': 'Кейс',
  'price-review': 'Обзор цен',
}

const SEGMENT_LABELS: Record<string, string> = {
  'korporativnoe-taksi': 'Корп. такси',
  'transfer-meropriyatiy': 'Мероприятия',
  'vakhtovye-perevozki': 'Вахта',
  'medicinskij-transfer': 'Мед. трансфер',
  'dostavka-gruzov': 'Грузы',
}

interface Props {
  article: ArticleEntry
}

const ArticleCard = ({ article }: Props) => {
  return (
    <Link href={`/dlya-biznesa/blog/${article.slug}`} className={s.card}>
      <div className={s.badges}>
        <span className={s.segmentBadge}>{SEGMENT_LABELS[article.segment]}</span>
        <span className={s.formatBadge}>{FORMAT_LABELS[article.format]}</span>
      </div>
      <h3 className={s.title}>{article.title}</h3>
      <p className={s.excerpt}>{article.description}</p>
      <div className={s.footer}>
        <span className={s.readTime}>{article.readingTime} мин чтения</span>
        <span className={s.arrow}>&rarr;</span>
      </div>
    </Link>
  )
}

export default ArticleCard
