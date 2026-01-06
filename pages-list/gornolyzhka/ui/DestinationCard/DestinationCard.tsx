'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import Link from "next/link"
import Image from "next/image"
import s from './DestinationCard.module.scss'
import { BASE_URL } from "@/shared/constants"

interface Props {
  destination: IHubDestination
  hubSlug: string
}

// Icons based on destination
const getDestinationIcon = (destination: IHubDestination): string => {
  const toCity = destination.toCity?.toLowerCase() || ''

  // Snowboard resorts
  if (toCity.includes('красная поляна') || toCity.includes('роза хутор') ||
      toCity.includes('газпром') || toCity.includes('горки город')) {
    return '/icons/snowboard_ico.png'
  }
  // Mountain resorts
  if (toCity.includes('архыз') || toCity.includes('домбай') ||
      toCity.includes('приэльбрусье') || toCity.includes('эльбрус') ||
      toCity.includes('чегет') || toCity.includes('лаго-наки')) {
    return '/icons/mount_ico.png'
  }
  // Ski resorts by default
  return '/icons/sky1_ico.png'
}

const DestinationCard = ({ destination, hubSlug }: Props) => {
  const formatPrice = (price?: number) => {
    if (!price) return null
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const iconSrc = getDestinationIcon(destination)

  return (
    <Link href={`/${hubSlug}/${destination.slug}`} className={s.card}>
      <Image
        src={`${BASE_URL}/static-images/${destination.heroImage}`}
        alt={destination.name}
        className={s.cardImage}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
        width={300}
        height={400}
      />
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>{destination.name}</h3>
        {destination.isFeatured && (
          <span className={s.featuredBadge}>Популярное</span>
        )}
      </div>

      <div className={s.cardBody}>
        {destination.fromCity && destination.toCity && (
          <div className={s.route}>
            <span className={s.routeFrom}>{destination.fromCity}</span>
            <span className={s.routeArrow}>→</span>
            <span className={s.routeTo}>{destination.toCity}</span>
          </div>
        )}

        <div className={s.details}>
          {destination.distance && (
            <div className={s.detailItem}>
              <span className={s.detailLabel}>Расстояние</span>
              <span className={s.detailValue}>{destination.distance} км</span>
            </div>
          )}
          {destination.duration && (
            <div className={s.detailItem}>
              <span className={s.detailLabel}>В пути</span>
              <span className={s.detailValue}>{destination.duration}</span>
            </div>
          )}
        </div>
      </div>

      <div className={s.cardFooter}>
        {destination.price && (
          <div className={s.price}>
            <span className={s.priceLabel}>от</span>
            <span className={s.priceValue}>{formatPrice(Number(destination.price))} ₽</span>
            <span className={s.seasonBadge}>2025/26</span>
          </div>
        )}
        <div className={s.orderSection}>
          <div className={s.cardIcon}>
            <Image
              src={iconSrc}
              alt=""
              width={36}
              height={36}
              className={s.icon}
            />
          </div>
          <span className={s.orderBtn}>Заказать →</span>
        </div>
      </div>
    </Link>
  )
}

export default DestinationCard
