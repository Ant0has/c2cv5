'use client'

import ArrowDownIcon from '@/public/icons/ArrowDownIcon';
import CheckIcon from '@/public/icons/CheckIcon';
import { useIsMobile } from '@/shared/hooks/useResize';
import clsx from 'clsx';
import Image from 'next/image';
import styles from './BusinessAnswers.module.scss';

interface Props {
    title: {text: string, isPrimary: boolean}[];
    list: {id: number, problem: {title: string, description: string}, solution: {title: string, description: string}}[];
}

const BusinessAnswers = ({ title, list }: Props) => {
    const isMobile = useIsMobile();

    const contentTitle = title.map(item => {
        if (item.isPrimary) {
            return <span key={item.text} className="text-primary">{` ${item.text} `}</span>
        }
        return `${item.text}`
    });

    return (
        <div className={clsx(styles.wrapper, 'relative')}>

            <div className="container">
                <div className={clsx("title-container flex justify-between relative z-2 items-baseline", {'flex-col items-center justify-center gap-16 text-center': isMobile})}>
                    <h2 className={'title text-white max-width-800'}>{contentTitle}</h2>
                    <span className={clsx("font-18-semibold text-secondary", {'text-center': isMobile, 'text-right': !isMobile})}>Комфорт, Бизнес и Минивэн - поездки на любой случай</span>
                </div>

                <Image className={styles.imageBg} src={'/images/dlya-biznesa/map-bg.png'} alt="Map Background" fill sizes="100vw" />

                <div className={styles.cards}>
                    {list.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={clsx(styles.problem, 'border-radius-24 bg-dark')}>
                                <div className={styles.iconWrapper}>
                                    <Image
                                        src={'/icons/CrossIcon.svg'}
                                        alt="Проблема"
                                        width={20}
                                        height={20}
                                        className={styles.crossIcon}
                                    />
                                </div>

                                <div className={styles.content}>
                                    <h4 className="font-18-semibold text-error margin-b-8">
                                        {item.problem.title}
                                    </h4>
                                    <p className={clsx('font-16-normal text-gray', styles.problemDescription)}>
                                        {item.problem.description}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={styles.arrow}>
                                <ArrowDownIcon fill='var(--primary)'/>
                            </div>

                            <div className={clsx(styles.solution, 'border-radius-24 padding-24')}>
                                <div className={styles.solutionIconWrapper}>
                                    <CheckIcon fill='var(--primary)' />
                                </div>

                                <div className={styles.content}>
                                    <h4 className="font-18-semibold text-primary margin-b-8">
                                        {item.solution.title}
                                    </h4>
                                    <p className={clsx('font-16-normal', styles.solutionDescription)}>
                                        {item.solution.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BusinessAnswers;