import CreditCardIcon from "@/public/icons/CreditCardIcon";
import MailContactsIcon from "@/public/icons/MailContactsIcon";
import PaperIcon from "@/public/icons/PaperIcon";
import PhoneContactsIcon from "@/public/icons/PhoneContactsIcon";
import WalletIcon from "@/public/icons/WalletIcon";
import Addresses from "@/shared/components/Addresses/Addresses";
import Breadcrumbs from "@/shared/components/Breadcrumbs/Breadcrumbs";
import { EMAIL_ADDRESS, PHONE_NUMBER_FIRST } from "@/shared/constants";
import { formatPhoneNumber } from "@/shared/services/formate-phone-number";
import clsx from "clsx";
import { FC } from "react";
import s from './contactsPage.module.scss';

interface IProps {
  title?: unknown
}

const ContactsPage: FC<IProps> = () => {

  const { markedPhone: markedPhoneFirst, phone: phoneFirst } = formatPhoneNumber(PHONE_NUMBER_FIRST)

  return (
    <div className={clsx(s.container, "container")}>
      <Breadcrumbs />

      <div className="title title-m-32">Контакты</div>

      <div className={clsx(s.contacts, 'content-block margin-b-64-40')}>
        <div className={s.left}>
          <h3 className="font-32-semibold margin-b-24-16">ИП Фурсенко Катерина Валерьевна</h3>
          <p className="font-18-normal margin-b-16">ОГРНИП 318619600202822</p>
          <p className="font-18-normal gray-color">Предварительные заказы на услуги междугородных трансферов</p>
        </div>
        <div className={s.right}>
          <div className={s.contact}>
            <PhoneContactsIcon />
            <a href={`tel:${phoneFirst}`} className='font-32-semibold'>
              {markedPhoneFirst}
            </a>
          </div>

          <div className={s.contact}>
            <MailContactsIcon />
            <a href={`mailto:${EMAIL_ADDRESS}`} className='font-32-semibold'>{EMAIL_ADDRESS}</a>
          </div>
        </div>
      </div>

      <div className="title title-m-32">Оплата</div>

      <div className={clsx(s.payment, 'content-block margin-b-64-40')}>
        <div className={s.left}>
          <h3 className="font-24-medium">Возможные способы оплаты</h3>
        </div>
        <div className={s.right}>
          <div className={s.paymentCard}>
            <WalletIcon />
            <div className={s.paymentCardDescription}>
              <p className="font-24-medium">Наличными</p>
              <p className="font-14-normal">Наличный рассчет</p>
            </div>

          </div>

          <div className={s.paymentCard}>
            <CreditCardIcon />
            <div className={s.paymentCardDescription}>
              <p className="font-24-medium">По карте</p>
              <p className="font-14-normal">Безналичный рассчет</p>
            </div>

          </div>

          <div className={s.paymentCard}>
            <PaperIcon />
            <div className={s.paymentCardDescription}>
              <p className="font-24-medium">Работа с юр.лицами</p>
              <p className="font-14-normal">Выставление счета, Договор, Акты</p>
            </div>
          </div>
        </div>
      </div>

      <div className="title title-m-32">Работа команды</div>

      <div className="title title-m-32">Адреса наших филиалов</div>

      <Addresses />
    </div>
  )
}

export default ContactsPage;