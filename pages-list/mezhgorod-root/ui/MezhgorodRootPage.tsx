'use client'

import { FEDERAL_DISTRICTS } from '@/pages-list/region-hubs/config/registry'
import { PILOT_CITIES } from '@/pages-list/mezhgorod-city/config/pilot'
import OrderButton from '@/pages-list/region-hubs/ui/OrderButton'
import s from '@/pages-list/region-hubs/ui/RegionCityHubPage.module.scss'
import CalculatorDefault from '@/feature/calculator/ui/calculator-default/CalculatorDefault'
import { Prices } from '@/shared/types/enums'

import { ROOT_SEO_TEXT, ROOT_ADVANTAGES, ROOT_FAQ, POPULAR_ROUTES } from '../config/content'

interface Props {
  stats: {
    cityCount: number
    routeCount: string
    minPrice: string
  }
}

export default function MezhgorodRootPage({ stats }: Props) {
  const pilotSet = new Set(PILOT_CITIES.map(c => c.slug))
  const cityHref = (foSlug: string, citySlug: string) =>
    pilotSet.has(citySlug) ? `/mezhgorod/${citySlug}` : `/regions/${foSlug}/${citySlug}/`

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <div
          className={s.heroImage}
          style={{
            backgroundImage: 'url(/images/og/mezhgorod-root.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            inset: 0,
          }}
        />
        <div className={s.heroOverlay} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <nav className={s.breadcrumbs}>
            <a href="/">Главная</a>
            <span className={s.sep}>/</span>
            <span>Межгород</span>
          </nav>

          <h1 className={s.h1}>Такси межгород по России</h1>
          <p className={s.heroDescription}>
            Фиксированные цены на тысячи маршрутов между городами России. Подача от 30 минут. Работаем с 2017 года.
          </p>

          <div className={s.heroActions}>
            <OrderButton cityName="" />
            <a href="tel:+79381568757" className={s.phoneLink}>+7 (938) 156-87-57</a>
          </div>

          <div className={s.stats}>
            <div className={s.stat}>
              <span className={s.statValue}>{stats.cityCount}</span>
              <span className={s.statLabel}>городов-отправления</span>
            </div>
            <div className={s.stat}>
              <span className={s.statValue}>{stats.routeCount}</span>
              <span className={s.statLabel}>маршрутов</span>
            </div>
            <div className={s.stat}>
              <span className={s.statValue}>от 30 мин</span>
              <span className={s.statLabel}>подача авто</span>
            </div>
          </div>
        </div>
      </div>

      <section style={{ background: '#1f1f1f', padding: '40px 0' }}>
        <div className="container">
          <h2 className={s.h2} style={{ color: '#fff', textAlign: 'center', marginBottom: 24 }}>
            Рассчитать стоимость межгородной поездки
          </h2>
          <CalculatorDefault selectedPlan={Prices.COMFORT} />
        </div>
      </section>

      <div className="container">
        <section className={s.section}>
          <h2 className={s.h2}>Выбрать город отправления</h2>
          {FEDERAL_DISTRICTS.map(fd => (
            <div key={fd.slug} style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 12, color: '#555' }}>
                {fd.name} ({fd.shortName})
              </h3>
              <nav className={s.neighborGrid}>
                {fd.cities.map(city => (
                  <a key={city.slug} href={cityHref(fd.slug, city.slug)} className={s.neighborLink}>
                    Такси межгород {city.name}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Популярные направления</h2>
          <nav className={s.routeGrid}>
            {POPULAR_ROUTES.map(r => (
              <a key={r.url} href={r.url} className={s.routeCard}>
                <span className={s.routeTitle}>{r.title}</span>
                <span className={s.routeDistance}>{r.distanceKm} км</span>
              </a>
            ))}
          </nav>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Почему City2City</h2>
          <div className={s.advantagesGrid}>
            {ROOT_ADVANTAGES.map((adv, i) => (
              <div key={i} className={s.advantageCard}>
                <h3 className={s.advantageTitle}>{adv.title}</h3>
                <p className={s.advantageDesc}>{adv.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <div style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '900px', whiteSpace: 'pre-wrap' }}>
            {ROOT_SEO_TEXT}
          </div>
        </section>

        <div className={s.ctaBlock}>
          <h3 className={s.ctaTitle}>Документы и оплата для бизнеса</h3>
          <p className={s.ctaText}>
            Безнал с НДС, договор, ЭДО через Диадок и СБИС. Корпоративный тариф, выделенный менеджер, единый счёт в конце месяца.
          </p>
          <a href="/dlya-biznesa" className={s.phoneLink}>Подробнее о корпоративных поездках →</a>
        </div>

        <section className={s.section}>
          <h2 className={s.h2}>Часто задаваемые вопросы</h2>
          <div className={s.faqList}>
            {ROOT_FAQ.map((item, i) => (
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
