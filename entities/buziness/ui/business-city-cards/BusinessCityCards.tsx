import Link from 'next/link'
import s from './BusinessCityCards.module.scss'

interface CityCardItem {
  slug: string
  name: string
  description: string
  routeCount: number
  href: string
}

interface Props {
  title: string
  cities: CityCardItem[]
}

const BusinessCityCards = ({ title, cities }: Props) => {
  return (
    <div className={s.wrapper}>
      <div className="container">
        <h2 className="title text-white text-center">
          {title}
        </h2>
        <div className={s.grid}>
          {cities.map((city) => (
            <Link key={city.slug} href={city.href} className={s.card}>
              <h3 className={s.cardTitle}>{city.name}</h3>
              <p className={s.cardDescription}>{city.description}</p>
              <div className={s.cardFooter}>
                <span className={s.routeCount}>{city.routeCount}+ маршрутов</span>
                <span className={s.cardArrow}>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BusinessCityCards
