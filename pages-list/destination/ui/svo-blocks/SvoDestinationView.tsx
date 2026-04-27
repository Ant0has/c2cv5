'use client'

import { IHubDestination } from '@/shared/types/hub.interface'
import Image from 'next/image'
import { requisitsData } from '@/shared/data/requisits.data'
import {
  KPP_BY_DESTINATION_SLUG,
  SVO_DOCUMENTS,
  SVO_SAFETY_FEATURES,
  SVO_FAQ,
  SVO_TRUST_FACTS,
  SVO_REGION_BY_DEST,
  buildRouteStages,
} from '@/pages-list/destination/config/svo-data'
import s from './SvoDestinationView.module.scss'

interface Props {
  destination: IHubDestination
  /** Слот для встроенного калькулятора стоимости (Price+TripCounter из родителя) */
  calculatorSlot?: React.ReactNode
  /** Слот для блоков ниже факсимиле (Description, RouteReviews, PaymentMethods из родителя) */
  belowSlot?: React.ReactNode
}

const scrollToCalc = () => {
  if (typeof document === 'undefined') return
  const el = document.getElementById('order')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export default function SvoDestinationView({ destination, calculatorSlot, belowSlot }: Props) {
  const slug = destination.slug
  const kpp = KPP_BY_DESTINATION_SLUG[slug]
  const region = SVO_REGION_BY_DEST[slug] || 'новые регионы'
  const distanceKm = Number(destination.distance) || 1100
  const routeStages = buildRouteStages(slug, destination.toCity || destination.name, distanceKm)

  const trustPills = [
    `${SVO_TRUST_FACTS.yearsInRegion} лет работы по ${region}`,
    kpp ? `Через ${kpp.fullName}` : `Через КПП в ${region}`,
    'Диспетчер 24/7',
    `${SVO_TRUST_FACTS.tripsCompleted}+ выполненных поездок`,
  ]

  return (
    <div className={s.svoPage}>
      {/* Hero c military-фоном */}
      <section className={s.hero}>
        <div className={s.heroBg} />
        <div className={s.heroOverlay} />
        <div className="container">
          <nav className={s.breadcrumbs}>
            <a href="/">Главная</a>
            <span className={s.sep}>/</span>
            <a href="/svo">Зона СВО</a>
            <span className={s.sep}>/</span>
            <span>{destination.name}</span>
          </nav>

          <h1 className={s.h1}>
            Трансфер в {destination.toCity || destination.name} — зона СВО ({region})
          </h1>
          <p className={s.subtitle}>
            {SVO_TRUST_FACTS.yearsInRegion} лет работы по ДНР/ЛНР · {SVO_TRUST_FACTS.tripsCompleted}+ выполненных поездок · водители с опытом региона до начала СВО
          </p>

          <div className={s.trustPills}>
            {trustPills.map((t, i) => (
              <span key={i} className={s.pill}>{t}</span>
            ))}
          </div>

          <div className={s.heroActions}>
            <button onClick={scrollToCalc} className={s.ctaPrimary}>Рассчитать стоимость</button>
            <a href={`tel:${requisitsData.PHONE}`} className={s.ctaPhone}>
              {requisitsData.PHONE_MARKED}
            </a>
          </div>
        </div>
      </section>

      {/* Калькулятор сразу под hero */}
      {calculatorSlot && (
        <section id="order" className={s.calcWrap}>
          {calculatorSlot}
          <p className={s.calcNote}>
            Окончательная цена согласуется с диспетчером с учётом маршрута через {kpp?.fullName || 'КПП'}.
          </p>
        </section>
      )}

      {/* Документы для въезда */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Какие документы нужны для въезда</h2>
        <div className={s.docsGrid}>
          {SVO_DOCUMENTS.map((doc, i) => (
            <div key={i} className={s.docCard}>
              <span className={s.docCheck}>✓</span>
              <span>{doc}</span>
            </div>
          ))}
        </div>
        <p className={s.note}>
          Список актуален на момент публикации. Перед поездкой диспетчер уточнит требования.
        </p>
      </section>

      {/* Маршрут через КПП */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>
          Этапы маршрута{kpp ? ` через ${kpp.fullName}` : ''}
        </h2>
        <div className={s.stages}>
          {routeStages.map((stage, i) => (
            <div key={i} className={s.stage}>
              <div className={s.stageNum}>{i + 1}</div>
              <div className={s.stageBody}>
                <div className={s.stageHead}>
                  <span className={s.stageName}>{stage.name}</span>
                  <span className={s.stageMeta}>
                    ~{stage.hours} ч{stage.distanceKm ? ` · ${stage.distanceKm} км` : ''}
                  </span>
                </div>
                <p className={s.stageDetails}>{stage.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Безопасность и связь */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Безопасность и связь во время поездки</h2>
        <div className={s.safetyGrid}>
          {SVO_SAFETY_FEATURES.map((f, i) => (
            <div key={i} className={s.safetyCard}>
              <span className={s.safetyDot} />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Целевая аудитория */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Кому подходит этот трансфер</h2>
        <div className={s.audienceGrid}>
          <div className={s.audienceCard}>
            <h3>Гражданским</h3>
            <p>Возвращающимся домой, навещающим родных, восстанавливающим жильё. Маршрут от двери до двери, разъяснение порядка КПП, поддержка диспетчера на каждом этапе.</p>
          </div>
          <div className={s.audienceCard}>
            <h3>Гуманитарным работникам</h3>
            <p>Перевозка волонтёров и медработников. Помощь с грузами в пределах разрешённого по таможенным правилам. Сопровождение оформления на КПП.</p>
          </div>
          <div className={s.audienceCard}>
            <h3>Журналистам</h3>
            <p>Доставка корреспондентов с аккредитацией. Опытные водители, знающие специфику работы со СМИ в зоне.</p>
          </div>
          <div className={s.audienceCard}>
            <h3>Родственникам военнослужащих</h3>
            <p>Поездки к находящимся в зоне родственникам. Понимаем специфику ситуации, помогаем с документами для прохождения КПП.</p>
          </div>
        </div>
      </section>

      {/* Текстовый блок description (если есть из БД) + остальные блоки родителя */}
      {belowSlot}

      {/* СВО-FAQ */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Частые вопросы</h2>
        <div className={s.faqList}>
          {SVO_FAQ.map((q, i) => (
            <details key={i} className={s.faqItem} open={i === 0}>
              <summary>{q.question}</summary>
              <p>{q.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Контакт диспетчера внизу */}
      <section className={`container ${s.helpBlock}`}>
        <Image
          src="/images/military/welcome-image.png"
          alt=""
          width={120}
          height={120}
          className={s.helpImg}
        />
        <div className={s.helpContent}>
          <h3>Остались вопросы?</h3>
          <p>Звонок диспетчеру 24/7 — оперативно ответим на любой вопрос по маршруту, документам и КПП.</p>
          <a href={`tel:${requisitsData.PHONE}`} className={s.ctaPhoneBig}>
            {requisitsData.PHONE_MARKED}
          </a>
        </div>
      </section>
    </div>
  )
}
