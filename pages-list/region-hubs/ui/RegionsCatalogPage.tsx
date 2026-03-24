import { FEDERAL_DISTRICTS } from '../config/registry'
import s from './FoHubPage.module.scss'

export default function RegionsCatalogPage() {
  return (
    <div className={s.page}>
      <div className="container">
        <nav className={s.breadcrumbs}>
          <a href="/">Главная</a>
          <span className={s.sep}>/</span>
          <span>Регионы</span>
        </nav>

        <h1 className={s.h1}>Междугороднее такси по регионам России</h1>
        <p className={s.subtitle}>
          {FEDERAL_DISTRICTS.reduce((sum, fd) => sum + fd.cities.length, 0)} городов в 8 федеральных округах
        </p>

        {FEDERAL_DISTRICTS.map(fd => (
          <section key={fd.slug} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
              <a href={`/regions/${fd.slug}/`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {fd.name} ({fd.shortName})
              </a>
            </h2>
            <div className={s.cityGrid}>
              {fd.cities.map(city => (
                <a
                  key={city.slug}
                  href={`/regions/${fd.slug}/${city.slug}/`}
                  className={s.cityCard}
                >
                  <span className={s.cityName}>Такси межгород {city.name}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
