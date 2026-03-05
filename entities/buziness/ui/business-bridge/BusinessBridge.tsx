import Link from 'next/link';
import s from './BusinessBridge.module.scss';

const BusinessBridge = () => {
    return (
        <div className={s.wrapper}>
            <div className="container">
                <div className={s.card}>
                    <h2 className={s.title}>Этот маршрут для бизнеса?</h2>
                    <p className={s.description}>
                        Договор, фиксированная цена, закрывающие документы, оплата по счёту.
                    </p>
                    <div className={s.actions}>
                        <Link
                            href="/dlya-biznesa/korporativnoe-taksi-mezhgorod/#form"
                            className={s.button}
                        >
                            Расчёт для юрлиц →
                        </Link>
                        <Link
                            href="/dlya-biznesa/"
                            className={s.link}
                        >
                            Все услуги для бизнеса
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessBridge;
