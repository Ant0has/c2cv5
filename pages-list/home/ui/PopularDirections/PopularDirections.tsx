import Link from 'next/link'
import s from './PopularDirections.module.scss'
import { resolvePublicRoutePath } from '@/shared/lib/public-route-url'

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
// DB-адреса ниже преобразуются в конечные публичные URL по проверенной карте.
// Краснодар→Москва и НН→Москва: в БД есть только обратное направление, поэтому такая семантика.
const DIRECTIONS: Direction[] = [
  { href: '/moskva-piter.html', from: 'Москва', to: 'Санкт-Петербург', km: 710, priceFrom: 24000 },
  { href: '/sankt-peterburg-moskva.html', from: 'Санкт-Петербург', to: 'Москва', km: 720, priceFrom: 24500 },
  { href: '/moskva-voronezh.html', from: 'Москва', to: 'Воронеж', km: 520, priceFrom: 17500 },
  { href: '/krasnodar-moskva.html', from: 'Краснодар', to: 'Москва', km: 1350, priceFrom: 46500 },
  { href: '/moskva-sochi.html', from: 'Москва', to: 'Сочи', km: 1630, priceFrom: 56500 },
  { href: '/svo-taxi-moskva-donetsk.html', from: 'Москва', to: 'Донецк', km: 1140, priceFrom: 39000 },
  { href: '/nizhnij-novgorod-moskva.html', from: 'Нижний Новгород', to: 'Москва', km: 440, priceFrom: 14500 },
  { href: '/moskva-yaroslavl.html', from: 'Москва', to: 'Ярославль', km: 270, priceFrom: 9500 },
  { href: '/moskva-tula.html', from: 'Москва', to: 'Тула', km: 190, priceFrom: 7500 },
  { href: '/moskva-kazan.html', from: 'Москва', to: 'Казань', km: 840, priceFrom: 28500 },
  { href: '/moskva-samara.html', from: 'Москва', to: 'Самара', km: 1100, priceFrom: 37500 },
  { href: '/moskva-ekaterinburg.html', from: 'Москва', to: 'Екатеринбург', km: 1670, priceFrom: 57500 },
]

export default function PopularDirections() {
  return (
    <section className={`container ${s.section}`}>
      <h2 className={s.title}>Популярные направления</h2>
      <p className={s.subtitle}>Ориентировочные цены «от» за автомобиль. Окончательную стоимость согласует диспетчер</p>

      <div className={s.grid}>
        {DIRECTIONS.map((d) => (
          <Link key={d.href} href={resolvePublicRoutePath(d.href)} className={s.card} prefetch={false}>
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
