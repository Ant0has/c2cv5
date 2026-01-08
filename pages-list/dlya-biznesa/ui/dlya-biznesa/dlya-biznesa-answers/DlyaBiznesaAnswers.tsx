'use client'

import Image from 'next/image';
import styles from './DlyaBiznesaAnswers.module.scss'
import clsx from 'clsx';
import { problemSolutionsList } from '@/pages-list/dlya-biznesa/utils/data';
import { useIsMobile } from '@/shared/hooks/useResize';

const DlyaBiznesaAnswers = () => {
    const isMobile = useIsMobile();
    return (
        <div className={clsx(styles.wrapper, 'relative')}>

            <div className="container">
                <div className={clsx("title-container flex justify-between relative z-2 items-start", {'flex-col items-center justify-center gap-16 text-center': isMobile})}>
                    <h2 className={'title text-white'}>Почему агрегаторы <span className="text-primary">не подходят для командировок</span></h2>
                    <span className={clsx("font-18-semibold text-secondary", {'text-center': isMobile, 'text-right': !isMobile})}>Комфорт, Бизнес и Минивэн - поездки на любой случай</span>
                </div>

                <Image className={styles.imageBg} src={'/images/dlya-biznesa/map-bg.png'} alt="Map Background" fill sizes="100vw" />

                <div className={styles.cards}>
                    {problemSolutionsList.map((item) => (
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
                                <Image
                                    src={'/icons/ArrowDownIcon.svg'}
                                    alt="Стрелка"
                                    width={24}
                                    height={24}
                                    className={styles.arrowIcon}
                                />
                            </div>

                            <div className={clsx(styles.solution, 'border-radius-24 padding-24')}>
                                <div className="flex items-center gap-8 margin-b-16">
                                    <Image
                                        src={'/icons/CheckIcon.svg'}
                                        alt="Решение"
                                        width={20}
                                        height={15}
                                        className={styles.checkIcon}
                                    />
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

export default DlyaBiznesaAnswers;