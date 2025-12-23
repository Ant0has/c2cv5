'use client'

import { FC, useState } from 'react'
import clsx from 'clsx'
import styles from './YandexReviews.module.scss'
import { LoadingSkeleton } from '@/shared/components/loadingSkeleton/LoadingSkeleton'

const YandexReviewsWidget: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  const organizationId =
    process.env.NEXT_PUBLIC_YANDEX_ORGANIZATION_ID || '1715972728'
  const organizationSlug =
    process.env.NEXT_PUBLIC_YANDEX_ORGANIZATION_SLUG || 'siti2siti'
  const title =
    process.env.NEXT_PUBLIC_YANDEX_TITLE || 'Отзывы клиентов'

  const getWidgetUrl = () => {
    const params = new URLSearchParams({
      comments: '',
      scroll: 'true',
    })

    return `https://yandex.ru/maps-reviews-widget/${organizationId}?${params.toString()}`
  }

  return (
    <section className={styles.section}>
      <div className="container-24">
        <div className={styles.header}>
          <h2 className={clsx(styles.title, 'title title-m-32')}>
            {title}
          </h2>

          <a
            href={`https://yandex.ru/maps/org/${organizationSlug}/${organizationId}/reviews/`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.allReviewsLink}
          >
            Все отзывы на Яндекс.Картах →
          </a>
        </div>

        <div className={styles.widgetWrapper}>
          {!isLoaded && <LoadingSkeleton height="450px" />}

          <div
            className={clsx(styles.widgetContainer, {
              [styles.hidden]: !isLoaded,
            })}
          >
            <iframe
              className={styles.reviewsIframe}
              src={getWidgetUrl()}
              title="Отзывы на Яндекс.Картах"
              loading="lazy"
              scrolling="yes"
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default YandexReviewsWidget
