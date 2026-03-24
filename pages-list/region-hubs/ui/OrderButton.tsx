'use client'

import { ModalContext } from "@/app/providers"
import { useContext } from "react"
import s from './RegionCityHubPage.module.scss'

export default function OrderButton({ cityName }: { cityName: string }) {
  const { setOrderModalData } = useContext(ModalContext)

  return (
    <button
      className={s.orderButton}
      onClick={() => setOrderModalData({ status: true })}
    >
      Заказать такси {cityName && `из ${cityName}`}
    </button>
  )
}
