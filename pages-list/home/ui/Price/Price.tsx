'use-client'
import { Prices } from "@/shared/types/enums";
import { Tabs, TabsProps } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { planLabel } from "./data";
import s from './Price.module.scss';
import PriceContent from "./PriceContent/PriceContent";
import { HomeLayout, HomeLayoutTitle } from "@/shared/layouts/homeLayout/HomeLayout";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/shared/components/loadingSkeleton/LoadingSkeleton";

const AddressSelect = dynamic(
  () => import("./AddressSelect/AddressSelect"),
  {
    loading: () => <LoadingSkeleton height="500px" />,
    ssr: false
  }
);

interface IProps {
  title?: string
  isMilitary?: boolean
  cityData?: string
}

const Price: FC<IProps> = ({ title, isMilitary, cityData }) => {
  const [selectedPlan, setSelectedPlan] = useState<Prices>(Prices.COMFORT)
  const [showMap, setShowMap] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 } // Сработает когда 10% секции будет видно
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <HomeLayout className={s.container}
      top={<HomeLayoutTitle title="Цена такси"
        titlePrimary={title} description="Комфорт, Бизнес и Минивэн - поездки на любой случай" />}
    >
      <Tabs
        items={tabs}
        onChange={(key) => {
          setSelectedPlan(key as Prices)
        }}
        activeKey={selectedPlan}
      />

      <div className={s.mapWrapper} ref={sectionRef}>
        {showMap && (
          <AddressSelect
            isMilitary={isMilitary}
            selectedPlan={selectedPlan}
            cityData={cityData}
          />
        )}
      </div>

      {/* Карта загрузится только когда секция станет видимой */}

    </HomeLayout>

  )
}

export default Price;
