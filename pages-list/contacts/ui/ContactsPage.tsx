import CreditCardIcon from "@/public/icons/CreditCardIcon";
import MailContactsIcon from "@/public/icons/MailContactsIcon";
import PaperIcon from "@/public/icons/PaperIcon";
import PhoneContactsIcon from "@/public/icons/PhoneContactsIcon";
import WalletIcon from "@/public/icons/WalletIcon";
import Addresses from "@/shared/components/Addresses/Addresses";
import { formatPhoneNumber } from "@/shared/services/formate-phone-number";
import clsx from "clsx";
import { FC } from "react";
import s from './contactsPage.module.scss';
import { requisitsData } from "@/shared/data/requisits.data";
import Requisits from "@/shared/components/requisits/Requisits";
import TextPageLayout from "@/shared/layouts/text-page-layout/TextPageLayout";

interface IProps {
  title?: unknown
}

const ContactsPage: FC<IProps> = () => {

  const { markedPhone: markedPhoneFirst, phone: phoneFirst } = formatPhoneNumber(requisitsData.PHONE)

  return (
    <TextPageLayout title="Контакты" articleClassName="">
      <>
        <div className={clsx(s.contacts, 'content-block margin-b-64 margin-t-16')}>
          <div className={s.left}>
            <h3 className="font-32-semibold margin-b-24">{requisitsData.NAME}</h3>
            <p className="font-18-normal margin-b-16">ОГРНИП {requisitsData.OGRNIP}</p>
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
              <a href={`mailto:${requisitsData.EMAIL}`} className='font-32-semibold'>{requisitsData.EMAIL}</a>
            </div>
          </div>
        </div>
        <div className="title margin-b-32">Оплата</div>

        <div className={clsx('content-block margin-b-64', s.payment)}>
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
        <div className="title margin-b-32">Адреса наших филиалов</div>
        <Addresses />
      </>
    </TextPageLayout>
  )
}

export default ContactsPage;