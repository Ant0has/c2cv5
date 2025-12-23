import { requisitsData } from "@/shared/data/requisits.data";
import clsx from "clsx";
import s from './Requisits.module.scss';

const Requisits = () => {
    return (
        <section className={clsx(s.requisites, 'content-block')}>
            <h2 className="sub-title sub-title-m-32">Реквизиты</h2>
            <div className={s.requisitesGrid}>
                <div className={s.left}>
                    <p className="font-18-normal"><strong>{requisitsData.NAME}</strong></p>
                    <p className="font-16-normal">ИНН: {requisitsData.INN}</p>
                    <p className="font-16-normal">ОГРНИП: {requisitsData.OGRNIP}</p>
                </div>
                <div className={s.right}>
                    <div className={s.contact}>
                        <a href={`tel:${requisitsData.PHONE}`} className='font-24-medium'>{requisitsData.PHONE_MARKED}</a>
                    </div>
                    <div className={s.contact}>
                        <a href={`mailto:${requisitsData.EMAIL}`} className='font-24-medium'>{requisitsData.EMAIL}</a>
                    </div>
                </div>
            </div>
            <p className={clsx(s.note, 'font-14-normal', 'gray-color', 'italic')}>
                Юридический адрес для вашего региона указан на соответствующей региональной странице сайта.
            </p>
        </section>  
    )
}

export default Requisits    