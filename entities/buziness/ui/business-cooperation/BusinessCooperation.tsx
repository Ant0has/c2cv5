'use client'
import Button from '@/shared/components/ui/Button/Button';
import s from './BusinessCooperation.module.scss';
import { requisitsData } from '@/shared/data/requisits.data';
import { Blocks, ButtonTypes } from '@/shared/types/enums';
import TelegramIcon from '@/public/icons/TelegramIcon';
import WhatsUpIcon from '@/public/icons/WhatsUpIcon';
import MaxIcon from '@/public/icons/MaxIcon';
import { Image } from 'antd';
import clsx from 'clsx';
import { useIsMobile } from '@/shared/hooks/useResize';
import { useContext, useMemo } from 'react';
import { ModalContext } from '@/app/providers';

interface Props {
    title: { text: string, isPrimary: boolean }[];
    description: string;
    image: string;
    buttonText: string;
}

const BusinessCooperation = ({ title, description, image, buttonText }: Props) => {
    const { setQuestionModalData } = useContext(ModalContext);

    const handleOrderClick = () => {
        setQuestionModalData({ status: true, theme: 'dark', blockFrom: Blocks.DLYA_BIZNESA_COOPERATION })
    }

    return (
        <div className={s.wrapper}>
            <div className={s.inner}>
                <div className={clsx(s.mobileContent, 'container relative z-3')}>
                    <DlyaBiznesaCooperationContent handleOrderClick={handleOrderClick} title={title} description={description} />
                </div>

                <div className={clsx(s.phones)}>
                    <Image
                        className={s.logoImage}
                        src="/images/dlya-biznesa/businessman-logo.png"
                        alt="Businessman Logo Image"
                        width={880} height={560}
                    />
                    {/* <div className={s.glowEffect} /> */}
                    <div className={s.ellipse1} />
                    <div className={s.ellipse2} />
                    <div className={s.ellipse3} />

                    <div className={s.mobileImagePhoneWrapper}>
                        <Image className={s.blockImage}
                            src={image}
                            alt="Businessman Image"
                            width={713} height={684}
                        />
                    </div>
                    <div className={s.mobileLogoPhoneWrapper}>
                        <Image className={s.mobileLogoImage}
                            src="/images/dlya-biznesa/rotated-logo.png"
                            alt="Rotated Logo Image"
                            width={600} height={367}
                        />
                    </div>

                </div>
            </div>

            <div className={s.imagePhone}>
                <div className={s.imagePhoneWrapper}>
                    <Image className={s.blockImage}
                        src={image}
                        alt="Businessman Image"
                        width={713} height={684}
                    />
                </div>
                <div className={s.logoPhoneWrapper}>
                    <Image className={s.logoImage}
                        src="/images/dlya-biznesa/rotated-logo.png"
                        alt="Rotated Logo Image"
                        width={610} height={500}
                    />
                </div>
            </div>

            <div className={s.content}>
                <div className="container">
                    <DlyaBiznesaCooperationContent handleOrderClick={handleOrderClick} title={title} description={description} />
                </div>
            </div>
        </div>
    );
};

export default BusinessCooperation;


const DlyaBiznesaCooperationContent = ({ title,description, handleOrderClick }: { title: { text: string, isPrimary: boolean }[], description: string, handleOrderClick: () => void }) => {
    const isMobile = useIsMobile();

    const contentTitle = title.map(item => {
        if (item.isPrimary) {
          console.log(item.text);
          return <span key={item.text} className="text-primary">{` ${item.text} `}</span>
        }
        return `${item.text}`
      });



    return (
        <>
            <h2 className={clsx('title text-white', { 'text-center': isMobile })}>{contentTitle}</h2>
            <p className={clsx('max-width-600px font-18-medium text-dark-secondary margin-t-16', { 'text-center': isMobile })}>Оставьте заявку — менеджер свяжется с вами <br className={clsx({ 'display-none': isMobile })} /> в течение 15 минут и подготовит индивидуальное предложение</p>
            <div className='margin-t-32'>
                <Button className={clsx({ 'width-full': isMobile })} type={ButtonTypes.PRIMARY} text='Получить предложение' handleClick={handleOrderClick} />
            </div>
            <p className={clsx('font-18-medium text-dark-secondary margin-t-24', { 'text-center': isMobile })}>или свяжитесь с нами:</p>
            <div className={s.links}>
                <a href={`tel:${requisitsData.PHONE}`} className={s.link}>{requisitsData.PHONE_MARKED}</a>
                <a href={`mailto:${requisitsData.EMAIL}`} className={s.link}>{requisitsData.EMAIL}</a>
            </div>
            <div className={s.socials}>
                <Button
                    type={ButtonTypes.LINK}
                    text='Написать'
                    link={`https://t.me/${requisitsData.TELEGRAM_NICKNAME}`}
                    icon={<TelegramIcon />}
                />
                <Button
                    type={ButtonTypes.LINK}
                    text='Написать'
                    link={`https://wa.me/${requisitsData.WHATSAPP_NICKNAME}`}
                    icon={<WhatsUpIcon />}
                />
                <Button
                    type={ButtonTypes.LINK}
                    text='Написать'
                    link={`https://max.ru/${requisitsData.MAX_NICKNAME}`}
                    icon={<MaxIcon />}
                />
            </div>
        </>
    )
}