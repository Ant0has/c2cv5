import DocumentIcon from '@/public/icons/DocumentIcon';
import { contractDocumentsList, paymentMethodsList } from '../../utils/data';
import s from './DlyaBiznesaContract.module.scss';
import CheckIcon from '@/public/icons/CheckIcon';
import ClockIcon from '@/public/icons/ClockIcon';
import { clsx } from 'clsx';

const DlyaBiznesaContract = () => {
    return (
        <div className={s.wrapper}>
            <div className="container">
                <div className={s.cards}>
                    <div className={s.card}>
                        <div className={s.glowEffect} />
                        <h3 className='title text-white'>
                            Работа <br /> <span className='text-primary'>по договору</span>
                        </h3>
                        <p className={'font-18-medium text-dark-secondary margin-t-16 margin-b-24'}>
                            Полный пакет закрывающих документов для вашей бухгалтерии
                        </p>
                        <ul className={s.documentsList}>
                            {contractDocumentsList.map((item: string) => (
                                <li className={'flex items-center gap-16'}>
                                    <CheckIcon fill='var(--primary)' />
                                    <p className={'font-18-medium text-white'}>{item}</p>
                                </li>
                            ))}
                        </ul>
                        <div className={s.cardFeatures}>
                            <div className={s.cardFeature}>
                                <div className={s.cardFeatureIcon}><DocumentIcon fill='var(--white)' /></div>
                                <div className={s.cardFeatureText}>
                                    <h6 className={'font-16-medium text-white'}>
                                        Работа по ЭДО
                                    </h6>
                                    <p className="font-14-normal text-dark-secondary">Диадок, СБИС</p>
                                </div>
                            </div>
                            <div className={s.cardFeature}>
                                <div className={s.cardFeatureIcon}><ClockIcon fill='var(--white)' /></div>
                                <div className={s.cardFeatureText}>
                                    <h6 className={'font-16-medium text-white'}>Постоплата</h6>
                                    <p className="font-14-normal text-dark-secondary">Для постоянных клиентов</p>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className={clsx(s.card)}>
                        <h3 className='font-48-medium text-white'>Способы оплаты</h3>
                        <p className='font-18-medium text-white margin-t-8 margin-b-24'>Выберите удобный способ оплаты</p>
                        <div className={s.paymentMethods}>
                            {paymentMethodsList.map((item: { id: number, icon: React.ReactNode, title: string, descriptionList: string[] }) => (
                                <div className={s.paymentMethod}>
                                    <div className={s.paymentMethodIcon}>{item.icon}</div>
                                    <div className={s.paymentMethodText}>
                                        <h6 className={s.paymentMethodTitle}>{item.title}</h6>
                                        <ul className={s.paymentMethodDescriptionList}>
                                            {item.descriptionList.map((description: string) => (
                                                <li className='font-14-normal text-white'>{description}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DlyaBiznesaContract;