'use-client'

import { Prices } from "@/shared/types/enums";
import { Tabs, TabsProps } from "antd";
import { FC, useState } from "react";
import AddressSelect from "./AddressSelect/AddressSelect";
import { planLabel } from "./data";
import s from './Price.module.scss';
import PriceContent from "./PriceContent/PriceContent";

interface IProps {
  title?: string
  isMilitary?: boolean
  cityData?: string
}

const Price: FC<IProps> = ({ title, isMilitary, cityData }) => {
  const [selectedPlan, setSelectedPlan] = useState<Prices>(Prices.COMFORT)

  const tabs: TabsProps['items'] = [
    {
      key: Prices.STANDARD,
      label: planLabel[Prices.STANDARD],
      children: <PriceContent isMilitary={isMilitary} type={Prices.STANDARD} />
    },
    {
      key: Prices.COMFORT,
      label: planLabel[Prices.COMFORT],
      children: <PriceContent isMilitary={isMilitary} type={Prices.COMFORT} />
    },
    {
      key: Prices.COMFORT_PLUS,
      label: planLabel[Prices.COMFORT_PLUS],
      children: <PriceContent isMilitary={isMilitary} type={Prices.COMFORT_PLUS} />
    },
    {
      key: Prices.BUSINESS,
      label: planLabel[Prices.BUSINESS],
      children: <PriceContent isMilitary={isMilitary} type={Prices.BUSINESS} />
    },
    {
      key: Prices.MINIVAN,
      label: planLabel[Prices.MINIVAN],
      children: <PriceContent isMilitary={isMilitary} type={Prices.MINIVAN} />
    },
    {
      key: Prices.DELIVERY,
      label: planLabel[Prices.DELIVERY],
      children: <PriceContent isMilitary={isMilitary} type={Prices.DELIVERY} />
    },
  ]
  return (
    <div className='container-40'>
      <div className={s.top}>
        <h2 className="black-color font-56-medium">Цена такси {title}</h2>
        <p className="black-color font-16-normal">Комфорт, Бизнес и Минивэн - поездки на любой случай</p>
      </div>


      <Tabs
        items={tabs}
        onChange={(key) => {
          setSelectedPlan(key as Prices)
        }}
        activeKey={selectedPlan}
      />

      <AddressSelect 
        title={title || 'такси межгород'}
        isMilitary={isMilitary} 
        selectedPlan={selectedPlan} 
        cityData={cityData} 
      />
    </div>

  )
}

export default Price;
