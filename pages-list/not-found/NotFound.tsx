import Link from 'next/link';
import cn from 'classnames';
import styles from './NotFound.module.scss';
import Image from 'next/image';
import { requisitsData } from '@/shared/data/requisits.data';

const popularRoutes = [
  { label: 'Москва — Тула', href: '/moskva-tula.html' },
  { label: 'Москва — Калуга', href: '/moskva-kaluga.html' },
  { label: 'Москва — Рязань', href: '/moskva-ryazan.html' },
  { label: 'Москва — Владимир', href: '/moskva-vladimir.html' },
  { label: 'Краснодар — Адлер', href: '/krasnodar-adler.html' },
  { label: 'Краснодар — Анапа', href: '/krasnodar-anapa.html' },
  { label: 'Ростов — Краснодар', href: '/rostov-krasnodar.html' },
  { label: 'Москва — Ярославль', href: '/moskva-yaroslavl.html' },
];

export const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <main className={cn(styles.main, 'app-main container')}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={cn(styles.title, 'font-56-medium')}>Страница не найдена</h1>
          <p className={styles.subtitle}>
            Возможно, страница была удалена или адрес введён неверно.
          </p>

          <Image
            src="/images/404.png"
            alt="Страница не найдена"
            width={400}
            height={320}
            className={styles.image}
          />

          <div className={styles.actions}>
            <Link href="/" className={styles.btnPrimary}>
              На главную
            </Link>
            <Link href={`tel:${requisitsData.PHONE}`} className={styles.btnSecondary}>
              Заказать такси: {requisitsData.PHONE_MARKED}
            </Link>
          </div>

          <div className={styles.messengers}>
            <span className={styles.messengersLabel}>Написать нам:</span>
            <div className={styles.messengerLinks}>
              <Link
                href={`https://t.me/${requisitsData.TELEGRAM_NICKNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.messengerLink}
              >
                Telegram
              </Link>
              <Link
                href={`https://max.ru/${requisitsData.MAX_NICKNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.messengerLink}
              >
                MAX
              </Link>
            </div>
          </div>

          <div className={styles.routes}>
            <h2 className={styles.routesTitle}>Популярные маршруты</h2>
            <div className={styles.routesList}>
              {popularRoutes.map((route) => (
                <Link key={route.href} href={route.href} className={styles.routeLink}>
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
