'use client'
import clsx from "clsx";
import { BuzinessCalculator } from "@/feature/calculator";
import { Prices } from "@/shared/types/enums";
import styles from './BusinessB2bCalculator.module.scss';
import Image from "next/image";

const BusinessB2bCalculator = ({ image }: { image: string }) => {
    return (
        <div className={styles.wrapper} id="dlya-biznesa-calculator">
            <div className={styles.content}>
                <h2 className={clsx('title text-white text-center',)}>
                    Рассчитайте предварительную <br /> стоимость
                    <span className="text-primary"> за 30 секунд</span>
                </h2>

                <BuzinessCalculator selectedPlan={Prices.COMFORT} />
            </div>
            <div className={styles.phones}>
                <Image className={styles.carBg} src={image} alt="car image" width={1512} height={450} />
                <Image className={styles.logoBg} src="/images/dlya-biznesa/logo-bg.png" alt="logo image" width={1120} height={570} />
            </div>
        </div>
    )
}

export default BusinessB2bCalculator;