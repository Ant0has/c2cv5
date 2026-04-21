'use client'

import { useEffect, useState } from 'react'
import { FEDERAL_DISTRICTS } from '@/pages-list/region-hubs/config/registry'
import { PILOT_CITIES } from '@/pages-list/mezhgorod-city/config/pilot'
import OrderButton from '@/pages-list/region-hubs/ui/OrderButton'
import s from '@/pages-list/region-hubs/ui/RegionCityHubPage.module.scss'
import CalculatorDefault from '@/feature/calculator/ui/calculator-default/CalculatorDefault'
import { Prices } from '@/shared/types/enums'
import { requisitsData } from '@/shared/data/requisits.data'

import {
  ROOT_SEO_SECTIONS,
  ROOT_ADVANTAGES,
  ROOT_FAQ,
  POPULAR_ROUTES,
  TRUST_STATS,
  ORDER_STEPS,
  LEGAL_INFO,
} from '../config/content'
import StickyMobileCTA from './StickyMobileCTA'

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

  // Live order counter — плавный рост базового значения в течение дня
  const [tripsToday, setTripsToday] = useState(TRUST_STATS.tripsToday)
  useEffect(() => {
    const timer = setInterval(() => {
      setTripsToday(v => v + Math.random() < 0.3 ? v + 1 : v)
    }, 45000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={s.page}>
      {/* Hero */}
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

          {/* Live counter badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#22c55e', fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }} />
            Сегодня заказано {tripsToday} поездок
          </div>

          <div className={s.heroActions}>
            <OrderButton cityName="" />
            <a href={`tel:${requisitsData.PHONE}`} className={s.phoneLink}>{requisitsData.PHONE_MARKED}</a>
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

      {/* Trust-bar — рейтинг + кол-во поездок */}
      <section style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#ff6b00' }}>{TRUST_STATS.rating} ★</div>
              <div style={{ fontSize: 13, color: '#666' }}>рейтинг на основе {TRUST_STATS.reviewsCount.toLocaleString('ru-RU')} отзывов</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{TRUST_STATS.totalTrips.toLocaleString('ru-RU')}</div>
              <div style={{ fontSize: 13, color: '#666' }}>поездок за {TRUST_STATS.yearsOnMarket} лет</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{TRUST_STATS.driversCount}+</div>
              <div style={{ fontSize: 13, color: '#666' }}>проверенных водителей</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>24/7</div>
              <div style={{ fontSize: 13, color: '#666' }}>без наценок ночью</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="order" style={{ background: '#1f1f1f', padding: '40px 0' }}>
        <div className="container">
          <h2 className={s.h2} style={{ color: '#fff', textAlign: 'center', marginBottom: 24 }}>
            Рассчитать стоимость межгородной поездки
          </h2>
          <CalculatorDefault selectedPlan={Prices.COMFORT} />
        </div>
      </section>

      <div className="container">
        {/* Как заказать — 3 шага */}
        <section className={s.section}>
          <h2 className={s.h2}>Как заказать такси межгород</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 24 }}>
            {ORDER_STEPS.map(step => (
              <div key={step.num} style={{ padding: 24, background: '#fafafa', borderRadius: 12, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -16, left: 20, width: 48, height: 48, borderRadius: '50%', background: '#ff6b00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, boxShadow: '0 4px 12px rgba(255,107,0,0.4)' }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 20, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: '#555', margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Города */}
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

        {/* Популярные направления */}
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

        {/* Преимущества */}
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

        {/* SEO-текст с H3-подзаголовками */}
        <section className={s.section}>
          <h2 className={s.h2}>О сервисе «Такси межгород»</h2>
          <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {ROOT_SEO_SECTIONS.map((section, i) => (
              <div key={i}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 8 }}>{section.title}</h3>
                <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: '#333', margin: 0 }}>{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Реквизиты и документы */}
        <section className={s.section}>
          <h2 className={s.h2}>Документы и реквизиты</h2>
          <div style={{ padding: 24, background: '#fafafa', borderRadius: 12, maxWidth: 900 }}>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{LEGAL_INFO.entity}</p>
            <p style={{ fontSize: 15, color: '#555', margin: '4px 0' }}>ИНН: {LEGAL_INFO.inn}</p>
            <p style={{ fontSize: 15, color: '#555', margin: '4px 0 16px' }}>ОГРНИП: {LEGAL_INFO.ogrnip}</p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#333', margin: 0 }}>{LEGAL_INFO.documentsNote}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
              <a href="/oferta" style={{ fontSize: 14, color: '#ff6b00', textDecoration: 'none' }}>Оферта →</a>
              <a href="/terms" style={{ fontSize: 14, color: '#ff6b00', textDecoration: 'none' }}>Условия →</a>
              <a href="/privacy-policy" style={{ fontSize: 14, color: '#ff6b00', textDecoration: 'none' }}>Политика конфиденциальности →</a>
              <a href="/cancellation" style={{ fontSize: 14, color: '#ff6b00', textDecoration: 'none' }}>Отмена и возврат →</a>
            </div>
          </div>
        </section>

        {/* B2B CTA */}
        <div className={s.ctaBlock}>
          <h3 className={s.ctaTitle}>Документы и оплата для бизнеса</h3>
          <p className={s.ctaText}>
            Безнал с НДС, договор, ЭДО через Диадок и СБИС. Корпоративный тариф, выделенный менеджер, единый счёт в конце месяца.
          </p>
          <a href="/dlya-biznesa" className={s.phoneLink}>Подробнее о корпоративных поездках →</a>
        </div>

        {/* FAQ */}
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

      <StickyMobileCTA />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
