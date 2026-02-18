import FaqItem from '@/shared/components/FaqItem/FaqItem';
import s from './BusinessFaq.module.scss';

interface Props {
    list: { id: number, question: string, answer: string }[];
}

const BusinessFaq = ({ list }: Props) => {
    return (
        <div className={s.wrapper}>
            <div className="container">
                <h2 className="title text-white text-center">Частые <span className="text-primary">вопросы</span></h2>

                <div className={s.list}>
                    {list.map((item) => (
                        <FaqItem isDarkMode={true} key={item.id} question={item.question} answer={item.answer} className={s.faqItem} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BusinessFaq;