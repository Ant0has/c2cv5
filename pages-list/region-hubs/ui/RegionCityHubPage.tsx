import Image from 'next/image'
import { CityHubPageData, RegionHubRoute } from '../types'
import { generateCityFaq } from '../config/faq'
import { generateCityDescription, ADVANTAGES } from '../config/content'
import OrderButton from './OrderButton'
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
  const description = generateCityDescription(city.name, city.nameGenitive, city.nameLocative, totalCount, minPrice)

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
      {/* Hero */}
      <div className={s.hero}>
        <Image
          src={`/images/regions/${city.slug}.jpg`}
          alt={`Такси межгород ${city.name}`}
          fill
          priority
          quality={80}
          className={s.heroImage}
        />
        <div className={s.heroOverlay} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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
          <p className={s.heroDescription}>{description}</p>

          <div className={s.heroActions}>
            <OrderButton cityName={city.nameGenitive.replace(/^из /i, '')} />
            <a href="tel:+79381568757" className={s.phoneLink}>+7 (938) 156-87-57</a>
          </div>

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
        </div>
      </div>

      <div className="container">
        {/* Преимущества */}
        <section className={s.section}>
          <h2 className={s.h2}>Почему выбирают City2City {city.nameLocative}</h2>
          <div className={s.advantagesGrid}>
            {ADVANTAGES.map((adv, i) => (
              <div key={i} className={s.advantageCard}>
                <h3 className={s.advantageTitle}>{adv.title}</h3>
                <p className={s.advantageDesc}>{adv.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Популярные маршруты */}
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

        {/* Все маршруты по расстоянию */}
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

        {/* CTA между секциями */}
        <div className={s.ctaBlock}>
          <h3 className={s.ctaTitle}>Нужен маршрут, которого нет в списке?</h3>
          <p className={s.ctaText}>Мы организуем поездку по любому направлению {city.nameGenitive}. Позвоните или оставьте заявку.</p>
          <OrderButton cityName={city.nameGenitive.replace(/^из /i, '')} />
        </div>

        {/* Соседние города */}
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

        {/* FAQ */}
        <section className={s.section}>
          <h2 className={s.h2}>Часто задаваемые вопросы</h2>
          <div className={s.faqList}>
            {faq.map((item, i) => (
              <details key={i} className={s.faqItem} open={i === 0}>
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
