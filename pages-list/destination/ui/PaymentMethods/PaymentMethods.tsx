'use client'

import s from './PaymentMethods.module.scss'
import clsx from "clsx"

const CardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
  </svg>
)

const CashIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
  </svg>
)

const TransferIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M19.14 12.94C19.05 12.34 18.57 12 18 12H14V13.5H17.64L16.1 17H6.38L3.86 12.35L4.78 10.65L6 13H10V11.5H3.87L3 13L5 17H2V18.5H3.32L4.59 20.82C4.77 21.14 5.1 21.33 5.46 21.33H6.54C6.9 21.33 7.23 21.14 7.41 20.82L8.68 18.5H15.32L16.59 20.82C16.77 21.14 17.1 21.33 17.46 21.33H18.54C18.9 21.33 19.23 21.14 19.41 20.82L20.68 18.5H22V17H17.5L19.14 12.94ZM12 4.5C12 2.57 10.43 1 8.5 1S5 2.57 5 4.5C5 6.43 6.57 8 8.5 8S12 6.43 12 4.5ZM6.5 4.5C6.5 3.4 7.4 2.5 8.5 2.5S10.5 3.4 10.5 4.5S9.6 6.5 8.5 6.5S6.5 5.6 6.5 4.5Z" fill="currentColor"/>
  </svg>
)

const QrIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M3 11H11V3H3V11ZM5 5H9V9H5V5ZM3 21H11V13H3V21ZM5 15H9V19H5V15ZM13 3V11H21V3H13ZM19 9H15V5H19V9ZM19 19H21V21H19V19ZM13 13H15V15H13V13ZM15 15H17V17H15V15ZM13 17H15V19H13V17ZM15 19H17V21H15V19ZM17 17H19V19H17V17ZM17 13H19V15H17V13ZM19 15H21V17H19V15Z" fill="currentColor"/>
  </svg>
)

const PaymentMethods = () => {
  const methods = [
    { icon: <CashIcon />, title: 'Наличные', description: 'Оплата водителю по прибытии' },
    { icon: <CardIcon />, title: 'Банковская карта', description: 'Visa, MasterCard, МИР' },
    { icon: <TransferIcon />, title: 'Перевод на счёт', description: 'Для юрлиц с НДС и без' },
    { icon: <QrIcon />, title: 'СБП / QR-код', description: 'Мгновенный перевод через банк' },
  ]

  return (
    <section className={s.payment}>
      <div className="container">
        <h2 className={clsx('title', 'margin-b-32')}>Способы оплаты</h2>
        <div className={s.grid}>
          {methods.map((method, index) => (
            <div key={index} className={s.card}>
              <div className={s.cardIcon}>{method.icon}</div>
              <div className={s.cardInfo}>
                <h3 className={s.cardTitle}>{method.title}</h3>
                <p className={s.cardDescription}>{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PaymentMethods
