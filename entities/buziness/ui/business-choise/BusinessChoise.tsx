import { choiseList } from '../../../../pages-list/dlya-biznesa/utils/data';
import s from './BusinessChoise.module.scss';
import Image from 'next/image';

interface Props {
    list: { id: number, title: string, icon: React.ReactNode, description: string }[];
}

const BusinessChoise = ({ list }: Props) => {
    return (
        <div className={s.wrapper}>
            <Image className={s.imageBg} src={'/images/dlya-biznesa/map-bg.png'} alt="Map Background" fill sizes="100vw" />
            <div className="container relative z-2">
                <h2 className="title text-center text-white ">Почему <span className="text-primary">выбирают нас</span></h2>
                <p className="font-18-medium text-dark-secondary margin-t-16 text-center">Мы работаем с 2018 года и помогаем нашим клиентам перевозиться по всей России</p>

                <div className={s.choiseList}>
                    {list.map((item) => (
                        <div key={item.id} className={s.choiseItem}>
                            <div className={s.choiseItemTop}>
                                <h3 className={s.choiseItemTitle}>{item.title}</h3>
                                <div className={s.choiseItemIcon}>{item.icon}</div>
                            </div>
                            <p className={s.choiseItemDescription}>{item.description}</p>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BusinessChoise;