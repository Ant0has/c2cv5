'use client'

import { IRouteData } from '@/shared/types/route.interface'
import { requisitsData } from '@/shared/data/requisits.data'
import {
  KPP_BY_DESTINATION_SLUG,
  SVO_DOCUMENTS,
  SVO_SAFETY_FEATURES,
  SVO_FAQ,
  SVO_TRUST_FACTS,
  SVO_REGION_BY_DEST,
  buildRouteStages,
  extractSvoCityFromRouteUrl,
} from '@/pages-list/destination/config/svo-data'
import s from './SvoDestinationView.module.scss'

interface Props {
  route: IRouteData
}

/**
 * SVO-блоки для маршрутных страниц `/svo-taxi-{from}-{to}.html`.
 * Hero уже отрисован military-Welcome компонентом главной — здесь добавляем
 * trust-pills, документы, маршрут через КПП, аудиторию, СВО-FAQ.
 */
export default function SvoRouteBlocks({ route }: Props) {
  const slug = extractSvoCityFromRouteUrl(route.url || '')
  if (!slug) return null

  const kpp = KPP_BY_DESTINATION_SLUG[slug]
  const region = SVO_REGION_BY_DEST[slug] || 'новые регионы'
  const distanceKm = Number(route.distance_km) || 1100
  const cityName = (slug || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const stages = buildRouteStages(slug, cityName, distanceKm)

  const trustPills = [
    `${SVO_TRUST_FACTS.yearsInRegion} лет работы по ${region}`,
    kpp ? `Через ${kpp.fullName}` : `Через КПП в ${region}`,
    'Диспетчер 24/7',
    `${SVO_TRUST_FACTS.tripsCompleted}+ выполненных поездок`,
  ]

  return (
    <div className={s.svoPage}>
      {/* Trust-pills отдельной полосой */}
      <section className={`container ${s.section}`}>
        <div className={s.trustPills} style={{ justifyContent: 'center' }}>
          {trustPills.map((t, i) => (
            <span key={i} className={s.pill} style={{
              background: '#f5f8ff',
              border: '1px solid #d6e0f0',
              color: '#2d3a4f',
              backdropFilter: 'none',
            }}>{t}</span>
          ))}
        </div>
      </section>

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
          {stages.map((stage, i) => (
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

      {/* Кому подходит */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Кому подходит этот трансфер</h2>
        <div className={s.audienceGrid}>
          <div className={s.audienceCard}>
            <h3>Гражданским</h3>
            <p>Возвращающимся домой, навещающим родных, восстанавливающим жильё. Маршрут от двери до двери, разъяснение порядка КПП, поддержка диспетчера.</p>
          </div>
          <div className={s.audienceCard}>
            <h3>Гуманитарным работникам</h3>
            <p>Перевозка волонтёров и медработников. Помощь с грузами в пределах разрешённого по таможенным правилам.</p>
          </div>
          <div className={s.audienceCard}>
            <h3>Журналистам</h3>
            <p>Доставка корреспондентов с аккредитацией. Опытные водители, знающие специфику работы со СМИ в зоне.</p>
          </div>
          <div className={s.audienceCard}>
            <h3>Родственникам военнослужащих</h3>
            <p>Поездки к находящимся в зоне родственникам. Помогаем с документами для прохождения КПП.</p>
          </div>
        </div>
      </section>

      {/* СВО-FAQ */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Частые вопросы по поездкам в зону СВО</h2>
        <div className={s.faqList}>
          {SVO_FAQ.map((q, i) => (
            <details key={i} className={s.faqItem} open={i === 0}>
              <summary>{q.question}</summary>
              <p>{q.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Help */}
      <section className={`container ${s.helpBlock}`}>
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
