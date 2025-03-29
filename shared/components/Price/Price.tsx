'use-client'

import { Prices } from "@/shared/types/enums";
import { Tabs, TabsProps } from "antd";
import { FC, useState } from "react";
import AddressSelect from "./AddressSelect/AddressSelect";
import s from './Price.module.scss';
import PriceContent from "./PriceContent/PriceContent";

interface IProps {

}

const Price: FC<IProps> = () => {
  const [selectedPlan, setSelectedPlan] = useState<Prices>(Prices.COMFORT)

  const tabs: TabsProps['items'] = [
    {
      key: Prices.STANDARD,
      label: 'Стандарт',
      children: <PriceContent type={Prices.STANDARD} />
    },
    {
      key: Prices.COMFORT,
      label: 'Комфорт',
      children: <PriceContent type={Prices.COMFORT} />
    },
    {
      key: Prices.COMFORT_PLUS,
      label: 'Комфорт+',
      children: <PriceContent type={Prices.COMFORT_PLUS} />
    },
    {
      key: Prices.BUSINESS,
      label: 'Бизнес',
      children: <PriceContent type={Prices.BUSINESS} />
    },
    {
      key: Prices.MINIVAN,
      label: 'Минивэн',
      children: <PriceContent type={Prices.MINIVAN} />
    },
    {
      key: Prices.DELIVERY,
      label: 'Доставка',
      children: <PriceContent type={Prices.DELIVERY} />
    },
  ]
  return (
    <div className='container-40'>
      <div className={s.top}>
        <h2 className="black-color font-56-medium">Цена такси Ключ</h2>
        <p className="black-color font-16-normal">Комфорт, Бизнес и Минивэн - поездки на любой случай</p>
      </div>


      <Tabs items={tabs} onChange={(key) => setSelectedPlan(key as Prices)} activeKey={selectedPlan} />

      <AddressSelect selectedPlan={selectedPlan} />
    </div>

  )
}

export default Price;
