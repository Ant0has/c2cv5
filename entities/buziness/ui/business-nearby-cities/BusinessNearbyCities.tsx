import Link from 'next/link'
import s from './BusinessNearbyCities.module.scss'

interface NearbyCityItem {
  name: string
  href: string
}

interface Props {
  regionName: string
  regionHref: string
  cities: NearbyCityItem[]
}

const BusinessNearbyCities = ({ regionName, regionHref, cities }: Props) => {
  if (cities.length === 0) return null

  return (
    <div className={s.wrapper}>
      <div className="container">
        <h2 className="title text-white text-center">
          Корпоративное такси в <span className="text-primary">других городах</span>
        </h2>
        <p className={s.subtitle}>
          {regionName}
        </p>
        <div className={s.grid}>
          {cities.map((city) => (
            <Link key={city.href} href={city.href} className={s.chip}>
              {city.name}
              <span className={s.arrow}>&rarr;</span>
            </Link>
          ))}
        </div>
        <div className={s.allLink}>
          <Link href={regionHref}>
            Все города региона &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BusinessNearbyCities
