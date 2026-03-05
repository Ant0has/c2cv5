import Link from 'next/link'
import s from './BusinessSegmentCards.module.scss'

interface SegmentCard {
  title: string
  description: string
  href: string
  emoji: string
}

interface Props {
  title: string
  cards: SegmentCard[]
}

const BusinessSegmentCards = ({ title, cards }: Props) => {
  return (
    <div className={s.wrapper}>
      <div className="container">
        <h2 className="title text-white text-center">
          {title}
        </h2>
        <div className={s.grid}>
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className={s.card}>
              <span className={s.emoji}>{card.emoji}</span>
              <h3 className={s.cardTitle}>{card.title}</h3>
              <p className={s.cardDescription}>{card.description}</p>
              <span className={s.cardArrow}>&rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BusinessSegmentCards
