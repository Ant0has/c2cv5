import CheckIcon from '@/public/icons/CheckIcon';
import s from './BusinessComprasion.module.scss';
import clsx from 'clsx';
import CheckCircleIcon from '@/public/icons/CheckCircleIcon';
import CancelCirlceIcon from '@/public/icons/CancelCirlceIcon';

interface Props {
    card: { id: number, name: string, description: string, isCompetitor: boolean, features: { id: number, name: string, description: string, isBest: boolean }[] }
}

const BusinessComprasionCard = ({ card }: Props) => {
    return (
        <li className={clsx(s.card, { [s.cardPrimary]: !card.isCompetitor })}>
            <h3 className="font-24-medium text-white text-left">«{card.name}»</h3>
            <p className={clsx('font-14-medium margin-t-16 text-left', { 'text-white': !card.isCompetitor, 'text-dark-secondary': card.isCompetitor })}>{card.description}</p>

            <ul className={s.featuresList}>
                {card.features.map((feature) => (
                    <li key={feature.id} className={s.featureItem}>
                        <p className={clsx('font-14-medium', { 'text-white opacity-50': !card.isCompetitor, 'text-dark-secondary': card.isCompetitor })}>{feature.name}</p>
                        <div className={clsx('flex items-center gap-8 justify-between')}>
                            <p className={clsx('font-18-medium', 'text-white')}>{feature.description}</p>
                            {
                                feature.isBest ? (
                                    <CheckCircleIcon circleFill={card.isCompetitor ? 'var(--primary)' : 'var(--white)'} rectFill={card.isCompetitor ? 'var(--white)' : 'var(--primary)'}  />
                                )
                                : (
                                    <CancelCirlceIcon />
                                )
                            }
                        </div>

                    </li>
                ))}
            </ul>
        </li>
    );
};

export default BusinessComprasionCard;