import { FC, useState } from "react";
import clsx from "clsx";
import s from "./Faq.module.scss";
import { IRouteData } from "@/shared/types/route.interface";

interface IProps {
    route: IRouteData;
}

const Faq: FC<IProps> = ({ route }) => {

    const faqItems = Object.entries(route)
        .filter(([key, value]) => key.match(/^faq\d+_q$/) && value)
        .map(([key]) => {
            const index = key.match(/^faq(\d+)_q$/)![1]; // номер вопроса
            return {
                q: route[`faq${index}_q` as keyof IRouteData],
                a: route[`faq${index}_a` as keyof IRouteData],
                index: Number(index),
            };
        })
        .filter(item => item.q && item.a)          // убираем null и пустые
        .sort((a, b) => a.index - b.index);

    if (!faqItems.length) return null;

    return (
        <section className={s.wrapper}>
            <div className={clsx("container-40", s.container)}>
                <div className={clsx('title title-m-48')}>
                    Частые вопросы
                </div>

                <div className={s.list}>
                    {faqItems.map((item, index) => (
                        <FaqItem key={index} question={item.q!} answer={item.a!} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FaqItem: FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={clsx(s.item, { [s.open]: open })}>
            <button className={s.question} onClick={() => setOpen(o => !o)}>
                <span className="font-18-semibold">{question}</span>
                <span className={clsx(s.iconWrapper, open && s.rotated)}>
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            <div className={s.answer}>
                <p className="font-16-normal">{answer}</p>
            </div>
        </div>
    );
};

export default Faq;
