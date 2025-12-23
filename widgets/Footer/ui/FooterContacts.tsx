'use client'

import { RouteContext } from '@/app/providers'
import TelegramIcon from '@/public/icons/TelegramIcon'
import WhatsUpIcon from '@/public/icons/WhatsUpIcon'
import { formatPhoneNumber } from '@/shared/services/formate-phone-number'
import { getSelectedRegion } from '@/shared/services/get-selected-region'
import { ButtonTypes } from '@/shared/types/enums'
import clsx from 'clsx'
import { useContext, useMemo } from 'react'
import Button from '@/shared/components/ui/Button/Button'
import s from '../Footer.module.scss'
import MaxIcon from '@/public/icons/MaxIcon'
import { requisitsData } from '@/shared/data/requisits.data'

const FooterContacts = () => {
  const { route } = useContext(RouteContext)

  const regionData = useMemo(() => getSelectedRegion(route), [route])
  const { markedPhone: markedPhoneFirst, phone: phoneFirst } = formatPhoneNumber(requisitsData.PHONE)
  const { markedPhone: markedPhoneRegion, phone: phoneRegion } = formatPhoneNumber(regionData?.phoneNumber || '')

  return (
    <div className={s.contacts}>
      {regionData?.phoneNumber && (
        <a href={`tel:${phoneRegion}`} className='font-32-semibold white-color'>
          {markedPhoneRegion}
        </a>
      )}
      <a href={`tel:${phoneFirst}`} className='font-32-semibold white-color'>
        {markedPhoneFirst}
      </a>
      <div>
        <p className={clsx(s.phoneDescription, 'font-14-normal white-color')}>8:00 - 23:00 МСК Бесплатно по России</p>
      </div>

      <a href={`mailto:${requisitsData.EMAIL}`} className='font-32-semibold white-color'>
        {requisitsData.EMAIL}
      </a>

      <div className={clsx(s.social, 'row-flex-8')}>
        <Button
          type={ButtonTypes.LINK}
          link={`https://t.me/${requisitsData.TELEGRAM_NICKNAME}`}
          icon={<TelegramIcon />}
          className={s.roundLink}
        />
        <Button
          type={ButtonTypes.LINK}
          link={`https://wa.me/${requisitsData.WHATSAPP_NICKNAME}`}
          icon={<WhatsUpIcon />}
          className={s.roundLink}
        />
        <Button
          type={ButtonTypes.LINK}
          link={`https://max.ru/${requisitsData.MAX_NICKNAME}`}
          icon={<MaxIcon />}
          className={s.roundLink}
        />
      </div>
      <div>
        <p className='font-16-normal white-color'>© {new Date().getFullYear()} city2city. Все права защищены  </p>
      </div>

    </div>
  )
}

export default FooterContacts


