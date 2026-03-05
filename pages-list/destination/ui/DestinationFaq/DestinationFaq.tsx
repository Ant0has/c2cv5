'use client'

import { IHubDestination } from "@/shared/types/hub.interface"
import FaqItem from "@/shared/components/FaqItem/FaqItem"
import s from './DestinationFaq.module.scss'
import clsx from "clsx"

interface FaqEntry {
  question: string
  answer: string
}

interface Props {
  destination: IHubDestination
}

const DestinationFaq = ({ destination }: Props) => {
  let faqItems: FaqEntry[] = []

  try {
    const parsed = JSON.parse(destination.faq)
    if (Array.isArray(parsed)) {
      faqItems = parsed.filter((item: FaqEntry) => item.question && item.answer)
    }
  } catch {
    return null
  }

  if (!faqItems.length) return null

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      }
    }))
  }

  return (
    <section className={s.wrapper} id="faq">
      <div className={clsx("container", s.container)}>
        <h2 className={clsx('title', 'margin-b-32')}>Частые вопросы</h2>
        <div className={s.list}>
          {faqItems.map((item, index) => (
            <FaqItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  )
}

export default DestinationFaq
