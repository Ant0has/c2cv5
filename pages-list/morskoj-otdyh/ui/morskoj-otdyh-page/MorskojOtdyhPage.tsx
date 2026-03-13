'use client'
import SeoText from "@/shared/components/SeoText/SeoText";
import { IHub } from "@/shared/types/hub.interface";
import HubHero from "@/pages-list/gornolyzhka/ui/HubHero/HubHero";
import styles from './MorskojOtdyhPage.module.scss';
import SeaDestinationCard from "../SeaDestinationCard/SeaDestinationCard";
import clsx from "clsx";
import { useIsMobile } from "@/shared/hooks/useResize";
import { useState, useMemo } from "react";

interface MorskojOtdyhPageProps {
    hub: IHub;
}

const seaBenefits = [
    {
        icon: '/icons/beach_ico.png',
        title: '69',
        description: 'направлений к морю',
    },
    {
        icon: '/icons/wave_ico.png',
        title: '24/7',
        description: 'поддержка',
    },
    {
        icon: '/icons/sun_ico.png',
        title: '100%',
        description: 'гарантия цены',
    }
];

// Sea grouping for destinations
const SEA_MAP: Record<string, { name: string; order: number }> = {
    // Чёрное море — original
    'moskva-sochi-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-sochi-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-anapa-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-gelendzhik-sea': { name: 'Чёрное море', order: 1 },
    'moskva-anapa-sea': { name: 'Чёрное море', order: 1 },
    'rostov-sochi-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-tuapse-sea': { name: 'Чёрное море', order: 1 },
    // Чёрное море — expansion
    'krasnodar-novorossijsk-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-olginka-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-arhipo-osipovka-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-adler-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-dzhubga-sea': { name: 'Чёрное море', order: 1 },
    'moskva-gelendzhik-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-kabardinka-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-vityazevo-sea': { name: 'Чёрное море', order: 1 },
    'stavropol-anapa-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-abrau-dyurso-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-novomihajlovskij-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-divnomorskoe-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-sukko-sea': { name: 'Чёрное море', order: 1 },
    'moskva-adler-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-lermontovo-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-lazarevskoe-sea': { name: 'Чёрное море', order: 1 },
    'moskva-blagoveshchenskaya-sea': { name: 'Чёрное море', order: 1 },
    'moskva-novorossijsk-sea': { name: 'Чёрное море', order: 1 },
    'stavropol-sochi-sea': { name: 'Чёрное море', order: 1 },
    'rostov-anapa-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-blagoveshchenskaya-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-nebug-sea': { name: 'Чёрное море', order: 1 },
    'stavropol-gelendzhik-sea': { name: 'Чёрное море', order: 1 },
    'rostov-gelendzhik-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-dzhemete-sea': { name: 'Чёрное море', order: 1 },
    'moskva-divnomorskoe-sea': { name: 'Чёрное море', order: 1 },
    'rostov-novorossijsk-sea': { name: 'Чёрное море', order: 1 },
    'stavropol-novorossijsk-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-betta-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-shepsi-sea': { name: 'Чёрное море', order: 1 },
    'rostov-adler-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-dederkoj-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-vardane-sea': { name: 'Чёрное море', order: 1 },
    'moskva-agoj-sea': { name: 'Чёрное море', order: 1 },
    'moskva-arhipo-osipovka-sea': { name: 'Чёрное море', order: 1 },
    'moskva-kabardinka-sea': { name: 'Чёрное море', order: 1 },
    'moskva-tuapse-sea': { name: 'Чёрное море', order: 1 },
    'rostov-arhipo-osipovka-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-krinitsa-sea': { name: 'Чёрное море', order: 1 },
    'krasnodar-praskoveevka-sea': { name: 'Чёрное море', order: 1 },
    'moskva-dzhubga-sea': { name: 'Чёрное море', order: 1 },
    'moskva-hosta-sea': { name: 'Чёрное море', order: 1 },
    'moskva-sukko-sea': { name: 'Чёрное море', order: 1 },
    'moskva-vityazevo-sea': { name: 'Чёрное море', order: 1 },
    'rostov-kabardinka-sea': { name: 'Чёрное море', order: 1 },
    'rostov-vityazevo-sea': { name: 'Чёрное море', order: 1 },
    'stavropol-adler-sea': { name: 'Чёрное море', order: 1 },
    'stavropol-lazarevskoe-sea': { name: 'Чёрное море', order: 1 },
    'stavropol-vityazevo-sea': { name: 'Чёрное море', order: 1 },
    // Крым
    'krasnodar-krym-sea': { name: 'Крым', order: 2 },
    // Каспийское море
    'moskva-derbent-sea': { name: 'Каспийское море', order: 3 },
    'moskva-mahachkala-sea': { name: 'Каспийское море', order: 3 },
    // Азовское море — original
    'rostov-ejsk-sea': { name: 'Азовское море', order: 4 },
    'krasnodar-taman-sea': { name: 'Азовское море', order: 4 },
    'krasnodar-dolzhanskaya-sea': { name: 'Азовское море', order: 4 },
    // Азовское море — expansion
    'krasnodar-golubitskaya-sea': { name: 'Азовское море', order: 4 },
    'krasnodar-kuchugury-sea': { name: 'Азовское море', order: 4 },
    'krasnodar-peresyp-sea': { name: 'Азовское море', order: 4 },
    'krasnodar-za-rodinu-sea': { name: 'Азовское море', order: 4 },
    'rostov-golubitskaya-sea': { name: 'Азовское море', order: 4 },
    'moskva-golubitskaya-sea': { name: 'Азовское море', order: 4 },
    'stavropol-peresyp-sea': { name: 'Азовское море', order: 4 },
};

type SeaFilter = 'all' | 'Чёрное море' | 'Крым' | 'Каспийское море' | 'Азовское море';

const MorskojOtdyhPage = ({ hub }: MorskojOtdyhPageProps) => {
    const isMobile = useIsMobile();
    const [activeSea, setActiveSea] = useState<SeaFilter>('all');

    const { seaGroups, filteredDestinations } = useMemo(() => {
        const groups: Record<string, typeof hub.destinations> = {};

        hub.destinations?.forEach(dest => {
            const seaInfo = SEA_MAP[dest.slug];
            const seaName = seaInfo?.name || 'Другое';
            if (!groups[seaName]) groups[seaName] = [];
            groups[seaName].push(dest);
        });

        const filtered = activeSea === 'all'
            ? hub.destinations
            : hub.destinations?.filter(d => {
                const si = SEA_MAP[d.slug];
                return si?.name === activeSea;
            });

        return { seaGroups: groups, filteredDestinations: filtered || [] };
    }, [hub.destinations, activeSea]);

    const seas: SeaFilter[] = ['all', 'Чёрное море', 'Крым', 'Каспийское море', 'Азовское море'];

    const seoText = `
    <h2>Трансфер к морю</h2>
    <p>Служба City2City предлагает комфортные трансферы к морским курортам России —
    на Чёрное море, в Крым, на Каспийское и Азовское побережья.
    ${hub.description || ''}</p>
    ${hub.destinations && hub.destinations.length > 0 ? `
    <h3>Популярные направления</h3>
    <p>Мы выполняем трансферы по следующим направлениям: ${hub.destinations?.map((d) => d.name).join(', ')}.</p>
    ` : ''}
    <h3>Преимущества заказа у нас</h3>
    <ul>
      <li><strong>Фиксированные цены</strong> — стоимость известна заранее, без скрытых доплат</li>
      <li><strong>Комфортные автомобили</strong> — от эконом до бизнес-класса с кондиционером</li>
      <li><strong>69 направлений</strong> — покрываем все популярные морские курорты</li>
      <li><strong>Работаем 24/7</strong> — заказ в любое время дня и ночи</li>
      <li><strong>Багаж бесплатно</strong> — помощь с вещами и пляжным оборудованием</li>
    </ul>
    <h3>Как заказать</h3>
    <p>Для заказа трансфера к морю звоните +7 (938) 156-87-57 или оставьте заявку на сайте.
    Оператор рассчитает стоимость и подберёт удобное время выезда.</p>
  `;

    const faqData = hub.faq ? JSON.parse(hub.faq) : [];

    return (
        <div className={styles.seaPage}>
            <HubHero hub={hub} benefits={seaBenefits} />

            {/* Sea filter */}
            <section className={clsx(styles.filterSection, 'container', { 'padding-y-40': !isMobile })} id="seas">
                <h2 className={clsx('title', 'margin-b-24')}>Направления по морям</h2>

                <div className={styles.seaTabs}>
                    {seas.map((sea) => (
                        <button
                            key={sea}
                            className={clsx(styles.seaTab, { [styles.seaTabActive]: activeSea === sea })}
                            onClick={() => setActiveSea(sea)}
                        >
                            {sea === 'all' ? 'Все направления' : sea}
                            {sea !== 'all' && seaGroups[sea] && (
                                <span className={styles.seaCount}>{seaGroups[sea].length}</span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Destinations grid */}
            <section className={clsx(styles.destinationSection, 'container')} id="destinations">
                <div className={styles.destinationGrid}>
                    {filteredDestinations?.map((destination) => (
                        <SeaDestinationCard
                            key={destination.id}
                            destination={destination}
                            hubSlug={hub.slug}
                        />
                    ))}
                </div>
            </section>

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

export default MorskojOtdyhPage;
