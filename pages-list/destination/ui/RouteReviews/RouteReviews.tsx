'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import { useEffect, useState } from "react"
import s from './RouteReviews.module.scss'
import clsx from "clsx"
import { BASE_URL_API } from "@/shared/constants"

interface Review {
  id: number
  username: string
  city: string
  rate: number
  route_display: string
  review_text: string
  review_date: string
}

interface ReviewsData {
  reviews: Review[]
  total: number
  averageRating: number
}

interface Props {
  destination: IHubDestination
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : '#e5e7eb'}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
)

const RouteReviews = ({ destination }: Props) => {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const from = encodeURIComponent(destination.fromCity)
        const to = encodeURIComponent(destination.toCity)
        const res = await fetch(`${BASE_URL_API}/route-reviews/by-cities?from=${from}&to=${to}&limit=4`)
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    if (destination.fromCity && destination.toCity) {
      fetchReviews()
    } else {
      setLoading(false)
    }
  }, [destination.fromCity, destination.toCity])

  if (loading || !data || data.reviews.length === 0) return null

  return (
    <section className={s.reviews} id="reviews">
      <div className="container">
        <div className={s.header}>
          <h2 className={clsx('title')}>Отзывы пассажиров</h2>
          <div className={s.stats}>
            <div className={s.rating}>
              <span className={s.ratingValue}>{data.averageRating}</span>
              <div className={s.stars}>
                {[1, 2, 3, 4, 5].map(i => (
                  <StarIcon key={i} filled={i <= Math.round(data.averageRating)} />
                ))}
              </div>
            </div>
            <span className={s.totalCount}>{data.total} {getReviewWord(data.total)}</span>
          </div>
        </div>

        <div className={s.grid}>
          {data.reviews.map((review) => (
            <div key={review.id} className={s.card}>
              <div className={s.cardHeader}>
                <div className={s.avatar}>
                  {review.username.charAt(0).toUpperCase()}
                </div>
                <div className={s.cardMeta}>
                  <span className={s.name}>{review.username}</span>
                  <span className={s.date}>{formatDate(review.review_date)}</span>
                </div>
                <div className={s.cardStars}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <StarIcon key={i} filled={i <= review.rate} />
                  ))}
                </div>
              </div>
              <p className={s.text}>{review.review_text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function getReviewWord(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 19) return 'отзывов'
  if (mod10 === 1) return 'отзыв'
  if (mod10 >= 2 && mod10 <= 4) return 'отзыва'
  return 'отзывов'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default RouteReviews
