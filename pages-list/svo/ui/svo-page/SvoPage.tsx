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
    `${SVO_TRUST_FACTS.yearsInRegion} лет работы по ДНР/ЛНР`,
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
        <div className="container">
          <nav className={s.breadcrumbs}>
            <a href="/">Главная</a>
            <span className={s.sep}>/</span>
            <span>Зона СВО</span>
          </nav>

          <h1 className={s.h1}>
            Такси в зону СВО — ДНР, ЛНР, Запорожская и Херсонская области
          </h1>
          <p className={s.subtitle}>
            {SVO_TRUST_FACTS.yearsInRegion} лет работы по новым регионам · {SVO_TRUST_FACTS.tripsCompleted}+ выполненных поездок · водители с опытом до начала СВО
          </p>

          <div className={s.trustPills}>
            {trustPills.map((t, i) => (
              <span key={i} className={s.pill}>{t}</span>
            ))}
          </div>

          <div className={s.heroActions}>
            <button onClick={() => scrollTo('destinations')} className={s.ctaPrimary}>Выбрать город</button>
            <a href={`tel:${requisitsData.PHONE}`} className={s.ctaPhone}>{requisitsData.PHONE_MARKED}</a>
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
    </div>
  );
};

export default SvoPage;
