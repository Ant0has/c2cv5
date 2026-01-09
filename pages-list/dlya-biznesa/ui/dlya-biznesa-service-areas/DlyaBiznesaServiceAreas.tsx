'use client'
import s from './DlyaBiznesaServiceAreas.module.scss';
import { serviceAreasList } from '../../utils/data';
const DlyaBiznesaServiceAreas = () => {
    return (
        <div className={s.wrapper}>
            <div className="container">
                <h2 className="title text-center text-white">Сферы <span className="text-primary">применения</span></h2>
                <p className="font-18-medium text-dark-secondary margin-t-16 text-center">Корпоративные перевозки для любых задач вашего бизнеса</p>

                <ul className={s.serviceAreasList}>
                    {serviceAreasList.map((item) => (
                        <div className={s.gradientBorder}>
                        <li key={item.id} className={s.serviceAreaItem}>
                            <div className={s.serviceAreaIcon}>
                                {item.icon}
                            </div>
                            <h3 className="font-24-medium text-white text-left">{item.title}</h3>
                            <p className="margin-t-16 font-16-normal text-dark-secondary text-left">{item.description}</p>
                        </li>
                        </div>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default DlyaBiznesaServiceAreas;