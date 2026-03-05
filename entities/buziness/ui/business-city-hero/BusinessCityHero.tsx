'use client'
import { useIsMobile } from '@/shared/hooks/useResize'
import clsx from 'clsx'
import BusinessHeroContent from '../business-hero/business-hero-content/BusinessHeroContent'
import BusinessHeroForm from '../business-hero/business-hero-form/BusinessHeroForm'
import s from './BusinessCityHero.module.scss'

interface Props {
  badge: string
  title: { text: string; isPrimary: boolean }[]
  description: string
  bullets: string[]
  stats: { id: number; label: string; value: string }[]
}

const BusinessCityHero = ({ badge, title, description, bullets, stats }: Props) => {
  const isMobile = useIsMobile()

  return (
    <div className={clsx('relative', { 'padding-b-64': !isMobile }, { 'padding-b-40': isMobile })}>
      <div className={clsx('container', 'relative z-3')}>
        <div className={s.badge}>{badge}</div>
        <div className={clsx(s.content, 'max-width-696')}>
          <BusinessHeroContent
            title={title}
            description={description}
            bullets={bullets}
            staticsList={stats}
          />
          <BusinessHeroForm />
        </div>
      </div>
    </div>
  )
}

export default BusinessCityHero
