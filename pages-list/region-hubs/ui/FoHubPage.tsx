import { FederalDistrict } from '../types'
import s from './FoHubPage.module.scss'

interface CityInfo {
  slug: string
  name: string
  routeCount: number
  minPrice: number
}

interface Props {
  fo: FederalDistrict
  citiesInfo: CityInfo[]
}

export default function FoHubPage({ fo, citiesInfo }: Props) {
  return (
    <div className={s.page}>
      <div className="container">
        <nav className={s.breadcrumbs}>
          <a href="/">Главная</a>
          <span className={s.sep}>/</span>
          <a href="/regions/">Регионы</a>
          <span className={s.sep}>/</span>
          <span>{fo.shortName}</span>
        </nav>

        <h1 className={s.h1}>Такси межгород — {fo.name}</h1>
        <p className={s.subtitle}>
          {citiesInfo.length} городов с междугородним такси в {fo.shortName}
        </p>

        <div className={s.cityGrid}>
          {citiesInfo.map(city => (
            <a
              key={city.slug}
              href={`/regions/${fo.slug}/${city.slug}/`}
              className={s.cityCard}
            >
              <span className={s.cityName}>{city.name}</span>
              <span className={s.cityMeta}>
                {city.routeCount} направлений
                {city.minPrice > 0 && ` · от ${city.minPrice.toLocaleString('ru-RU')}₽`}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
