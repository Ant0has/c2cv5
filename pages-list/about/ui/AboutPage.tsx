import { FC } from 'react';
import clsx from 'clsx';
import s from './AboutPage.module.scss';

// Импортируйте необходимые иконки (примерные названия, уточните)
import YearsIcon from '@/public/icons/TimeIcon';
import DistanceIcon from '@/public/icons/RoadIcon';
import PriceIcon from '@/public/icons/CreditCardIcon';
import ClientsIcon from '@/public/icons/ApplicationIcon';
import CleanIcon from '@/public/icons/CleanIcon';
import ShieldIcon from '@/public/icons/ShieldIcon';
import TeamWork from '@/shared/components/TeamWork/TeamWork';
import Breadcrumbs from '@/shared/components/Breadcrumbs/Breadcrumbs';
import AroundClockIcon from '@/public/icons/AroundClockIcon';
import DriverIcon from '@/public/icons/DriverIcon';
import CleanAutoIcon from '@/public/icons/CleanAutoIcon';
import { requisitsData } from '@/shared/data/requisits.data';
import Requisits from '@/shared/components/requisits/Requisits';

interface IProps {
    title?: unknown;
}

const AboutPage: FC<IProps> = () => {
    return (
        <div className={clsx(s.container, 'container')}>
            <Breadcrumbs />
            <h1 className={clsx(s.mainTitle, 'title margin-b-32')}>О компании {requisitsData.BRAND_NAME}</h1>
            <div className={s.sections}>
                <section className={clsx(s.intro, 'content-block')}>
                    <p className="font-18-normal">
                        <span className="font-18-semibold">{requisitsData.BRAND_NAME}</span> — это профессиональный сервис заказа междугороднего такси по России. Мы обеспечиваем комфортные и безопасные поездки на большие расстояния, работая как с частными клиентами, так и с корпоративными заказчиками.
                    </p>
                    <p className="font-18-normal">
                        Наша география работы охватывает множество городов и регионов страны. Мы специализируемся на трансферах между городами, поездках в аэропорты и на вокзалы, а также на поддержке мероприятий.
                    </p>
                    <p className="font-18-normal">
                        Главный принцип нашей работы — это надежность. Мы ценим время и комфорт наших пассажиров, поэтому предлагаем фиксированные цены, профессиональных водителей и современный автопарк.
                    </p>
                </section>
                <section className={clsx(s.stats, 'content-block')}>
                    <h2 className="sub-title margin-b-32">Статистика компании</h2>
                    <div className={s.statsGrid}>
                        <div className={s.statItem}>
                            <YearsIcon />
                            <p className={s.statNumber}>8+ лет</p>
                            <p className={s.statLabel}>на рынке</p>
                        </div>
                        <div className={s.statItem}>
                            <DistanceIcon />
                            <p className={s.statNumber}>25 000+</p>
                            <p className={s.statLabel}>поездок выполнено</p>
                        </div>
                        <div className={s.statItem}>
                            <ClientsIcon />
                            <p className={s.statNumber}>15 000+</p>
                            <p className={s.statLabel}>клиентов довольны</p>
                        </div>
                        <div className={s.statItem}>
                            <DistanceIcon />
                            <p className={s.statNumber}>2M+ км</p>
                            <p className={s.statLabel}>пройдено</p>
                        </div>
                    </div>
                </section>

                {/* H2: Наша история */}
                <section className={clsx(s.history, 'content-block')}>
                    <h2 className="sub-title margin-b-32">Наша история</h2>
                    <div className="font-18-normal">
                        <p className="font-18-normal">Компания {requisitsData.BRAND_NAME} была основана в 2018 году с целью сделать междугородние поездки на такси простыми, предсказуемыми и комфортными. Начиная с нескольких автомобилей, мы быстро росли благодаря доверию клиентов и качеству сервиса.</p>
                        <p className="font-18-normal">Ключевыми вехами нашего развития стали: расширение автопарка в 2020 году, запуск корпоративного обслуживания в 2021 году и внедрение системы электронного документооборота в 2022 году.</p>
                        <p className="font-18-normal">Сегодня {requisitsData.BRAND_NAME} — это слаженная команда профессионалов, которая продолжает развиваться, внедрять новые технологии и улучшать сервис для наших пассажиров.</p>
                    </div>
                </section>

                {/* H2: Почему выбирают нас */}
                <section className={clsx(s.advantages, 'content-block')}>
                    <h2 className="sub-title margin-b-32">Почему выбирают нас</h2>
                    <div className={s.advantagesGrid}>
                        <div className={s.advantageCard}>
                            <AroundClockIcon />
                            <h3 className="font-24-medium">Фиксированные цены</h3>
                            <p className="font-16-normal">Стоимость поездки согласовывается при бронировании и не меняется.</p>
                        </div>
                        <div className={s.advantageCard}>
                            <DriverIcon />
                            <h3 className="font-24-medium">Профессиональные водители</h3>
                            <p className="font-16-normal">Все водители имеют опыт работы и проходят тщательный отбор.</p>
                        </div>
                        <div className={s.advantageCard}>
                            <CleanAutoIcon />
                            <h3 className="font-24-medium">Чистые автомобили</h3>
                            <p className="font-16-normal">Автомобили проходят регулярную мойку и химчистку салона.</p>
                        </div>
                        <div className={s.advantageCard}>
                            <AroundClockIcon />
                            <h3 className="font-24-medium">Круглосуточная поддержка</h3>
                            <p className="font-16-normal">Диспетчерская служба работает 24/7 для решения любых вопросов.</p>
                        </div>
                    </div>
                </section>

                {/* H2: Наши гарантии */}
                <section className={clsx(s.guarantees, 'content-block')}>
                    <h2 className="sub-title margin-b-32">Наши гарантии</h2>
                    <div className={s.guaranteesList}>
                        <div className={s.guaranteeItem}>
                            <PriceIcon />
                            <div>
                                <h3 className="font-24-medium">Гарантия фиксированной цены</h3>
                                <p className="font-16-normal">Цена при бронировании — финальная, никаких доплат.</p>
                            </div>
                        </div>
                        <div className={s.guaranteeItem}>
                            <   CleanIcon />
                            <div>
                                <h3 className="font-24-medium">Гарантия чистоты</h3>
                                <p className="font-16-normal">Чистый автомобиль снаружи и внутри.</p>
                            </div>
                        </div>
                        <div className={s.guaranteeItem}>
                            <ShieldIcon />
                            <div>
                                <h3 className="font-24-medium">Гарантия безопасности</h3>
                                <p className="font-16-normal">Водители проходят проверку.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content-block">
                    <h2 className="sub-title margin-b-32">Работа команды</h2>
                    <TeamWork />
                </section>
                <Requisits />
            </div>
        </div>
    );
};

export default AboutPage;