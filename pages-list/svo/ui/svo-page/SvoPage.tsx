'use client'
import { IHub } from "@/shared/types/hub.interface";
import { requisitsData } from "@/shared/data/requisits.data";
import {
  SVO_TRUST_FACTS,
  SVO_DOCUMENTS,
  SVO_FAQ,
  SVO_SAFETY_FEATURES,
  KPP_BY_DESTINATION_SLUG,
  type KppInfo,
} from "@/pages-list/destination/config/svo-data";
import s from "@/pages-list/destination/ui/svo-blocks/SvoDestinationView.module.scss";
import styles from "./SvoPage.module.scss";
import SvoDestinationCard from "../SvoDestinationCard/SvoDestinationCard";
import SvoRoutesList from "../SvoRoutesList/SvoRoutesList";
import SvoStickyMobileCTA from "@/pages-list/destination/ui/svo-blocks/SvoStickyMobileCTA";
import clsx from "clsx";
import { useState, useMemo } from "react";

interface SvoPageProps {
  hub: IHub;
}

// Region grouping for destinations
const REGION_MAP: Record<string, { name: string; order: number }> = {
  donetsk: { name: 'ДНР', order: 1 },
  mariupol: { name: 'ДНР', order: 1 },
  gorlovka: { name: 'ДНР', order: 1 },
  snezhnoe: { name: 'ДНР', order: 1 },
  starobeshevo: { name: 'ДНР', order: 1 },
  lugansk: { name: 'ЛНР', order: 2 },
  stahanov: { name: 'ЛНР', order: 2 },
  rovenki: { name: 'ЛНР', order: 2 },
  starobilsk: { name: 'ЛНР', order: 2 },
  antracit: { name: 'ЛНР', order: 2 },
  severodonetsk: { name: 'ЛНР', order: 2 },
  alchevsk: { name: 'ЛНР', order: 2 },
  bryanka: { name: 'ЛНР', order: 2 },
  rubezhnoe: { name: 'ЛНР', order: 2 },
  melitopol: { name: 'Запорожская обл.', order: 3 },
  kamenka: { name: 'Запорожская обл.', order: 3 },
  tokmak: { name: 'Запорожская обл.', order: 3 },
  kahovka: { name: 'Херсонская обл.', order: 4 },
  izvarino: { name: 'КПП', order: 5 },
};

type RegionFilter = 'all' | 'ДНР' | 'ЛНР' | 'Запорожская обл.' | 'Херсонская обл.' | 'КПП';

const scrollTo = (id: string) => {
  if (typeof document === 'undefined') return;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const SvoPage = ({ hub }: SvoPageProps) => {
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');

  const { regionGroups, filteredDestinations } = useMemo(() => {
    const groups: Record<string, typeof hub.destinations> = {};
    hub.destinations?.forEach(dest => {
      const ri = REGION_MAP[dest.slug];
      const name = ri?.name || 'Другое';
      if (!groups[name]) groups[name] = [];
      groups[name].push(dest);
    });
    const filtered = activeRegion === 'all'
      ? hub.destinations
      : hub.destinations?.filter(d => REGION_MAP[d.slug]?.name === activeRegion);
    return { regionGroups: groups, filteredDestinations: filtered || [] };
  }, [hub.destinations, activeRegion]);

  const regions: RegionFilter[] = ['all', 'ДНР', 'ЛНР', 'Запорожская обл.', 'Херсонская обл.', 'КПП'];

  const trustPills = [
    `${SVO_TRUST_FACTS.yearsLong} лет в Донецке и Луганске, ${SVO_TRUST_FACTS.yearsShort} года по остальным регионам`,
    'Через 7 КПП',
    'Диспетчер 24/7',
    `${SVO_TRUST_FACTS.tripsCompleted}+ выполненных поездок`,
  ];

  // Уникальные КПП из маппинга
  const uniqueKpp: KppInfo[] = useMemo(() => {
    const map = new Map<string, KppInfo>();
    Object.values(KPP_BY_DESTINATION_SLUG).forEach(k => {
      if (!map.has(k.name)) map.set(k.name, k);
    });
    return Array.from(map.values());
  }, []);

  const faqData = hub.faq ? JSON.parse(hub.faq) : SVO_FAQ;

  return (
    <div className={s.svoPage}>
      {/* Hero с military-фоном */}
      <section className={s.hero}>
        <div className={s.heroBg} />
        <div className={s.heroOverlay} />
        <picture aria-hidden="true" className={s.heroSilhouettePic}>
          <source srcSet="/images/military/man.webp" type="image/webp" />
          <img
            src="/images/military/man.png"
            alt=""
            loading="eager"
            decoding="async"
            className={s.heroSilhouette}
          />
        </picture>
        <div className="container">
          <nav className={s.breadcrumbs}>
            <a href="/">Главная</a>
            <span className={s.sep}>/</span>
            <span>Зона СВО</span>
          </nav>

          <h1 className={s.h1}>
            Доставим в любую точку ДНР, ЛНР и Новороссии — {SVO_TRUST_FACTS.yearsLong} лет в Донецке и Луганске, {SVO_TRUST_FACTS.yearsShort} года по остальным регионам
          </h1>
          <p className={s.subtitle}>
            Возим семьи к военнослужащим, гуманитарные миссии, журналистов с аккредитацией. Через 7 КПП. Связь с диспетчером 24/7.
          </p>

          <div className={s.trustPills}>
            {trustPills.map((t, i) => (
              <span key={i} className={s.pill}>{t}</span>
            ))}
          </div>

          <div className={s.heroActions}>
            <a href={`tel:${requisitsData.PHONE}`} className={s.ctaUrgent}>
              <span className={s.urgentDot} />
              Выезд сегодня — звонок диспетчеру
            </a>
            <button onClick={() => scrollTo('destinations')} className={s.ctaSecondary}>Выбрать город</button>
          </div>
        </div>
      </section>

      {/* Region filter */}
      <section className={clsx(styles.filterSection, 'container')} id="regions">
        <h2 className={s.h2} style={{ marginTop: 32, marginBottom: 16 }}>Направления по регионам</h2>
        <div className={styles.regionTabs}>
          {regions.map(region => (
            <button
              key={region}
              className={clsx(styles.regionTab, { [styles.regionTabActive]: activeRegion === region })}
              onClick={() => setActiveRegion(region)}
            >
              {region === 'all' ? 'Все регионы' : region}
              {region !== 'all' && regionGroups[region] && (
                <span className={styles.regionCount}>{regionGroups[region].length}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Destinations grid */}
      <section className={clsx(styles.destinationSection, 'container')} id="destinations">
        <div className={styles.destinationGrid}>
          {filteredDestinations?.map(destination => (
            <SvoDestinationCard
              key={destination.id}
              destination={destination}
              hubSlug={hub.slug}
            />
          ))}
        </div>
      </section>

      <SvoRoutesList hubSlug={hub.slug} />

      {/* КПП на маршрутах */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>КПП на маршрутах в зону СВО</h2>
        <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6, marginBottom: 18, maxWidth: 760 }}>
          Маршрут выбирается под пункт назначения. Перед поездкой диспетчер уточняет актуальный режим работы КПП.
        </p>
        <div className={s.safetyGrid}>
          {uniqueKpp.map(kpp => (
            <div key={kpp.name} className={s.safetyCard}>
              <span className={s.safetyDot} />
              <span>
                <strong>{kpp.fullName}</strong> ({kpp.region}) · прохождение ~ {kpp.passageHours}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Документы */}
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
          Список актуален на момент публикации. Перед поездкой диспетчер уточнит требования по конкретному маршруту.
        </p>
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

      {/* Аудитория */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Кому подходят наши трансферы</h2>
        <div className={s.audienceGrid}>
          <div className={s.audienceCard}>
            <h3>Гражданским</h3>
            <p>Возвращающимся домой, навещающим родных, восстанавливающим жильё. Маршрут от двери до двери, поддержка диспетчера.</p>
          </div>
          <div className={s.audienceCard}>
            <h3>Гуманитарным работникам</h3>
            <p>Перевозка волонтёров и медработников. Помощь с грузами по таможенным правилам.</p>
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

      {/* Хроника поездок 2017-2026 */}
      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Хроника наших поездок 2017-2026</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          <div className={s.documentCard}>
            <h3>2017 — начало работы по ДНР и ЛНР</h3>
            <p>Мы начали возить пассажиров в Донецк и Луганск ещё до начала специальной военной операции. На тот момент это были непризнанные республики со сложной транспортной логистикой. Регулярные рейсы из Москвы, Ростова, Краснодара. За 5 лет до СВО — более 200 поездок, мы знали регион в спокойное время.</p>
          </div>
          <div className={s.documentCard}>
            <h3>2022 — начало СВО, рост спроса</h3>
            <p>В феврале 2022 года направление кардинально изменилось. Резко вырос спрос на трансферы — родственники военнослужащих, гуманитарные миссии, журналисты. Мы расширили парк машин и команду водителей. Открылись новые маршруты — Запорожская и Херсонская области после освобождения городов весной-летом 2022 года.</p>
          </div>
          <div className={s.documentCard}>
            <h3>2023 — стабилизация, переход на рубль</h3>
            <p>Год после присоединения новых регионов к РФ. Введение российского рубля как единственной валюты, переход на российские паспорта для жителей. Новые КПП и регламенты прохождения границы. Мы адаптировали процессы под российский документооборот, начали работать с юрлицами по безналу с НДС.</p>
          </div>
          <div className={s.documentCard}>
            <h3>2024 — масштабное восстановление</h3>
            <p>Активная фаза восстановительных работ в новых регионах. Программа «Народный фронт» — десятки сданных многоквартирных домов. Дон-Донецкий водовод (200 км) запущен для обеспечения Донецка питьевой водой. Выборы Президента РФ в новых регионах. Резко вырос трафик строительных бригад из других регионов России на восстановительные объекты.</p>
          </div>
          <div className={s.documentCard}>
            <h3>2025 — расширение сети водителей</h3>
            <p>Команда выросла. Расширили географию обратных маршрутов — теперь регулярно возим жителей ДНР/ЛНР в Москву, Ростов, Краснодар на медицинские обследования и учёбу. Запустили корпоративные подписки для строительных и промышленных компаний с регулярными командировками в новые регионы.</p>
          </div>
          <div className={s.documentCard}>
            <h3>2026 — 500+ поездок суммарно</h3>
            <p>За 8 лет работы — более 500 успешных поездок в новые регионы России. Знаем все 7 КПП и режимы их работы, водители работают с 2017 года и регулярно ездят по знакомым трассам. Текущий спрос — всё чаще ротации специалистов на промышленных и социальных объектах: восстановленный Алчевский комбинат, шахты в Антраците, Ровеньках, Стаханове.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`container ${s.section}`} id="faq">
        <h2 className={s.h2}>Частые вопросы</h2>
        <div className={s.faqList}>
          {faqData.map((item: { question: string; answer: string }, i: number) => (
            <details key={i} className={s.faqItem} open={i === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Help */}
      <section className={`container ${s.helpBlock}`}>
        <div className={s.helpContent}>
          <h3>Остались вопросы?</h3>
          <p>Звонок диспетчеру 24/7 — оперативно ответим на любой вопрос по маршруту, документам и КПП.</p>
          <a href={`tel:${requisitsData.PHONE}`} className={s.ctaPhoneBig}>{requisitsData.PHONE_MARKED}</a>
        </div>
      </section>

      <SvoStickyMobileCTA />
    </div>
  );
};

export default SvoPage;
