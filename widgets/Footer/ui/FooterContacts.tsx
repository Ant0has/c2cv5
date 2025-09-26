'use client'

import { RouteContext } from '@/app/providers'
import TelegramIcon from '@/public/icons/TelegramIcon'
import WhatsUpIcon from '@/public/icons/WhatsUpIcon'
import { EMAIL_ADDRESS, PHONE_NUMBER_FIRST, TELEGRAM_LINK, WHATS_UP_LINK } from '@/shared/constants'
import { formatPhoneNumber } from '@/shared/services/formate-phone-number'
import { getSelectedRegion } from '@/shared/services/get-selected-region'
import { ButtonTypes } from '@/shared/types/enums'
import clsx from 'clsx'
import { useContext, useMemo } from 'react'
import Button from '@/shared/components/ui/Button/Button'
import s from '../Footer.module.scss'

const FooterContacts = () => {
  const { route } = useContext(RouteContext)

  const regionData = useMemo(() => getSelectedRegion(route), [route])

  return (
    <div className={s.contacts}>
      {regionData?.phoneNumber && (
        <a href={`tel:+${regionData?.phoneNumber}`} className='font-32-semibold white-color'>
          {formatPhoneNumber(regionData?.phoneNumber)}
        </a>
      )}
      <a href={`tel:+${PHONE_NUMBER_FIRST}`} className='font-32-semibold white-color'>
        {formatPhoneNumber(PHONE_NUMBER_FIRST)}
      </a>
      <div>
        <p className={clsx(s.phoneDescription, 'font-14-normal white-color')}>8:00 - 23:00 МСК Бесплатно по России</p>
      </div>

      <a href={`mailto:${EMAIL_ADDRESS}`} className='font-32-semibold white-color'>
        {EMAIL_ADDRESS}
      </a>

      <div className={clsx(s.social, 'row-flex-8')}>
        <Button
          type={ButtonTypes.LINK}
          link={TELEGRAM_LINK}
          icon={<TelegramIcon />}
          className={s.roundLink}
        />
        <Button
          type={ButtonTypes.LINK}
          link={WHATS_UP_LINK}
          icon={<WhatsUpIcon />}
          className={s.roundLink}
        />
      </div>
    </div>
  )
}

export default FooterContacts


