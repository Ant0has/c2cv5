import Link from 'next/link';
import s from './BusinessCrossLinks.module.scss';

interface CrossLinkItem {
    title: string;
    description: string;
    href: string;
}

interface Props {
    currentSlug: string;
}

const allServices: CrossLinkItem[] = [
    {
        title: 'Корпоративное такси',
        description: 'Междугородние поездки для сотрудников с контролем бюджета',
        href: '/dlya-biznesa/korporativnoe-taksi-mezhgorod',
    },
    {
        title: 'Трансфер для мероприятий',
        description: 'Логистика конференций, форумов и корпоративов',
        href: '/dlya-biznesa/transfer-dlya-meropriyatiy',
    },
    {
        title: 'Перевозка вахтовых рабочих',
        description: 'Доставка бригад на объекты по всей России',
        href: '/dlya-biznesa/perevozka-vakhtovyh-rabochih',
    },
    {
        title: 'Медицинский трансфер',
        description: 'Перевозка пациентов, медперсонала и биоматериалов',
        href: '/dlya-biznesa/medicinskij-transfer',
    },
    {
        title: 'Доставка грузов',
        description: 'Срочная доставка от двери до двери в тот же день',
        href: '/dlya-biznesa/dostavka-gruzov',
    },
];

const BusinessCrossLinks = ({ currentSlug }: Props) => {
    const links = allServices.filter(item => !item.href.endsWith(`/${currentSlug}`));

    return (
        <div className={s.wrapper}>
            <div className="container">
                <h2 className="title text-white text-center">
                    Другие <span className="text-primary">услуги</span> для бизнеса
                </h2>
                <div className={s.grid}>
                    {links.map((item) => (
                        <Link key={item.href} href={item.href} className={s.card}>
                            <h3 className={s.cardTitle}>{item.title}</h3>
                            <p className={s.cardDescription}>{item.description}</p>
                            <span className={s.cardArrow}>&rarr;</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BusinessCrossLinks;
