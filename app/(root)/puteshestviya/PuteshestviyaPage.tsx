'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import s from './puteshestviya.module.scss'

const DESTINATIONS = [
  {
    id: 1,
    title: 'Рускеала',
    region: 'Карелия',
    image: '/images/puteshestviya/ruskeala.jpg',
    description: 'Мраморный каньон с бирюзовой водой и ретро-поезд «Рускеальский экспресс». В мае — без туристов, каньон только открывается после зимы.',
    why: 'В мае без толп, каньон только открывается',
  },
  {
    id: 2,
    title: 'Казань',
    region: 'Татарстан',
    image: '/images/puteshestviya/kazan.jpg',
    description: 'Новая туристическая столица России. Кремль, мечеть Кул-Шариф, улица Баумана. На майские — фестиваль «Казанские узоры» 1-5 мая.',
    why: 'Фестиваль «Казанские узоры» 1-5 мая',
  },
  {
    id: 3,
    title: 'Кавминводы',
    region: 'Ставропольский край',
    image: '/images/puteshestviya/kavminvody.jpg',
    description: 'Горячий тренд 2026. Пятигорск, Кисловодск, Ессентуки — природа, лечебные источники и виды на Эльбрус. Весной — идеальная погода.',
    why: 'Идеальная погода, цветение, мало туристов',
  },
  {
    id: 4,
    title: 'Калининград',
    region: 'Калининградская область',
    image: '/images/puteshestviya/kaliningrad.jpg',
    description: 'Европейская атмосфера без загранпаспорта. Рыбная деревня, остров Канта, Куршская коса. Пляжное направление нового поколения.',
    why: 'Европа без визы, в мае уже тепло',
  },
  {
    id: 5,
    title: 'Коломна',
    region: 'Московская область',
    image: '/images/puteshestviya/kolomna.jpg',
    description: 'Идеально на 1 день из Москвы. Кремль, Музей пастилы, калачная. С детьми — лучший вариант на майские без ночёвки.',
    why: 'На 1 день из Москвы, идеально с детьми',
  },
]

const HEADLINES: Record<string, { title: string; subtitle: string }> = {
  may: {
    title: 'Куда поехать на майские — 5 направлений без толп',
    subtitle: 'Проверенные маршруты от команды, которая 8 лет возит людей между городами',
  },
  summer: {
    title: '7 мест в России красивее Европы',
    subtitle: 'Маршруты для тех, кто хочет увидеть Россию по-настоящему',
  },
  general: {
    title: 'Куда поехать по России и не пожалеть',
    subtitle: 'Проверенные маршруты от команды, которая 8 лет возит людей между городами',
  },
}

const MAX_URL = 'https://max.ru/id616606322786_biz'

export default function PuteshestviyaPage() {
  const searchParams = useSearchParams()
  const utmContent = searchParams.get('utm_content') || 'may'
  const headline = HEADLINES[utmContent] || HEADLINES.may

  const trackClick = (goalName: string) => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(36995060, 'reachGoal', goalName)
    }
  }

  return (
    <div className={s.page}>
      {/* Header */}
      <header className={s.header}>
        <a href="/" className={s.logo}>
          <span className={s.logoC}>C</span>ITY<span className={s.logo2}>2</span>CITY
        </a>
      </header>

      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <span className={s.heroBadge}>Подборка · Весна 2026</span>
          <h1 className={s.heroTitle}>{headline.title}</h1>
          <p className={s.heroSubtitle}>{headline.subtitle}</p>
          <div className={s.heroScroll}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className={s.destinations}>
        {DESTINATIONS.map((dest, i) => (
          <article key={dest.id} className={s.card}>
            <div className={s.cardImage}>
              <Image
                src={dest.image}
                alt={`${dest.title}, ${dest.region}`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                quality={85}
                className={s.cardImg}
              />
              <div className={s.cardNumber}>{String(i + 1).padStart(2, '0')}</div>
              <div className={s.cardRegion}>{dest.region}</div>
            </div>
            <div className={s.cardBody}>
              <h2 className={s.cardTitle}>{dest.title}</h2>
              <p className={s.cardDesc}>{dest.description}</p>
              <div className={s.cardWhy}>
                <span className={s.cardWhyLabel}>Почему сейчас</span>
                <span>{dest.why}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* CTA */}
      <section className={s.cta}>
        <div className={s.ctaInner}>
          <span className={s.ctaEmoji}>🗺</span>
          <h2 className={s.ctaTitle}>Каждый день — новые маршруты</h2>
          <p className={s.ctaText}>
            Подписывайся на канал в MAX: гайды, подборки, лайфхаки путешественника по России
          </p>
          <a
            href={MAX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={s.ctaButton}
            onClick={() => trackClick('max_click')}
          >
            Подписаться в MAX
          </a>
          <p className={s.ctaNote}>Бесплатно. Без спама. Только маршруты и гайды.</p>
          <div className={s.ctaStat}>4 000+ маршрутов по 79 регионам</div>
        </div>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <span>© city2city.ru</span>
        <a href="/">На главную</a>
      </footer>

      {/* Sticky bar — always visible */}
      <div className={s.sticky}>
        <span className={s.stickyText}>Подписаться на канал</span>
        <a
          href={MAX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={s.stickyButton}
          onClick={() => trackClick('max_sticky_click')}
        >
          Открыть MAX
        </a>
      </div>
    </div>
  )
}
