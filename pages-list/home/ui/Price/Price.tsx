'use client'
import { CalculatorDefault } from "@/feature/calculator";
import { HomeLayout, HomeLayoutTitle } from "@/shared/layouts/homeLayout/HomeLayout";
import { Prices } from "@/shared/types/enums";
import { IRouteData } from "@/shared/types/route.interface";
import { Tabs, TabsProps } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { planLabel } from "./data";
import s from './Price.module.scss';
import PriceContent from "./PriceContent/PriceContent";
import TripConstructor from '@/feature/calculator/ui/trip-constructor/TripConstructor';
import { getRoutePoints } from '@/feature/calculator/route-context';

interface IProps {
  title?: string
  cityData?: string
  routeData?: IRouteData
  withOrderAnchor?: boolean
}

const Price: FC<IProps> = ({ title, cityData, routeData, withOrderAnchor = true }) => {
  const [selectedPlan, setSelectedPlan] = useState<Prices>(Prices.COMFORT)
  const [showMap, setShowMap] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const isMilitary = routeData?.is_svo === 1
  const context = { ...getRoutePoints(routeData, cityData), routeSlug: routeData?.url?.replace(/\.html$/, '') };

  const tabs: TabsProps['items'] = [
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
    <HomeLayout
      top={<HomeLayoutTitle title="Цена трансфера"
        titlePrimary={title} description="Комфорт, Бизнес и Минивэн - поездки на любой случай" />}
    >
      <TripConstructor key={JSON.stringify(context)} context={context} id={withOrderAnchor ? 'order' : undefined}>
      <Tabs
        items={tabs}
        onChange={(key) => {
          setSelectedPlan(key as Prices)
        }}
        activeKey={selectedPlan}
      />

      <div className={s.mapWrapper} ref={sectionRef}>
        {showMap && (
          <CalculatorDefault
            selectedPlan={selectedPlan}
            cityData={cityData}
            routeData={routeData}
          />
        )}
      </div>
      </TripConstructor>

    </HomeLayout>

  )
}

export default Price;
