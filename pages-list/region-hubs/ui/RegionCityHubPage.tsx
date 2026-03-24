import { CityHubPageData, RegionHubRoute } from '../types'
import { generateCityFaq } from '../config/faq'
import s from './RegionCityHubPage.module.scss'

interface Props {
  data: CityHubPageData
}

function groupByDistance(routes: RegionHubRoute[]) {
  const groups = {
    near: [] as RegionHubRoute[],
    medium: [] as RegionHubRoute[],
    far: [] as RegionHubRoute[],
    veryFar: [] as RegionHubRoute[],
    unknown: [] as RegionHubRoute[],
  }

  for (const route of routes) {
    if (route.distance_km === null) {
      groups.unknown.push(route)
    } else if (route.distance_km <= 100) {
      groups.near.push(route)
    } else if (route.distance_km <= 300) {
      groups.medium.push(route)
    } else if (route.distance_km <= 1000) {
      groups.far.push(route)
    } else {
      groups.veryFar.push(route)
    }
  }

  return groups
}

function formatPrice(price: number | null): string {
  if (!price || price <= 0) return ''
  return price.toLocaleString('ru-RU')
}

export default function RegionCityHubPage({ data }: Props) {
  const { city, fo, routes, totalCount, minPrice } = data
  const faq = generateCityFaq(city.name, city.nameGenitive, minPrice, totalCount)
  const groups = groupByDistance(routes)

  const popular = [...routes]
    .filter(r => r.distance_km && r.distance_km > 0)
    .sort((a, b) => (a.distance_km || 9999) - (b.distance_km || 9999))
    .slice(0, 10)

  const distanceSections = [
    { title: 'Ближние направления (до 100 км)', routes: groups.near },
    { title: 'Средние направления (100–300 км)', routes: groups.medium },
    { title: 'Дальние направления (300–1000 км)', routes: groups.far },
    { title: 'Межрегиональные (от 1000 км)', routes: groups.veryFar },
    { title: 'Другие направления', routes: groups.unknown },
  ].filter(section => section.routes.length > 0)

  return (
    <div className={s.page}>
      <div className="container">
        <nav className={s.breadcrumbs}>
          <a href="/">Главная</a>
          <span className={s.sep}>/</span>
          <a href="/regions/">Регионы</a>
          <span className={s.sep}>/</span>
          <a href={`/regions/${fo.slug}/`}>{fo.shortName}</a>
          <span className={s.sep}>/</span>
          <span>Такси межгород {city.name}</span>
        </nav>

        <h1 className={s.h1}>Такси межгород {city.name}</h1>

        <div className={s.stats}>
          <div className={s.stat}>
            <span className={s.statValue}>{totalCount}</span>
            <span className={s.statLabel}>направлений</span>
          </div>
          {minPrice > 0 && (
            <div className={s.stat}>
              <span className={s.statValue}>от {formatPrice(minPrice)}₽</span>
              <span className={s.statLabel}>минимальная цена</span>
            </div>
          )}
          <div className={s.stat}>
            <span className={s.statValue}>от 30 мин</span>
            <span className={s.statLabel}>подача авто</span>
          </div>
        </div>

        {popular.length > 0 && (
          <section className={s.section}>
            <h2 className={s.h2}>Популярные направления {city.nameGenitive}</h2>
            <nav className={s.routeGrid}>
              {popular.map(route => (
                <a key={route.ID} href={`/${route.url}.html`} className={s.routeCard}>
                  <span className={s.routeTitle}>{route.title}</span>
                  {route.price_economy && route.price_economy > 0 && (
                    <span className={s.routePrice}>от {formatPrice(route.price_economy)}₽</span>
                  )}
                  {route.distance_km && (
                    <span className={s.routeDistance}>{route.distance_km} км</span>
                  )}
                </a>
              ))}
            </nav>
          </section>
        )}

        {distanceSections.map(section => (
          <section key={section.title} className={s.section}>
            <h2 className={s.h2}>{section.title}</h2>
            <nav className={s.routeList}>
              {section.routes.map(route => (
                <a key={route.ID} href={`/${route.url}.html`} className={s.routeLink}>
                  <span>{route.title}</span>
                  {route.price_economy && route.price_economy > 0 && (
                    <span className={s.price}>от {formatPrice(route.price_economy)}₽</span>
                  )}
                </a>
              ))}
            </nav>
          </section>
        ))}

        {fo.cities.length > 1 && (
          <section className={s.section}>
            <h2 className={s.h2}>Такси межгород в других городах {fo.nameGenitive}</h2>
            <nav className={s.neighborGrid}>
              {fo.cities
                .filter(c => c.slug !== city.slug)
                .map(c => (
                  <a key={c.slug} href={`/regions/${fo.slug}/${c.slug}/`} className={s.neighborLink}>
                    Такси межгород {c.name}
                  </a>
                ))}
            </nav>
          </section>
        )}

        <section className={s.section}>
          <h2 className={s.h2}>Часто задаваемые вопросы</h2>
          <div className={s.faqList}>
            {faq.map((item, i) => (
              <details key={i} className={s.faqItem}>
                <summary className={s.faqQuestion}>{item.question}</summary>
                <p className={s.faqAnswer}>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
