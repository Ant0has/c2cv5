'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import Link from "next/link"
import s from './SvoDestinationCard.module.scss'

interface Props {
  destination: IHubDestination
  hubSlug: string
}

// Region badge colors
const getRegionBadge = (slug: string): { label: string; color: string } => {
  const dnr = ['donetsk', 'mariupol', 'gorlovka', 'snezhnoe', 'starobeshevo'];
  const lnr = ['lugansk', 'stahanov', 'rovenki', 'starobilsk', 'antracit', 'severodonetsk', 'alchevsk', 'bryanka', 'rubezhnoe'];
  const zap = ['melitopol', 'kamenka', 'tokmak'];
  const hers = ['kahovka'];
  const kpp = ['izvarino'];

  if (dnr.includes(slug)) return { label: 'ДНР', color: '#e74c3c' };
  if (lnr.includes(slug)) return { label: 'ЛНР', color: '#3498db' };
  if (zap.includes(slug)) return { label: 'Запорожская обл.', color: '#27ae60' };
  if (hers.includes(slug)) return { label: 'Херсонская обл.', color: '#f39c12' };
  if (kpp.includes(slug)) return { label: 'КПП', color: '#8e44ad' };
  return { label: '', color: '#999' };
}

const SvoDestinationCard = ({ destination, hubSlug }: Props) => {
  const formatPrice = (price?: number) => {
    if (!price) return null
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const regionBadge = getRegionBadge(destination.slug)

  // Parse features for route count
  let routeCount = '';
  try {
    const features = JSON.parse(destination.features || '[]');
    const routeFeature = features.find((f: { title: string }) => f.title.includes('маршрут'));
    if (routeFeature) routeCount = routeFeature.title;
  } catch {
    // ignore
  }

  return (
    <Link href={`/${hubSlug}/${destination.slug}`} className={s.card}>
      <div className={s.cardHeader}>
        <div className={s.titleRow}>
          <h3 className={s.cardTitle}>{destination.name}</h3>
          {destination.isFeatured && (
            <span className={s.featuredBadge}>Популярное</span>
          )}
        </div>
        {regionBadge.label && (
          <span className={s.regionBadge} style={{ backgroundColor: regionBadge.color }}>
            {regionBadge.label}
          </span>
        )}
      </div>

      <div className={s.cardBody}>
        {destination.subtitle && (
          <p className={s.subtitle}>{destination.subtitle}</p>
        )}

        <div className={s.stats}>
          {routeCount && (
            <div className={s.statItem}>
              <span className={s.statIcon}>🗺️</span>
              <span className={s.statValue}>{routeCount}</span>
            </div>
          )}
          {destination.price && (
            <div className={s.statItem}>
              <span className={s.statIcon}>💰</span>
              <span className={s.statValue}>от {formatPrice(Number(destination.price))} ₽</span>
            </div>
          )}
        </div>
      </div>

      <div className={s.cardFooter}>
        <span className={s.orderBtn}>Смотреть маршруты →</span>
      </div>
    </Link>
  )
}

export default SvoDestinationCard
