'use client'
import s from './BusinessServiceAreas.module.scss';

interface Props {
    title: { text: string, isPrimary: boolean }[];
    list: { id: number, title: string, icon: React.ReactNode, description: string }[];
}

const BusinessServiceAreas = ({ title, list }: Props) => {
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
                <p className="font-18-medium text-dark-secondary margin-t-16 text-center">Корпоративные перевозки для любых задач вашего бизнеса</p>

                <ul className={s.serviceAreasList}>
                    {list.map((item) => (
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

export default BusinessServiceAreas;