import { IRouteData } from "@/shared/types/route.interface";
import clsx from "clsx";
import { FC } from "react";
import s from "./Faq.module.scss";
import FaqItem from "@/shared/components/FaqItem/FaqItem";

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
                <div className={clsx('title margin-b-48')}>
                    Частые вопросы
                </div>

                <div className={s.list}>
                    {faqItems.map((item, index) => (
                        <FaqItem key={index} question={item.q as string} answer={item.a as string} />
                    ))}
                </div>
            </div>
        </section>
    );
};



export default Faq;
