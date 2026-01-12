import FaqItem from '@/shared/components/FaqItem/FaqItem';
import { faqItems } from '../../utils/data';
import s from './DlyaBiznesaFaq.module.scss';

const DlyaBiznesaFaq = () => {
    return (
        <div className={s.wrapper}>
            <div className="container">
                <h2 className="title text-white text-center">Частые <span className="text-primary">вопросы</span></h2>

                <div className={s.list}>
                    {faqItems.map((item) => (
                        <FaqItem isDarkMode={true} key={item.id} question={item.question} answer={item.answer} className={s.faqItem} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DlyaBiznesaFaq;