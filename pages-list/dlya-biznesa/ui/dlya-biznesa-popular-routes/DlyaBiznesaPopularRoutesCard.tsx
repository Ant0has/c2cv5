import Image from 'next/image';
import ArrowDownIcon from '@/public/icons/ArrowDownIcon';
import { popularRoutesList } from '../../utils/data';
import styles from './DlyaBiznesaPopularRoutes.module.scss';

interface Props {
    route: typeof popularRoutesList[number]
}

const DlyaBiznesaPopularRoutesCard = ({ route }: Props) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <div className={styles.cardContentLeft}>
                    <div className={styles.cardContentLeftTop}>
                        <span className={'font-18-medium text-white'}>{route.from}</span>
                        <div className={styles.arrow}>
                            <ArrowDownIcon width={7} height={8} fill='var(--white)' />
                        </div>
                        <span className={'font-18-medium text-white'}>{route.to}</span>
                    </div>
                    <div className={styles.divider} />
                    <div className={'text-center font-24-medium text-primary'}>{`от ${route.price} руб.*`}</div>
                </div>
                <div className={styles.cardContentRight}>
                    <Image src={'/images/dlya-biznesa/popular-routes-bg.png'} alt="Route Card Background" fill sizes="100vw" />
                    <div className={'font-18-medium text-primary relative z-2'}>{`№${route.id}`}</div>
                    <ul className={styles.cardContentRightList}>
                        <li className={styles.cardContentRightListItem}>
                            <span className={'font-18-medium text-white'}>{route.distance}</span>
                        </li>
                        <li className={styles.cardContentRightListItem}>
                            <span className={'font-18-medium text-white'}>{`~${route.duration} в пути`}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DlyaBiznesaPopularRoutesCard;