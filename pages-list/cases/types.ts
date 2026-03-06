export type { BlogSegment, TocItem, SegmentConfig } from '../blog/types'

export interface CaseMetric {
  value: string
  label: string
}

export interface CaseStudyEntry {
  slug: string
  segment: import('../blog/types').BlogSegment
  title: string
  client: string
  description: string
  keywords: string
  readingTime: number
  metrics: CaseMetric[]
}

export interface CaseStudyData extends CaseStudyEntry {
  toc: import('../blog/types').TocItem[]
  content: string
}
