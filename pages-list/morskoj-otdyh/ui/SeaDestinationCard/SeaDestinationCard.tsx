'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import Link from "next/link"
import Image from "next/image"
import s from './SeaDestinationCard.module.scss'
import { BASE_URL } from "@/shared/constants"

interface Props {
  destination: IHubDestination
  hubSlug: string
}

// Sea badge colors and icons
const getSeaBadge = (slug: string): { label: string; color: string; icon: string } => {
  const chernomorye = [
    'moskva-sochi-sea', 'krasnodar-sochi-sea', 'krasnodar-anapa-sea', 'krasnodar-gelendzhik-sea',
    'moskva-anapa-sea', 'rostov-sochi-sea', 'krasnodar-tuapse-sea',
    'krasnodar-novorossijsk-sea', 'krasnodar-olginka-sea', 'krasnodar-arhipo-osipovka-sea',
    'krasnodar-adler-sea', 'krasnodar-dzhubga-sea', 'moskva-gelendzhik-sea',
    'krasnodar-kabardinka-sea', 'krasnodar-vityazevo-sea', 'stavropol-anapa-sea',
    'krasnodar-abrau-dyurso-sea', 'krasnodar-novomihajlovskij-sea', 'krasnodar-divnomorskoe-sea',
    'krasnodar-sukko-sea', 'moskva-adler-sea', 'krasnodar-lermontovo-sea',
    'krasnodar-lazarevskoe-sea', 'moskva-blagoveshchenskaya-sea', 'moskva-novorossijsk-sea',
    'stavropol-sochi-sea', 'rostov-anapa-sea', 'krasnodar-blagoveshchenskaya-sea',
    'krasnodar-nebug-sea', 'stavropol-gelendzhik-sea', 'rostov-gelendzhik-sea',
    'krasnodar-dzhemete-sea', 'moskva-divnomorskoe-sea', 'rostov-novorossijsk-sea',
    'stavropol-novorossijsk-sea', 'krasnodar-betta-sea', 'krasnodar-shepsi-sea',
    'rostov-adler-sea', 'krasnodar-dederkoj-sea', 'krasnodar-vardane-sea',
    'moskva-agoj-sea', 'moskva-arhipo-osipovka-sea', 'moskva-kabardinka-sea',
    'moskva-tuapse-sea', 'rostov-arhipo-osipovka-sea', 'krasnodar-krinitsa-sea',
    'krasnodar-praskoveevka-sea', 'moskva-dzhubga-sea', 'moskva-hosta-sea',
    'moskva-sukko-sea', 'moskva-vityazevo-sea', 'rostov-kabardinka-sea',
    'rostov-vityazevo-sea', 'stavropol-adler-sea', 'stavropol-lazarevskoe-sea',
    'stavropol-vityazevo-sea',
  ];
  const krym = ['krasnodar-krym-sea'];
  const kaspij = ['moskva-derbent-sea', 'moskva-mahachkala-sea'];
  const azovskoe = [
    'rostov-ejsk-sea', 'krasnodar-taman-sea', 'krasnodar-dolzhanskaya-sea',
    'krasnodar-golubitskaya-sea', 'krasnodar-kuchugury-sea', 'krasnodar-peresyp-sea',
    'krasnodar-za-rodinu-sea', 'rostov-golubitskaya-sea', 'moskva-golubitskaya-sea',
    'stavropol-peresyp-sea',
  ];

  if (chernomorye.includes(slug)) return { label: 'Чёрное море', color: '#0ea5e9', icon: '/icons/beach_ico.png' };
  if (krym.includes(slug)) return { label: 'Крым', color: '#10b981', icon: '/icons/palm_ico.png' };
  if (kaspij.includes(slug)) return { label: 'Каспий', color: '#6366f1', icon: '/icons/wave_ico.png' };
  if (azovskoe.includes(slug)) return { label: 'Азовское', color: '#f59e0b', icon: '/icons/sun_ico.png' };
  return { label: '', color: '#999', icon: '/icons/beach_ico.png' };
}

const SeaDestinationCard = ({ destination, hubSlug }: Props) => {
  const formatPrice = (price?: number) => {
    if (!price) return null
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const seaBadge = getSeaBadge(destination.slug)

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
        <div className={s.titleRow}>
          <h3 className={s.cardTitle}>{destination.name}</h3>
          {destination.isFeatured && (
            <span className={s.featuredBadge}>Популярное</span>
          )}
        </div>
        {seaBadge.label && (
          <span className={s.seaBadge} style={{ backgroundColor: seaBadge.color }}>
            {seaBadge.label}
          </span>
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
          </div>
        )}
        <div className={s.orderSection}>
          <div className={s.cardIcon}>
            <Image
              src={seaBadge.icon}
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

export default SeaDestinationCard
