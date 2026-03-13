'use client'
import SeoText from "@/shared/components/SeoText/SeoText";
import { IHub } from "@/shared/types/hub.interface";
import HubHero from "@/pages-list/gornolyzhka/ui/HubHero/HubHero";
import styles from './SvoPage.module.scss';
import SvoDestinationCard from "../SvoDestinationCard/SvoDestinationCard";
import SvoRoutesList from "../SvoRoutesList/SvoRoutesList";
import clsx from "clsx";
import { useIsMobile } from "@/shared/hooks/useResize";
import { useState, useMemo } from "react";

interface SvoPageProps {
    hub: IHub;
}

const svoBenefits = [
    {
        icon: '/icons/shield_ico.png',
        title: '443',
        description: 'маршрута',
    },
    {
        icon: '/icons/shield_ico.png',
        title: '24/7',
        description: 'трансферы',
    },
    {
        icon: '/icons/shield_ico.png',
        title: '100%',
        description: 'гарантия цены',
    }
];

// Region grouping for destinations (slugs match DB exactly)
const REGION_MAP: Record<string, { name: string; order: number }> = {
    'donetsk': { name: 'ДНР', order: 1 },
    'mariupol': { name: 'ДНР', order: 1 },
    'gorlovka': { name: 'ДНР', order: 1 },
    'snezhnoe': { name: 'ДНР', order: 1 },
    'starobeshevo': { name: 'ДНР', order: 1 },
    'lugansk': { name: 'ЛНР', order: 2 },
    'stahanov': { name: 'ЛНР', order: 2 },
    'rovenki': { name: 'ЛНР', order: 2 },
    'starobilsk': { name: 'ЛНР', order: 2 },
    'antracit': { name: 'ЛНР', order: 2 },
    'severodonetsk': { name: 'ЛНР', order: 2 },
    'alchevsk': { name: 'ЛНР', order: 2 },
    'bryanka': { name: 'ЛНР', order: 2 },
    'rubezhnoe': { name: 'ЛНР', order: 2 },
    'melitopol': { name: 'Запорожская область', order: 3 },
    'kamenka': { name: 'Запорожская область', order: 3 },
    'tokmak': { name: 'Запорожская область', order: 3 },
    'kahovka': { name: 'Херсонская область', order: 4 },
    'izvarino': { name: 'КПП', order: 5 },
};

type RegionFilter = 'all' | 'ДНР' | 'ЛНР' | 'Запорожская область' | 'Херсонская область' | 'КПП';

const SvoPage = ({ hub }: SvoPageProps) => {
    const isMobile = useIsMobile();
    const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');

    const { regionGroups, filteredDestinations } = useMemo(() => {
        const groups: Record<string, typeof hub.destinations> = {};

        hub.destinations?.forEach(dest => {
            const regionInfo = REGION_MAP[dest.slug];
            const regionName = regionInfo?.name || 'Другое';
            if (!groups[regionName]) groups[regionName] = [];
            groups[regionName].push(dest);
        });

        const filtered = activeRegion === 'all'
            ? hub.destinations
            : hub.destinations?.filter(d => {
                const ri = REGION_MAP[d.slug];
                return ri?.name === activeRegion;
            });

        return { regionGroups: groups, filteredDestinations: filtered || [] };
    }, [hub.destinations, activeRegion]);

    const regions: RegionFilter[] = ['all', 'ДНР', 'ЛНР', 'Запорожская область', 'Херсонская область', 'КПП'];

    const seoText = `
    <h2>Трансфер на новые территории</h2>
    <p>Служба City2City предлагает надёжные трансферы из городов России на новые территории —
    в Донецкую и Луганскую народные республики, Запорожскую и Херсонскую области.
    ${hub.description || ''}</p>
    ${hub.destinations && hub.destinations.length > 0 ? `
    <h3>Направления</h3>
    <p>Мы выполняем трансферы по следующим направлениям: ${hub.destinations?.map((d) => d.name).join(', ')}.</p>
    ` : ''}
    <h3>Преимущества заказа у нас</h3>
    <ul>
      <li><strong>Безопасность</strong> — опытные водители, знающие все КПП и безопасные маршруты</li>
      <li><strong>Фиксированные цены</strong> — стоимость известна заранее, без скрытых доплат</li>
      <li><strong>443 маршрута</strong> — покрываем все крупные города новых территорий</li>
      <li><strong>Трансферы 24/7</strong> — выезд в любое время, приём заявок с 8:00 до 22:00</li>
      <li><strong>Помощь с документами</strong> — подскажем, что нужно для проезда через КПП</li>
    </ul>
    <h3>Как заказать</h3>
    <p>Для заказа трансфера на новые территории звоните +7 (938) 156-87-57 или оставьте заявку на сайте.
    Приём заявок — ежедневно с 8:00 до 22:00. Выезд автомобиля — в любое время суток.</p>
  `;

    const faqData = hub.faq ? JSON.parse(hub.faq) : [];

    return (
        <div className={styles.svoPage}>
            <HubHero hub={hub} benefits={svoBenefits} />

            {/* Region filter */}
            <section className={clsx(styles.filterSection, 'container', { 'padding-y-40': !isMobile })} id="regions">
                <h2 className={clsx('title', 'margin-b-24')}>Направления по регионам</h2>

                <div className={styles.regionTabs}>
                    {regions.map((region) => (
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
                    {filteredDestinations?.map((destination) => (
                        <SvoDestinationCard
                            key={destination.id}
                            destination={destination}
                            hubSlug={hub.slug}
                        />
                    ))}
                </div>
            </section>

            {/* Routes list for small cities not in destinations */}
            <SvoRoutesList hubSlug={hub.slug} />

            {/* FAQ Section */}
            {faqData.length > 0 && (
                <section className={clsx(styles.faqSection, 'container', { 'padding-y-40': !isMobile })} id="faq">
                    <h2 className={clsx('title', 'margin-b-32')}>Частые вопросы</h2>
                    <div className={styles.faqList}>
                        {faqData.map((item: { question: string; answer: string }, index: number) => (
                            <details key={index} className={styles.faqItem}>
                                <summary className={styles.faqQuestion}>{item.question}</summary>
                                <p className={styles.faqAnswer}>{item.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>
            )}

            <SeoText content={seoText} />
        </div>
    );
};

export default SvoPage;
