'use client'
import { useIsMobile } from '@/shared/hooks/useResize';
import { popularRoutesList } from '../../utils/data';
import styles from './DlyaBiznesaPopularRoutes.module.scss';
import DlyaBiznesaPopularRoutesCard from './DlyaBiznesaPopularRoutesCard';
import Image from 'next/image';
import { Button } from 'antd';
import { scrollToBlockById } from '@/shared/services/scroll-to-block';

const DlyaBiznesaPopularRoutes = () => {
    const isMobile = useIsMobile();
    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <Image className={styles.imageBg} src={'/images/dlya-biznesa/map-bg.png'} alt="Map Background" fill sizes="100vw" />
                <h2 className={'title text-white text-center relative z-2'}>
                    Популярные <span className="text-primary">маршруты</span>
                </h2>
                <p className={'margin-t-16 font-18-medium text-dark-secondary text-center relative z-2'}>
                    Фиксированные цены без скрытых доплат
                </p>

                <div className={'container relative z-2'}>
                    <div className={styles.routesGrid}>
                        {popularRoutesList.map((route) => (
                            <DlyaBiznesaPopularRoutesCard key={route.id} route={route} />
                        ))}
                    </div>
                </div>
                <div className={`flex justify-center ${isMobile ? 'padding-b-24' : 'margin-t-48'}`}>
                    <Button type="primary" className="h-56" onClick={() => scrollToBlockById('dlya-biznesa-calculator')}><span className="font-24-medium text-white">Рассчитать свой маршрут</span></Button>
                </div>
            </div>
            <div className={`${isMobile ? 'margin-t-24' : 'margin-t-32'} ${isMobile ? 'font-16-normal' : 'font-18-normal'} text-dark-secondary text-center`}>*В зависимости от выбранного класса автомобиля</div>
        </div>
    )
}

export default DlyaBiznesaPopularRoutes;