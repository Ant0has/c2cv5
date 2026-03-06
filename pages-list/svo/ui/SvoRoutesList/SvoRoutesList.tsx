'use client'

import Link from "next/link"
import s from './SvoRoutesList.module.scss'
import clsx from "clsx"
import { useIsMobile } from "@/shared/hooks/useResize"

interface Props {
  hubSlug: string
}

// Cities without dedicated destination pages — linked directly to route pages
// Removed: Каховка (has own destination page /svo/kahovka)
// Removed: Аэропорт Луганск, Аэропорт Донецк, Авило-Успенка (404 broken links)
const additionalCities = [
  { name: 'Лутугино', region: 'ЛНР', routes: 'svo-taxi-lutugino' },
  { name: 'Красный Луч', region: 'ЛНР', routes: 'svo-taxi-krasnyy-luch' },
  { name: 'Кременная', region: 'ЛНР', routes: 'svo-taxi-kremennaya' },
  { name: 'Сватово', region: 'ЛНР', routes: 'svo-taxi-svatovo' },
  { name: 'Энергодар', region: 'Запорожская обл.', routes: 'svo-taxi-energodar' },
  { name: 'Днепрорудное', region: 'Запорожская обл.', routes: 'svo-taxi-dneprorudnoe' },
  { name: 'Большой Суходол', region: 'Запорожская обл.', routes: 'svo-taxi-bolshoy-suhodol' },
  { name: 'Новопетровка', region: 'Запорожская обл.', routes: 'svo-taxi-novopetrovka' },
  { name: 'Новая Маячка', region: 'Херсонская обл.', routes: 'svo-taxi-novaya-mayachka' },
  { name: 'КПП Успенка', region: 'КПП', routes: 'svo-taxi-kpp-uspenka' },
  { name: 'Юрьевка', region: 'КПП', routes: 'svo-taxi-yurevka' },
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
