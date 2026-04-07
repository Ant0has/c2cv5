import { FederalDistrict } from '../types'
import { FEDERAL_DISTRICTS } from '../config/registry'
import OrderButton from './OrderButton'
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
  const totalRoutes = citiesInfo.reduce((sum, c) => sum + c.routeCount, 0)
  const allMinPrices = citiesInfo.filter(c => c.minPrice > 0).map(c => c.minPrice)
  const overallMinPrice = allMinPrices.length > 0 ? Math.min(...allMinPrices) : 0
  const otherFos = FEDERAL_DISTRICTS.filter(fd => fd.slug !== fo.slug)

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

        <p className={s.description}>
          Служба City2City предлагает междугороднее такси в {citiesInfo.length} городах {fo.nameGenitive}.
          {totalRoutes > 0 && ` Доступно ${totalRoutes} направлений`}
          {overallMinPrice > 0 && ` с ценами от ${overallMinPrice.toLocaleString('ru-RU')}₽`}.
          {' '}Фиксированные цены, подача автомобиля от 30 минут, комфортные иномарки.
        </p>

        <div className={s.statsRow}>
          <div className={s.stat}>
            <span className={s.statValue}>{citiesInfo.length}</span>
            <span className={s.statLabel}>городов</span>
          </div>
          <div className={s.stat}>
            <span className={s.statValue}>{totalRoutes}</span>
            <span className={s.statLabel}>направлений</span>
          </div>
          {overallMinPrice > 0 && (
            <div className={s.stat}>
              <span className={s.statValue}>от {overallMinPrice.toLocaleString('ru-RU')}₽</span>
              <span className={s.statLabel}>минимальная цена</span>
            </div>
          )}
        </div>

        <section className={s.section}>
          <h2 className={s.h2}>Города {fo.nameGenitive}</h2>
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
        </section>

        <div className={s.ctaBlock}>
          <h3 className={s.ctaTitle}>Заказать междугороднее такси</h3>
          <p className={s.ctaText}>Позвоните или оставьте заявку — подтвердим заказ за 5 минут</p>
          <div className={s.ctaActions}>
            <OrderButton cityName="" />
            <a href="tel:+79381568757" className={s.phoneLink}>+7 (938) 156-87-57</a>
          </div>
        </div>

        {otherFos.length > 0 && (
          <section className={s.section}>
            <h2 className={s.h2}>Другие регионы</h2>
            <div className={s.foGrid}>
              {otherFos.map(fd => (
                <a key={fd.slug} href={`/regions/${fd.slug}/`} className={s.foLink}>
                  {fd.name} ({fd.shortName})
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
