import Link from 'next/link'
import s from './PopularDirections.module.scss'

interface Direction {
  href: string
  from: string
  to: string
  km: number
  priceFrom: number
}

// Топ-12 направлений по freq Wordstat 2026.
// Карточки выводятся на главной — они дают:
// (1) anchor-text с конкретным маршрутом (Yandex видит релевантность по запросу),
// (2) клики реальных пользователей → поведенческий сигнал > чем dropdown-меню,
// (3) внутренний trust-trail для всех слабых маршрутных страниц.
const DIRECTIONS: Direction[] = [
  { href: '/mezhgorod/moskva/sankt-peterburg.html', from: 'Москва', to: 'Санкт-Петербург', km: 711, priceFrom: 18000 },
  { href: '/mezhgorod/sankt-peterburg/moskva.html', from: 'Санкт-Петербург', to: 'Москва', km: 711, priceFrom: 18000 },
  { href: '/mezhgorod/moskva/voronezh.html', from: 'Москва', to: 'Воронеж', km: 515, priceFrom: 13500 },
  { href: '/mezhgorod/moskva/krasnodar.html', from: 'Москва', to: 'Краснодар', km: 1390, priceFrom: 28000 },
  { href: '/mezhgorod/moskva/sochi.html', from: 'Москва', to: 'Сочи', km: 1620, priceFrom: 32000 },
  { href: '/svo-taxi-moskva-donetsk.html', from: 'Москва', to: 'Донецк', km: 1170, priceFrom: 13000 },
  { href: '/mezhgorod/moskva/nizhniy-novgorod.html', from: 'Москва', to: 'Нижний Новгород', km: 425, priceFrom: 11000 },
  { href: '/mezhgorod/moskva/yaroslavl.html', from: 'Москва', to: 'Ярославль', km: 270, priceFrom: 7500 },
  { href: '/mezhgorod/moskva/tula.html', from: 'Москва', to: 'Тула', km: 195, priceFrom: 5500 },
  { href: '/mezhgorod/moskva/kazan.html', from: 'Москва', to: 'Казань', km: 820, priceFrom: 18500 },
  { href: '/mezhgorod/moskva/samara.html', from: 'Москва', to: 'Самара', km: 1050, priceFrom: 22500 },
  { href: '/mezhgorod/moskva/ekaterinburg.html', from: 'Москва', to: 'Екатеринбург', km: 1790, priceFrom: 36000 },
]

export default function PopularDirections() {
  return (
    <section className={`container ${s.section}`}>
      <h2 className={s.title}>Популярные направления</h2>
      <p className={s.subtitle}>Самые востребованные маршруты межгорода — фиксированная цена, подача от 30 минут</p>

      <div className={s.grid}>
        {DIRECTIONS.map((d) => (
          <Link key={d.href} href={d.href} className={s.card} prefetch={false}>
            <div className={s.cardRoute}>
              <span className={s.cardCity}>{d.from}</span>
              <span className={s.cardArrow}>→</span>
              <span className={s.cardCity}>{d.to}</span>
            </div>
            <div className={s.cardMeta}>
              <span className={s.cardKm}>{d.km} км</span>
              <span className={s.cardPrice}>от {d.priceFrom.toLocaleString('ru-RU')} ₽</span>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/mezhgorod" className={s.allLink}>
        Все 5&nbsp;700 направлений →
      </Link>
    </section>
  )
}
