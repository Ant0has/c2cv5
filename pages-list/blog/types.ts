export type ArticleFormat = 'guide' | 'checklist' | 'comparison' | 'case-study' | 'price-review'

export type BlogSegment =
  | 'korporativnoe-taksi'
  | 'transfer-meropriyatiy'
  | 'vakhtovye-perevozki'
  | 'medicinskij-transfer'
  | 'dostavka-gruzov'

export interface TocItem {
  id: string
  title: string
}

export interface ArticleEntry {
  slug: string
  segment: BlogSegment
  format: ArticleFormat
  title: string
  description: string
  keywords: string
  readingTime: number // минуты
}

export interface ArticleData {
  slug: string
  segment: BlogSegment
  format: ArticleFormat
  title: string
  description: string
  keywords: string
  readingTime: number
  toc: TocItem[]
  content: string // HTML
}

export interface SegmentConfig {
  slug: BlogSegment
  title: string
  shortTitle: string
  pillarHref: string
}
