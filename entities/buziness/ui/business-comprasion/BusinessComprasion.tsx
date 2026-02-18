'use client';
import s from './BusinessComprasion.module.scss';
import BusinessComprasionCard from './BusinessComprasionCard';
interface Props {

    title: { text: string, isPrimary: boolean }[];
    description: string;
    organizations: { id: number, name: string, description: string, isCompetitor: boolean, features: { id: number, name: string, description: string, isBest: boolean }[] }[];
}

const BusinessComprasion = ({ title, description, organizations }: Props) => {
    const contentTitle = title.map(item => {
        if (item.isPrimary) {
            return <span key={item.text} className="text-primary">{` ${item.text} `}</span>
        }
        return `${item.text}`
    });

    return (
        <div className={s.wrapper}>
            <div className="container">
                <h2 className="title text-center text-white">{contentTitle}</h2>
                <p className="font-18-medium text-dark-secondary margin-t-16 text-center">{description}</p>

                <ul className={s.cardsList}>
                    {organizations.map((organization) => (
                        <BusinessComprasionCard key={organization.id} card={organization} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BusinessComprasion;