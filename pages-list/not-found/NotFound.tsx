'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { requisitsData } from '@/shared/data/requisits.data';
import { FEDERAL_DISTRICTS } from '@/pages-list/region-hubs/config/registry';
import { analytics } from '@/shared/services/analytics.service';
import { cleanRoutePoint } from '@/feature/calculator/route-context';
import styles from './NotFound.module.scss';

const TripConstructor = dynamic(() => import('@/feature/calculator/ui/trip-constructor/TripConstructor'), {
  ssr: false,
  loading: () => <p role="status">Загружаем подбор автомобиля…</p>,
});
const cities = Array.from(new Set(FEDERAL_DISTRICTS.flatMap(district => district.cities.map(city => city.name))))
  .sort((a, b) => a.localeCompare(b, 'ru'));
const directions = [
  { href: '/mezhgorod', label: 'Между городами', detail: 'Выбрать город отправления', icon: 'road' },
  { href: '/morskoj-otdyh', label: 'К морю', detail: 'Курорты и побережье', icon: 'sea' },
  { href: '/gornolyzhka', label: 'В горы', detail: 'Горнолыжные курорты', icon: 'mountain' },
  { href: '/napravleniya', label: 'Все направления', detail: 'Найти своё место для поездки', icon: 'compass' },
];

function DirectionIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'road' && <><path d="M11 5 5 27M21 5l6 22M16 5v4m0 5v4m0 5v4" /><path d="M5 5h3m16 0h3" /></>}
    {kind === 'sea' && <><path d="M3 22c4-5 6 5 10 0s6 5 10 0 4 0 6 0M3 28c4-5 6 5 10 0s6 5 10 0 4 0 6 0M4 17h24" /><path d="M10 17a6 6 0 0 1 12 0M16 3v3M6 7l2 2m18-2-2 2" /></>}
    {kind === 'mountain' && <><path d="m2 26 11-20 11 20H2Zm18-15 10 15h-6" /><path d="m9 13 4 3 4-3" /></>}
    {kind === 'compass' && <><circle cx="16" cy="16" r="12" /><path d="m21 11-3 7-7 3 3-7 7-3Z" /></>}
  </svg>;
}

export default function NotFoundPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [trip, setTrip] = useState<{ from: string; to: string } | null>(null);
  const tripHeading = useRef<HTMLHeadingElement>(null);
  const fromInput = useRef<HTMLInputElement>(null);
  const toInput = useRef<HTMLInputElement>(null);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    if (!trip) return;
    tripHeading.current?.focus({ preventScroll: true });
    tripHeading.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [trip]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const points = { from: cleanRoutePoint(from), to: cleanRoutePoint(to) };
    if (!points.from || !points.to) {
      setError('Укажите, откуда и куда хотите поехать.');
      (!points.from ? fromInput : toInput).current?.focus();
      return;
    }
    const normalized = (value: string) => value.toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/\s+/g, ' ');
    if (normalized(points.from) === normalized(points.to)) {
      setError('Для междугородней поездки выберите разные пункты отправления и назначения.');
      toInput.current?.focus();
      return;
    }
    setError('');
    setTrip(points);
    analytics.reachGoal('not_found_pick_trip');
  }

  function trackLink(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as Element).closest<HTMLElement>('[data-recovery-action]');
    if (link) analytics.reachGoal('not_found_recovery', { action: link.dataset.recoveryAction });
    // Never include the unknown URL, query string or the entered addresses in goals.
  }

  return <div className={styles.page} data-page="helpful-404" onClick={trackLink}>
    <div className={styles.inner}>
      <section className={styles.hero} aria-labelledby="not-found-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span aria-hidden="true" />404 · Страница не найдена</p>
          <h1 id="not-found-title" className={styles.title}>Эта страница<br />не нашлась.<br /><span>Найдём вашу поездку</span></h1>
          <p className={styles.description}>Укажите маршрут — поможем с поездкой.<br className={styles.desktopBreak} /> Если нужна помощь, позвоните или напишите нам.</p>
          <Link href="/mezhgorod" prefetch={false} className={styles.textLink} data-recovery-action="routes">Все маршруты <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.art} aria-hidden="true">
          <Image src="/images/404-road-city2city-v1.webp" alt="" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 60vw" priority unoptimized />
        </div>
      </section>

      <section className={styles.searchCard} aria-labelledby="trip-picker-title">
        <div className={styles.searchHeading}>
          <h2 id="trip-picker-title">Куда отправимся?</h2>
          <p>Начните с двух точек — остальное подберём дальше.</p>
        </div>
        <form onSubmit={submit} className={styles.form} aria-describedby={error ? 'trip-picker-error' : undefined}>
          <label className={styles.field} htmlFor="recovery-from"><span className={styles.fieldLabel}><i aria-hidden="true" />Откуда</span>
            <input id="recovery-from" ref={fromInput} value={from} onChange={event => { setFrom(event.target.value); setError(''); }} placeholder="Город отправления" list="recovery-cities" autoComplete="off" maxLength={160} required />
          </label>
          <button type="button" className={styles.swap} aria-label="Поменять местами пункты отправления и назначения" disabled={!ready} onClick={() => { setFrom(to); setTo(from); setError(''); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 8h15m-4-4 4 4-4 4M20 16H5m4-4-4 4 4 4" /></svg></button>
          <label className={styles.field} htmlFor="recovery-to"><span className={styles.fieldLabel}><i aria-hidden="true" />Куда</span>
            <input id="recovery-to" ref={toInput} value={to} onChange={event => { setTo(event.target.value); setError(''); }} placeholder="Город или адрес назначения" list="recovery-cities" autoComplete="off" maxLength={160} required />
          </label>
          <datalist id="recovery-cities">{cities.map(city => <option key={city} value={city} />)}</datalist>
          <button type="submit" className={styles.primaryButton} disabled={!ready}>Подобрать поездку <span aria-hidden="true">→</span></button>
        </form>
        {error && <p id="trip-picker-error" role="alert" className={styles.error}>{error}</p>}
        <noscript><p className={styles.note}>Для подбора здесь нужен JavaScript. Можно <a href="/mezhgorod">выбрать маршрут в каталоге</a> или <a href={`tel:${requisitsData.PHONE}`}>позвонить нам</a>.</p></noscript>
        <p className={styles.note}>Нет страницы нужного маршрута? Это не значит, что поездка невозможна.</p>
      </section>

      <div className={`${styles.art} ${styles.mobileArt}`} aria-hidden="true">
        <Image src="/images/404-road-city2city-v1.webp" alt="" width={1536} height={1024} sizes="100vw" unoptimized />
      </div>

      {trip && <section className={styles.tripSection} aria-labelledby="recovery-trip-title">
        <h2 ref={tripHeading} tabIndex={-1} id="recovery-trip-title">Подберём автомобиль для вашей поездки</h2>
        <TripConstructor key={JSON.stringify(trip)} context={trip} id="recovery-order">
          <div className={styles.fallback}>
            <p>Если подбор не загрузился, свяжитесь с нами — поможем с поездкой.</p>
            <a href={`tel:${requisitsData.PHONE}`} data-recovery-action="constructor_fallback_phone">{requisitsData.PHONE_MARKED}</a>
            <Link href="/mezhgorod" prefetch={false} data-recovery-action="constructor_fallback_routes">Каталог маршрутов</Link>
          </div>
        </TripConstructor>
      </section>}

      <section className={styles.directions} aria-labelledby="recovery-directions-title">
        <div className={styles.sectionHeading}><h2 id="recovery-directions-title">Или выберите направление</h2><p>Нужная дорога начинается здесь</p></div>
        <div className={styles.cards}>{directions.map(direction => <Link key={direction.href} href={direction.href} prefetch={false} className={styles.directionCard} data-recovery-action={direction.icon}>
          <span className={styles.directionIcon}><DirectionIcon kind={direction.icon} /></span>
          <span><strong>{direction.label}</strong><small>{direction.detail}</small></span>
          <span className={styles.cardArrow} aria-hidden="true">↗</span>
        </Link>)}</div>
      </section>

      <section className={styles.support} aria-labelledby="recovery-support-title">
        <div><h2 id="recovery-support-title">Поможем с маршрутом</h2><p>Позвоните или напишите — обсудим вашу поездку.</p></div>
        <div className={styles.contacts}>
          <a className={styles.phone} href={`tel:${requisitsData.PHONE}`} data-recovery-action="phone">{requisitsData.PHONE_MARKED}</a>
          <div className={styles.messengers}>
            <a href={`https://t.me/${requisitsData.TELEGRAM_NICKNAME}`} target="_blank" rel="noopener noreferrer" data-recovery-action="telegram">Telegram <span aria-hidden="true">↗</span></a>
            <a href={`https://max.ru/${requisitsData.MAX_NICKNAME}`} target="_blank" rel="noopener noreferrer" data-recovery-action="max">MAX <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <div className={styles.homeLink}><Link href="/" prefetch={false} data-recovery-action="home">← Вернуться на главную</Link></div>
    </div>
  </div>;
}
