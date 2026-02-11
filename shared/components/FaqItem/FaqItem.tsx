'use client';
import { b2bGoals } from '@/shared/services/analytics.service'
import DropArrowIcon from "@/public/icons/DropArrowIcon";
import clsx from "clsx";
import { FC, useState } from "react";
import s from "./FaqItem.module.scss";

interface IProps {
    question: string | null;
    answer: string | null;
    className?: string;
    isDarkMode?: boolean;
}

const FaqItem: FC<IProps> = ({ question, answer, className, isDarkMode = false }) => {
    const [open, setOpen] = useState(false);

    const itemClass = isDarkMode ? ` ${s.item} ${s.itemDark}` : s.item;
    const openClass = isDarkMode ? ` ${s.open} ${s.openDark}` : s.open;
    const rotatedClass = isDarkMode ? ` ${s.rotated} ${s.rotatedDark}` : s.rotated;
    const iconClass = isDarkMode ? ` ${s.icon} ${s.iconDark}` : s.icon;
    const questionClass = isDarkMode ? ` ${s.question} ${s.questionDark}` : s.question;
    const answerClass = isDarkMode ? ` ${s.answer} ${s.answerDark}` : s.answer;

    const handleToggle = () => {
        if (!open) {
            b2bGoals.faqOpened(question || '');
        }
        setOpen(o => !o);
    };

    return (
        <div className={clsx(itemClass, open && openClass, className)}>
            <button className={questionClass} onClick={handleToggle}>
                <span className="font-18-semibold">{question}</span>
                <span className={clsx(s.iconWrapper, open && rotatedClass, iconClass)}>
                    
                    <DropArrowIcon/>
                </span>
            </button>

            <div className={answerClass}>
                <p className="font-16-normal">{answer}</p>
            </div>
        </div>
    );
};

export default FaqItem;
