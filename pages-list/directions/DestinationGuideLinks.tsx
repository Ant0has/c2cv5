import Link from 'next/link';
import {destinationGuides, guideForRoute} from './navigation';
import styles from './DestinationGuideLinks.module.scss';

export default function DestinationGuideLinks({routePath, group}: {routePath?: string; group?: string}) {
  const matched = routePath ? guideForRoute(routePath) : undefined;
  const guides = matched ? [matched] : group ? destinationGuides.filter(place => place.group === group) : [];
  if (!guides.length) return null;
  return <section className="container" data-destination-guides="true" aria-label="Путеводитель по направлениям">
    <div className={styles.panel}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{matched ? 'Планируем поездку' : 'Сначала выберите место отдыха'}</p>
        <h2>{matched ? `Ваше направление — ${matched.name}` : 'Подробнее о курортах'}</h2>
        <p>{matched
          ? 'Варианты приезда, особенности места и что учесть с багажом. Обзор поможет подготовиться к поездке.'
          : 'Выберите курорт: сравните города отправления и узнайте, что важно уточнить перед поездкой.'}</p>
      </div>
      <nav className={styles.links} aria-label={matched ? 'Обзор места поездки' : 'Обзоры курортов'}>
        {guides.map(place => <Link prefetch={false} className={styles.place} key={place.slug} href={'/napravleniya/' + place.slug}>
          <span>{matched ? 'Посмотреть обзор направления' : place.name}</span><span aria-hidden="true">↗</span>
        </Link>)}
        <Link prefetch={false} className={styles.all} href="/napravleniya">Все направления →</Link>
      </nav>
    </div>
  </section>;
}
