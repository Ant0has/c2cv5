import SeoText from "@/shared/components/SeoText/SeoText";
import { IHub } from "@/shared/types/hub.interface";
import cn from "classnames";
import HubHero from "../HubHero/HubHero";
import ResortWeatherGrid from "../ResortWeatherGrid/ResortWeatherGrid";
import styles from './GornolyzhkaPage.module.scss';
import DestinationCard from "../DestinationCard/DestinationCard";
import { hubBenefits } from "@/shared/data/hub.data";

interface GornolyghkaPageProps {
    hub: IHub;
}

const GornolyghkaPage = ({ hub }: GornolyghkaPageProps) => {

    const seoText = `
    <h2>Трансфер ${hub.name}</h2>
    <p>Служба «ВДругойГород» предлагает комфортные трансферы по направлению ${hub.name}.
    ${hub.description || ''}</p>
    ${hub.destinations && hub.destinations.length > 0 ? `
    <h3>Популярные маршруты</h3>
    <p>Мы выполняем трансферы по следующим направлениям: ${hub.destinations?.map((destination) => destination.name).join(', ')}.</p>
    ` : ''}
    <h3>Преимущества заказа у нас</h3>
    <ul>
      <li><strong>Фиксированные цены</strong> — стоимость известна заранее, без скрытых доплат</li>
      <li><strong>Комфортные автомобили</strong> — от эконом до бизнес-класса</li>
      <li><strong>Опытные водители</strong> — знают все особенности маршрутов</li>
      <li><strong>Работаем 24/7</strong> — заказ в любое время дня и ночи</li>
    </ul>
    <p>Для заказа трансфера звоните +7 (918) 587-54-54 или оставьте заявку на сайте.</p>
  `

    return (
        <div className={styles.hubPage}>
            <HubHero hub={hub} benefits={hubBenefits} />

            <section className={cn(styles.destinationSection, 'container')} id="destinations">
                <h2 className={cn(styles.destinationTitle, 'title')}>Популярные направления</h2>

                <div className={styles.destinationGrid}>
                    {hub.destinations?.map((destination) => (
                        <DestinationCard
                            key={destination.id}
                            destination={destination}
                            hubSlug={hub.slug}
                        />
                    ))}
                </div>
                <div className={styles.resortWeatherGrid}>
                    <ResortWeatherGrid destinations={hub.destinations} />
                </div>
            </section>
            {/* <OrderSteps /> */}
            <SeoText content={seoText} />
        </div>
    );
};

export default GornolyghkaPage;