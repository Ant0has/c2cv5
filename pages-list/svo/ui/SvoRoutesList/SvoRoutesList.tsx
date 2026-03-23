'use client'

import Link from "next/link"
import s from './SvoRoutesList.module.scss'
import clsx from "clsx"
import { useIsMobile } from "@/shared/hooks/useResize"

interface Props {
  hubSlug: string
}

// Cities without dedicated destination pages — linked directly to route pages
// Only routes that exist in whitelist (return 200, not 410)
// Removed 2026-03-23: 10 cities returning 410 (not in whitelist)
const additionalCities = [
  { name: 'Кременная', region: 'ЛНР', routes: 'svo-taxi-kremennaya' },
]

const SvoRoutesList = ({ hubSlug }: Props) => {
  const isMobile = useIsMobile()

  return (
    <section className={clsx(s.routesList, 'container', { 'padding-y-40': !isMobile })} id="more-routes">
      <h2 className={clsx('title', 'margin-b-24')}>Другие направления</h2>
      <p className={s.description}>
        Помимо основных городов, мы также выполняем трансферы в следующие населённые пункты новых территорий:
      </p>
      <div className={s.citiesGrid}>
        {additionalCities.map((city) => (
          <Link
            key={city.name}
            href={`/${city.routes}-moskva.html`}
            className={s.cityLink}
          >
            <span className={s.cityName}>{city.name}</span>
            <span className={s.cityRegion}>{city.region}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SvoRoutesList
