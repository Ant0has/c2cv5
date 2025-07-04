'use client'

import SwapIcon from "@/public/icons/SwapIcon";
import { planLabel } from "@/shared/components/Price/data";
import Button from "@/shared/components/ui/Button/Button";
import SearchInput from "@/shared/components/ui/SearchInput/SearchInput";
import { COEFFICIENT_100, COEFFICIENT_100_150, COEFFICIENT_150_200, COEFFICIENT_200, prices, SPEED } from "@/shared/constants";
import { yandexMapsService } from "@/shared/services/yandex-maps.service";
import { ButtonTypes, Prices } from "@/shared/types/enums";
import { FullscreenControl, Map, RoutePanel, TrafficControl, ZoomControl } from "@pbe/react-yandex-maps";
import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";
import s from './Calculator.module.scss';

interface IProps {
  title?: unknown
}


const Calculator: FC<IProps> = () => {
  const map = useRef<any>()

  const [planCoefficient, setPlanCoefficient] = useState(prices)
  const [selectedPlan, setSelectedPlan] = useState<Prices>(Prices.STANDARD)

  const [departurePoint, setDeparturePoint] = useState<string>()
  const [departurePointData, setDeparturePointData] = useState<string[]>([])
  const [arrivalPoint, setArrivalPoint] = useState<string>()
  const [arrivalPointData, setArrivalPointData] = useState<string[]>([])
  const [distance, setDistance] = useState<string>('-')
  const [time, setTime] = useState<string>('-')
  const [price, setPrice] = useState<number[]>()

  const plans = [
    {
      key: Prices.STANDARD,
      label: planLabel[Prices.STANDARD],
      coefficient: planCoefficient[Prices.STANDARD]
    },
    {
      key: Prices.COMFORT,
      label: planLabel[Prices.COMFORT],
      coefficient: planCoefficient[Prices.COMFORT]
    },
    {
      key: Prices.COMFORT_PLUS,
      label: planLabel[Prices.COMFORT_PLUS],
      coefficient: planCoefficient[Prices.COMFORT_PLUS]
    },
    {
      key: Prices.BUSINESS,
      label: planLabel[Prices.BUSINESS],
      coefficient: planCoefficient[Prices.BUSINESS]
    },
    {
      key: Prices.MINIVAN,
      label: planLabel[Prices.MINIVAN],
      coefficient: planCoefficient[Prices.MINIVAN]
    },
    {
      key: Prices.DELIVERY,
      label: planLabel[Prices.DELIVERY],
      coefficient: planCoefficient[Prices.DELIVERY]
    },
  ]

  const handleClickSwapAddress = () => {
    setDeparturePoint(arrivalPoint)
    setArrivalPoint(departurePoint)
    setDeparturePointData(arrivalPointData)
    setArrivalPointData(departurePointData)
  }

  const handleChangeDeparturePoint = (value: string) => {
    setDeparturePoint(value)
  }

  const handleSearchDeparturePoint = async (value: string) => {
    const response = await yandexMapsService.getSuggestions(value)
    const uniqueData = [...new Set(response)];
    setDeparturePointData(uniqueData)
  }

  //-----

  const handleChangeArrivalPoint = (value: string) => {
    setArrivalPoint(value)
  }

  const handleSearchArrivalPoint = async (value: string) => {
    const response = await yandexMapsService.getSuggestions(value)
    const uniqueData = [...new Set(response)];
    setArrivalPointData(uniqueData)
  }


  const handleCalculate = async () => {
    if (map?.current) {
      const control = await map.current.routePanel.getRouteAsync();
      const activeRoute = control.getActiveRoute();
      if (activeRoute) {
        const distance = activeRoute.properties.get("distance")
        const duration = activeRoute.properties.get("duration")
        // console.log('duration', duration)

        // setDistance(distance?.text)
        // setTime(duration?.text)
        if (distance?.value) {
          const distanceValue = Math.ceil((distance?.value / 1000) / 10) * 10;

          const convertHoursToRoundedTime = (hours: number): string => {
            let totalMinutes = Math.ceil(hours * 60 / 30) * 30;

            let totalHours = Math.floor(totalMinutes / 60);
            let weeks = Math.floor(totalHours / (24 * 7));
            let remainingHoursAfterWeeks = totalHours % (24 * 7);
            let days = Math.floor(remainingHoursAfterWeeks / 24);
            let roundedHours = remainingHoursAfterWeeks % 24;
            let roundedMinutes = totalMinutes % 60;

            let result = [];
            if (weeks > 0) result.push(`${weeks} нед`);
            if (days > 0) result.push(`${days} дн`);
            if (roundedHours > 0) result.push(`${roundedHours} ч`);
            if (roundedMinutes > 0) result.push(`${roundedMinutes} мин`);

            return result.join(" ");
          };

          const getCoefficient = (distance: number) => {
            if (distance < 100) return COEFFICIENT_100
            if (distance >= 100 && distance < 150) return COEFFICIENT_100_150
            if (distance >= 150 && distance < 200) return COEFFICIENT_150_200
            return COEFFICIENT_200
          }

          const getPrice = () => {
            const result = []
            for (const key in planCoefficient) {
              if (Object.prototype.hasOwnProperty.call(planCoefficient, key)) {
                const currentPrice = planCoefficient[key as Prices];
                const initialPrice = distanceValue * currentPrice * getCoefficient(distanceValue)
                result.push(Math.ceil(initialPrice / 500) * 500)
              }
            }
            return result
          }

          const timeValue = convertHoursToRoundedTime(distanceValue / SPEED)

          setDistance(`${distanceValue} км`)
          setTime(timeValue)
          setPrice(getPrice())
        }
      }
    }

    if (!departurePoint || !arrivalPoint) return;
  };

  useEffect(() => {
    handleCalculate()
  }, [planCoefficient])

  return (
    <div className={clsx("container", s.wrapper)}>
      <div className={s.plans}>
        {plans.map(plan => (
          <div key={plan.key} className={clsx(s.container)}>
            <div className={s.button}>{plan.label}</div>
            <input className={s.input} type="number" value={plan.coefficient} onChange={e => setPlanCoefficient(prev => ({
              ...prev,
              [plan.key]: e.target.value
            }))} />
          </div>
        ))}
      </div>

      <div className={s.block}>
        <div className={s.selection}>
          <div className={s.part}>
            <div className={clsx(s.label, 'font-16-normal')}>Точка отправления</div>
            <SearchInput
              className='departure-select address-select'
              value={departurePoint}
              placeholder="Санкт-Петербург"
              data={departurePointData}
              handleChange={handleChangeDeparturePoint}
              handleSearch={handleSearchDeparturePoint}
            />
          </div>

          <div className={s.swapButtonWrapper}>
            <div
              onClick={handleClickSwapAddress}
              className={s.swapButton}>
              <SwapIcon />
            </div>
          </div>


          <div className={s.part}>
            <div className={clsx(s.label, 'font-16-normal')}>Точка прибытия</div>
            <SearchInput
              className='arrival-select address-select'
              value={arrivalPoint}
              placeholder="Пенза"
              data={arrivalPointData}
              handleChange={handleChangeArrivalPoint}
              handleSearch={handleSearchArrivalPoint}
            />
          </div>
        </div>

        <div className={s.info}>
          <span>Протяженность маршрута: </span>
          <span className="font-18-semibold">{distance}</span>
        </div>
        <div className={s.info}>
          <span>Примерное время в пути: </span>
          <span className="font-18-semibold">{time}</span>
        </div>

        <div className={s.info}>
          <span>Стоимость:	</span>
          <div className={s.priceGrid}>
            {price ? price?.map((el, id) => <div className={s.priceElement}>
              <div className={s.pricePlan}>{plans[id].label}</div>
              <div className={s.priceValue}>{el}р</div>
              <div className={s.pricePlan}>{plans[id].coefficient}р за км</div>
            </div>) : <span className="font-18-semibold">-</span>}
          </div>

        </div>
      </div>


      <Button
        disabled={!departurePoint || !arrivalPoint}
        type={ButtonTypes.PRIMARY}
        text="Рассчитать поездку"
        handleClick={handleCalculate}
      />

      <div></div>

      <div className={s.map}>
        <Map width={'100%'} height={500} defaultState={{
          center: [55.751574, 37.573856],
          zoom: 9,
          controls: [],
        }}>
          <ZoomControl />
          <FullscreenControl />
          <TrafficControl />
          {/* <TypeSelector /> */}
          <RoutePanel

            options={{ float: "right", visible: false }}
            instanceRef={(ref: any) => {
              map.current = ref
              if (ref) {
                ref.routePanel.state.set({
                  from: departurePoint || '',
                  to: arrivalPoint || ''
                });

                ref.routePanel.options.set({
                  autoSelect: true,

                });
              }
            }}
          />
        </Map>
      </div>

    </div >
  )
}

export default Calculator;